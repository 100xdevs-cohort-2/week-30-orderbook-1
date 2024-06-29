import { Depth, KLine, Ticker, Trade } from "./types";

export const BASE_URL = "wss://ws.backpack.exchange/";

export class SignalingManager {
  private ws: WebSocket;
  private static instance: SignalingManager;
  private bufferedMessages: any[] = [];
  private callbacks: { [type: string]: any[] } = {};
  private id: number;
  private initialized: boolean = false;

  private constructor(private signalingServerUrl?: string) {
    this.ws = new WebSocket(signalingServerUrl || BASE_URL);
    this.bufferedMessages = [];
    this.id = 1;
    this.init();
  }

  init() {
    this.ws.onopen = () => {
      this.initialized = true;
      this.bufferedMessages.forEach((message) => {
        this.ws.send(JSON.stringify(message));
      });
      this.bufferedMessages = [];
    };
    this.ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      const type = message.data.e;
      if (this.callbacks[type]) {
        this.callbacks[type].forEach(({ callback }) => {
          if (type === "ticker") {
            const newTicker: Partial<Ticker> = {
              firstPrice: message.data.o,
              lastPrice: message.data.c,
              high: message.data.h,
              low: message.data.l,
              volume: message.data.v,
              quoteVolume: message.data.V,
              symbol: message.data.s,
              eventTime: message.data.E,
              // timestamp: message.data.E,
            };
            console.log("ticker", newTicker);
            callback(newTicker);
          }
          if (type === "depth") {
            const newTicker: Partial<Depth> = {
              bids: message.data.b,
              asks: message.data.a,
            };
            console.log("depth", newTicker);
            callback(newTicker);
          }
          if (type === "trade") {
            const newTicker: Partial<Trade> = {
              id: message.data.t,
              isBuyerMaker: message.data.m,
              price: message.data.p,
              quantity: message.data.q,
              quoteQuantity: message.data.q,
              timestamp: message.data.T,
            };
            callback(newTicker);
          }
        });
      }
    };
  }

  public static getInstance(signalingServerUrl?: string) {
    if (!this.instance) {
      this.instance = new SignalingManager(signalingServerUrl);
    }
    return this.instance;
  }

  sendMessage(message: any) {
    const messageToSend = {
      ...message,
      id: this.id++,
    };
    if (!this.initialized) {
      this.bufferedMessages.push(messageToSend);
      return;
    }
    this.ws.send(JSON.stringify(messageToSend));
  }

  async registerCallback(type: string, callback: any, id: string) {
    this.callbacks[type] = this.callbacks[type] || [];
    this.callbacks[type].push({ callback, id });
  }

  async deRegisterCallback(type: string, id: string) {
    if (this.callbacks[type]) {
      const index = this.callbacks[type].findIndex(
        (callback) => callback.id === id
      );
      if (index !== -1) {
        this.callbacks[type].splice(index, 1);
      }
    }
  }
}
