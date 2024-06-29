"use client";
import { useEffect, useState } from "react";
import { SignalingManager } from "@/app/utils/SignalingManager";
import { Depth, Trade } from "@/app/utils/types";
import { DepthComponent } from "./depth/Depth";
import Trades from "./Trades";

export function DepthAndTrade({ market }: {market: string}) {
    const [bids, setBids] = useState<[string, string][]>([]);
    const [asks, setAsks] = useState<[string, string][]>([]);
    const [price, setPrice] = useState<string>("");
    const [trades, setTrades] = useState<Partial<Trade>[]>([]);
    const [type, setType] = useState<'books' | 'trades'>('books');

    useEffect(() => {

        SignalingManager.getInstance().registerCallback("depth", (data: any)  => {
           setBids((previousBids)=>{
               let newBids = [...previousBids];
               for(let i=0; i<data.bids.length; i++){
                   let found = false;
                   for(let j=0; j<previousBids.length; j++){
                       if(data.bids[i][0] === previousBids[j][0]){
                           newBids[j][1] = data.bids[i][1];
                           found = true;
                           break;
                       }
                   }
                   if(!found){
                       newBids.push(data.bids[i]);
                   }
               }
               // remove 0 quantity data 
               newBids = newBids.filter(bid => bid[1] !== "0.00");
               //reverse sort by pppu and take the first 15
               newBids = newBids.sort((a, b) => Number(b[0]) - Number(a[0])).slice(0,50);
               return newBids;
           })
           setAsks((previousAsks)=>{
               let newAsks = previousAsks;
               for(let i=0; i<data.asks.length; i++){
                   let found = false;
                   for(let j=0; j<previousAsks.length; j++){
                       if(data.asks[i][0] === previousAsks[j][0]){
                           
                           newAsks[j][1] = data.asks[i][1];
                           found = true;
                           break;
                       }
                   }
                   if(!found){
                       newAsks.push(data.asks[i]);
                   }
               }
               // remove 0 quantity data 
               newAsks = newAsks.filter(ask => ask[1] !== "0.00");
               // sort by ppu
               newAsks = newAsks.sort((a, b) => Number(a[0]) - Number(b[0])).slice(0,50);
                return newAsks;
           })
         
        }, `Depth-${market}`);
        SignalingManager.getInstance().registerCallback("trade", (data: Partial<Trade>)  => {
            
            setTrades((previousTrades)=>{
                let newTrades = [...previousTrades];
                newTrades = newTrades.reverse();
                newTrades.push(data);
                newTrades = newTrades.reverse();
                newTrades = newTrades.slice(0,50);
                return newTrades;
            })
        }, `Trade-${market}`);

        
        SignalingManager.getInstance().sendMessage({"method":"SUBSCRIBE","params":[`depth.200ms.${market}`]});
        SignalingManager.getInstance().sendMessage({"method":"SUBSCRIBE","params":[`trade.${market}`]});
        return () => {
            SignalingManager.getInstance().deRegisterCallback("depth", `Depth-${market}`);
            SignalingManager.getInstance().sendMessage({"method":"UNSUBSCRIBE","params":[`depth.200ms.${market}`]}	);
            SignalingManager.getInstance().sendMessage({"method":"UNSUBSCRIBE","params":[`trade.${market}`]}	);
        }
    }, [market])
    
    return <div className="relative">
         <TableHeader type={type} setType={setType} />
        {/* <div className="h-[500px] relative overflow-y-scroll no-scrollbar">
            {asks && <AskTable asks={asks} />}
            {price && <div>{price}</div>}
            {bids && <BidTable bids={bids} />}
        </div>  */}
        {type==="trades" && <Trades trades={trades} />}
        {type==="books" && <DepthComponent asks={asks} bids={bids} price={price} />}
    </div>
}

function TableHeader({type, setType}: {type: string, setType: any}) {
    return <div className="absolute top-0 left-0 w-full h-5 flex gap-5 text-xs bg-black z-10">
    <BookButton type={type} setType={setType} />
    <TradesButton type={type} setType={setType} />
</div>
}

function BookButton({ type, setType }: { type: string, setType: any }) {
    return <div className="flex flex-col cursor-pointer justify-center py-2" onClick={() => setType('books')}>
    <div 
    className={`text-sm font-medium py-1 border-b-2 ${type === 'books' ? "border-accentBlue text-baseTextHighEmphasis" : "border-transparent text-baseTextMedEmphasis hover:border-baseTextHighEmphasis hover:text-baseTextHighEmphasis"}`}
    >
        Books
    </div>
</div>
}

function TradesButton({ type, setType }: { type: string, setType: any }) {
    return  <div className="flex flex-col cursor-pointer justify-center py-2" onClick={() => setType('trades')}>
    <div 
    className={`text-sm font-medium py-1 border-b-2 ${type === 'trades' ? "border-accentBlue text-baseTextHighEmphasis" : "border-b-2 border-transparent text-baseTextMedEmphasis hover:border-baseTextHighEmphasis hover:text-baseTextHighEmphasis"} `}
    >
        Trades
    </div>
    </div>
}