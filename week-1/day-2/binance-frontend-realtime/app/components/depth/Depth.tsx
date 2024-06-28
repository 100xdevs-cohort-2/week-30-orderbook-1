"use client";

import { useEffect, useState } from "react";
import { getDepth, getKlines, getTicker, getTrades } from "../../utils/httpClient";
import { BidTable } from "./BidTable";
import { AskTable } from "./AskTable";
import { SignalingManager } from "@/app/utils/SignalingManager";
import { Depth } from "@/app/utils/types";

export function DepthComponent({ market }: {market: string}) {
    const [bids, setBids] = useState<[string, string][]>([]);
    const [asks, setAsks] = useState<[string, string][]>([]);
    const [price, setPrice] = useState<string>();

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


       
        
        SignalingManager.getInstance().sendMessage({"method":"SUBSCRIBE","params":[`depth.200ms.${market}`]});
        return () => {
            SignalingManager.getInstance().deRegisterCallback("depth", `Depth-${market}`);
            SignalingManager.getInstance().sendMessage({"method":"UNSUBSCRIBE","params":[`depth.200ms.${market}`]}	);
        }
    }, [market])
    
    return <div className="h-[500px] overflow-y-scroll no-scrollbar ">
        <TableHeader />
        {asks && <AskTable asks={asks} />}
        {price && <div>{price}</div>}
        {bids && <BidTable bids={bids} />}
    </div>
}

function TableHeader() {
    return <div className="flex justify-between text-xs">
    <div className="text-white">Price</div>
    <div className="text-slate-500">Size</div>
    <div className="text-slate-500">Total</div>
</div>
}