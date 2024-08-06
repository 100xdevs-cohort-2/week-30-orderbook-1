import axios from "axios";
import { Depth, KLine, MarketData, Ticker, Trade } from "./types";
import { allSymbols } from "./consts";

const BASE_URL = "http://localhost:3006/api/v1";
const MARKET_URL = "https://price-indexer.workers.madlads.com/?ids=solana,usd-coin,pyth-network,jito-governance-token,tether,bonk,helium,helium-mobile,bitcoin,ethereum,dogwifcoin,jupiter-exchange-solana,parcl,render-token,sharky-fi,tensor,wormhole,wen-4,cat-in-a-dogs-world,book-of-meme,raydium,hivemapper,kamino,drift-protocol,nyan,jeo-boden,habibi-sol,io,zeta,shuffle-2,pepe,shiba-inu,chainlink,uniswap,ondo-finance,holograph,starknet,matic-network,fantom,mon-protocol,blur,worldcoin-wld,polyhedra-network,unagi-token,layerzero";

export async function getTicker(market: string): Promise<Ticker> {
    const tickers = await getTickers();
    const ticker = tickers.find(t => t.symbol === market);
    if (!ticker) {
        throw new Error(`No ticker found for ${market}`);
    }
    return ticker;
}

export async function getTickers(): Promise<Ticker[]> {
     const response = await axios.get(`${BASE_URL}/tickers`, {
        headers: {
            'Referer': 'https://rb.com', // Set this to the domain you want to mimic
            'Origin': 'https://rb.com',  // Set this to the domain you want to mimic
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36', // Optional: Mimic a specific user-agent if needed
            'Accept': 'application/json, text/plain, */*',
            'Accept-Language': 'en-US,en;q=0.9'
            // Add other headers as needed
        }
    });
    return response.data;
}

export async function getMarketData()  {
    const response = await axios.get(`${MARKET_URL}`);
    const marketArray = response.data;
    const filteredMarketData : MarketData[]= [];
    marketArray.forEach((market: any) => {
        filteredMarketData.push({name : market.name , symbol : market.symbol, image : market.image , market_cap : market.market_cap});
    });
    return filteredMarketData;
}


export async function getDepth(market: string): Promise<Depth> {
    const response = await axios.get(`${BASE_URL}/depth?symbol=${market}`);
    return response.data;
}
export async function getTrades(market: string): Promise<Trade[]> {
    const response = await axios.get(`${BASE_URL}/trades?symbol=${market}`);
    return response.data;
}

export async function getKlines(market: string, interval: string, startTime: number, endTime: number): Promise<KLine[]> {
    const response = await axios.get(`${BASE_URL}/klines?symbol=${market}&interval=${interval}&startTime=${startTime}&endTime=${endTime}`);
    const data: KLine[] = response.data;
    return data.sort((x, y) => (Number(x.end) < Number(y.end) ? -1 : 1));
}

export async function getAllKlines()
{
    const klineHashMap = new Map();

    allSymbols.forEach(async(symbol) =>
    {
        const key = symbol.split("_")[0].toLowerCase();
        try
        {
            const klineData = await getKlines(symbol, "1h", Math.floor((new Date().getTime() - 1000 * 60 * 60 * 24 * 7) / 1000), Math.floor(new Date().getTime() / 1000)); 
            
            klineHashMap.set(key , klineData);
        }catch(err)
        {
            klineHashMap.set(key , []);
        }
    });
    return klineHashMap;
} 
