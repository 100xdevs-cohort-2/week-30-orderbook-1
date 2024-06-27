"use client";

import { useEffect, useState } from "react";
import { getDepth, getKlines, getTicker, getTrades } from "../../utils/httpClient";
import { BidTable } from "./BidTable";
import { AskTable } from "./AskTable";
import { SignalingManager } from "@/app/utils/SignalingManager";
import { Depth as DepthType } from "@/app/utils/types";


export function Depth({ market }: {market: string}) {
    const [bids, setBids] = useState<[string, string][]>([]);
    const [asks, setAsks] = useState<[string, string][]>([]);
    const [price, setPrice] = useState<string>();



    const modifyItems = (setItems : React.Dispatch<React.SetStateAction<[string , string][]>>, item : [string , string] | undefined, ascending = true) => {
    if (item === undefined) return;

    const price = item[0];
    const size = item[1];

    setItems((prevItems : any) => {
        if (prevItems === undefined) return prevItems;

        let newItems = [...prevItems];

        const itemIndex = prevItems.findIndex((i : any) => i[0] === price);

        if (size === "0.00") {
            if (itemIndex !== -1) {
                newItems.splice(itemIndex, 1);
            }
        } else {
            if (itemIndex === -1) {
                newItems = [...newItems, item];
            } else {
                newItems[itemIndex][1] = size;
            }
            newItems.sort((a, b) => ascending ? Number(a[0]) - Number(b[0]) : Number(b[0]) - Number(a[0]));
        }

        return newItems;
    });
};

    useEffect(() => {
        getDepth(market).then(d => {
            setBids(d.bids.reverse());
            setAsks(d.asks);
        });
        SignalingManager.getInstance().registerCallback("ticker" , (data : any) => {
            setPrice(data.lastPrice);
        } , `ticker-${market}`);
        SignalingManager.getInstance().registerCallback("depth" , (data : any) => {
               const bids = data.bids;   
               const asks = data.asks;

               bids.forEach((bid : [string , string]) => {
                    modifyItems(setBids , bid , false);
               });         

               asks.forEach((ask : [string , string]) => {
                    modifyItems(setAsks , ask , true);
               });  
        } , `depth-${market}`)

        getTicker(market).then(t => setPrice(t.lastPrice));
        getTrades(market).then(t => setPrice(t[0].price));

        SignalingManager.getInstance().sendMessage({"method":"SUBSCRIBE","params":[`depth.200ms.${market}`]});
        return () => {
            SignalingManager.getInstance().deRegisterCallback("depth", `depth-${market}`);
            SignalingManager.getInstance().deRegisterCallback("ticker" , `ticker-${market}`);
            SignalingManager.getInstance().sendMessage({"method":"UNSUBSCRIBE","params":[`depth.200ms.${market}`]});
        }
        // getKlines(market, "1h", 1640099200, 1640100800).then(t => setPrice(t[0].close));
    }, [])

    
    return <div>
        <TableHeader />
        {asks && <AskTable asks={asks} />}
        {price && <div className="text-greenText">{price}</div>}
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