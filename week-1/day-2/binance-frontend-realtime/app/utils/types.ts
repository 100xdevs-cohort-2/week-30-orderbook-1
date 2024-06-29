export interface KLine {
  open: string;
  close: string;
  high: string;
  low: string;
  end: string;
  quoteVolume?: string;
  start: string;
  trades: string;
  volume: string;
}

export interface Trade {
  id: number;
  isBuyerMaker: boolean;
  price: string;
  quantity: string;
  quoteQuantity: string;
  timestamp: number;
}

export interface Depth {
  bids: [string, string][];
  asks: [string, string][];
  lastUpdateId: string;
}

export interface Ticker {
  firstPrice: string;
  lastPrice: string;
  high: string;
  low: string;
  priceChange: string;
  priceChangePercent: string;
  quoteVolume: string;
  symbol: string;
  trades: string;
  volume: string;
  eventTime: number;
}

type CurrencyDetails = {
  price: number;
  market_cap: number;
  price_change_percentage_24hr: number;
  volume: number;
};

export type MarketData = {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  roi: number | null;
  last_updated: string;
  price_change_percentage_24h_in_currency: number;
  currencies: {
    cad: CurrencyDetails;
    cny: CurrencyDetails;
    eur: CurrencyDetails;
    gbp: CurrencyDetails;
    jpy: CurrencyDetails;
    usd: CurrencyDetails;
  };
};
