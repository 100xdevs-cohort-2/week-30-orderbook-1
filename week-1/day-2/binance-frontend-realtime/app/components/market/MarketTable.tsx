"use client";
import {  getAllKlines, getMarketData, getTickers } from "@/app/utils/httpClient";
import {  Market, MarketData, Ticker } from "@/app/utils/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"


export const MarketTable= () =>
{
    const marketDataMap = new Map(); 
    const [market , setMarket] = useState<Market[]>([]);
    const router = useRouter();
   

     useEffect(() => {
        const fetchData = async () => {
            try {
                
                const [marketdata, tickers] = await Promise.all([getMarketData(), getTickers() ]);

                

                marketdata.forEach(m => marketDataMap.set(m.symbol.toLowerCase(), m));

                const updatedMarkets: Market[] = tickers.reduce<Market[]>((acc, ticker) => {
                    const symbol = ticker.symbol.split("_")[0].toLowerCase();
                    const marketData = marketDataMap.get(symbol);
                
                    if (marketData) {
                        const { name, symbol, image, market_cap } = marketData;
                        const { lastPrice: last_price, priceChangePercent, volume, quoteVolume } = ticker;

                        acc.push({ 
                            name, 
                            symbol, 
                            image, 
                            market_cap, 
                            lastPrice: last_price, 
                            priceChangePercent, 
                            marketSymbol : ticker.symbol, 
                            quoteVolume 
                        });
                    }
                    return acc;
                }, []);

                
                updatedMarkets.sort((a, b) => b.market_cap - a.market_cap);
                
                setMarket(updatedMarkets);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            }
        };

        fetchData();
    }, []);
 

    return (
        <table className="w-full table-auto">
           <thead>
                <tr>
                    <th className="px-2 py-3 text-left text-sm font-normal text-baseTextMedEmphasis first:pl-7 first:pr-0 last:pl-0 last:pr-7">
                        <div className="flex items-center gap-1 cursor-pointer select-none">
                            Name
                            <span className="w-[16px]"></span>
                        </div>
                    </th>
                    <th className="px-2 py-3 text-left text-sm font-normal text-baseTextMedEmphasis first:pl-7 first:pr-0 last:pl-0 last:pr-7">
                        <div className="flex items-center gap-1 cursor-pointer select-none">
                            Price
                            <span className="w-[16px]"></span>
                        </div>
                    </th>
                    <th className="px-2 py-3 text-left text-sm font-normal text-baseTextMedEmphasis first:pl-7 first:pr-0 last:pl-0 last:pr-7">
                        <div className="flex items-center gap-1 cursor-pointer select-none">
                            Market Cap
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-arrow-down h-4 w-4">
                                <path d="M12 5v14"></path><path d="m19 12-7 7-7-7"></path>
                            </svg>
                        </div>
                    </th>
                    <th className="px-2 py-3 text-left text-sm font-normal text-baseTextMedEmphasis first:pl-7 first:pr-0 last:pl-0 last:pr-7">
                        <div className="flex items-center gap-1 cursor-pointer select-none">
                            24h Volume
                            <span className="w-[16px]"></span>
                        </div>
                    </th>
                    <th className="px-2 py-3 text-left text-sm font-normal text-baseTextMedEmphasis first:pl-7 first:pr-0 last:pl-0 last:pr-7">
                        <div className="flex items-center gap-1 cursor-pointer select-none">
                            24h Change
                            <span className="w-[16px]"></span>
                        </div>
                    </th>
                </tr>
            </thead>
            <tbody>
                {market.map((coin : Market) =>
                {
                    return <MarketRow price={coin.lastPrice} symbol={coin.symbol}  name = {coin.name}  market_cap ={coin.market_cap}  quoteVolume= {coin.quoteVolume} image = {coin.image} priceChangePercent = {coin.priceChangePercent} marketSymbol = {coin.marketSymbol} router = {router}/>
                })}
            </tbody>
        </table>
    )
}

function MarketRow({price , symbol , name , market_cap , image , priceChangePercent , quoteVolume , marketSymbol , router} : {price : string , symbol : string , name : string  , market_cap : number  , image : string , priceChangePercent : string , quoteVolume: string , marketSymbol : string , router : any}) {
    return (
        <tr className="cursor-pointer border-t border-baseBorderLight hover:bg-slate-800" onClick={() => router.push(`/trade/${marketSymbol}`) }>
                        <td className="px-2 py-3 first:pl-7 first:pr-0 last:pl-0 last:pr-7">
                            <div className="flex shrink">
                                <div className="flex items-center undefined">
                                    <div className="relative flex-none overflow-hidden rounded-full border border-baseBorderMed w-10 h-10" >
                                        <div className="relative">
                                            <img alt={`${name} Logo`} loading="lazy" width="40" height="40" decoding="async" data-nimg="1" className=""  src={image} />
                                        </div>
                                    </div>
                                    <div className="ml-4 flex flex-col">
                                        <p className="whitespace-nowrap text-base font-medium text-baseTextHighEmphasis">{name}</p>
                                    <div className="flex items-center justify-start flex-row gap-2">
                                        <p className="flex-medium text-left text-xs leading-5 text-baseTextMedEmphasis">{symbol.toUpperCase()}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </td>
                    <td className="px-2 py-3 first:pl-7 first:pr-0 last:pl-0 last:pr-7">
                        <p className="text-base font-medium tabular-nums">${price}</p>
                    </td>
                    <td className="px-2 py-3 first:pl-7 first:pr-0 last:pl-0 last:pr-7">
                        <p className="text-base font-medium tabular-nums">{formatMarketCap(market_cap)}</p>
                    </td>
                    <td className="px-2 py-3 first:pl-7 first:pr-0 last:pl-0 last:pr-7">
                        <p className="text-base font-medium tabular-nums">{formatMarketCap(Number(quoteVolume))}</p>
                    </td>
                    <td className="px-2 py-3 first:pl-7 first:pr-0 last:pl-0 last:pr-7">
                        <PricePercent priceChangePercent={priceChangePercent}/>
                    </td>
                   
                </tr>
    )
}


function formatMarketCap(num : number) {



  if (num >= 1e12) {
    return `$${(num / 1e12).toFixed(1)}T`;
  } else if (num >= 1e9) {
    return `$${(num / 1e9).toFixed(1)}B`;
  } else if (num >= 1e6) {
    return `$${(num / 1e6).toFixed(1)}M`;
  } else if (num >= 1e3) {
    return `$${(num / 1e3).toFixed(1)}K`;
  } else {
    return `$${num}`;
  }
}


function PricePercent({priceChangePercent} : {priceChangePercent : string})
{
    let number = parseFloat(priceChangePercent); // Convert string to number
    let percent = (number * 100).toFixed(2) + '%';

    return number < 0 ?  <p className="text-base font-medium tabular-nums text-redText">{percent}</p> :
        <p className="text-base font-medium tabular-nums text-greenText">+{percent}</p>
}

