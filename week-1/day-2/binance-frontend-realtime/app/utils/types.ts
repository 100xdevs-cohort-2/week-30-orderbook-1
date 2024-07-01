
export interface KLine {
    close: string;
    end: string;
    high: string;
    low: string;
    open: string;
    quoteVolume: string;
    start: string;
    trades: string;
    volume: string;
}

export interface Trade {
    "id": number,
    "isBuyerMaker": boolean,
    "price": string,
    "quantity": string,
    "quoteQuantity": string,
    "timestamp": number
}

export interface Depth {
    bids: [string, string][],
    asks: [string, string][],
    lastUpdateId: string
}

export interface Ticker {
    "firstPrice": string,
    "high": string,
    "lastPrice": string,
    "low": string,
    "priceChange": string,
    "priceChangePercent": string,
    "quoteVolume": string,
    "symbol": string,
    "trades": string,
    "volume": string
}

export interface MarketData {
    "name" : string,
    "symbol" : string,
    "image": string,
    "market_cap": number,
}

export interface Market{
    "name" : string,
    "symbol" : string,
    "image": string,
    "market_cap": number,
    "lastPrice": string,
    "priceChangePercent": string,
    "marketSymbol" : string
    "quoteVolume": string
}