"use client";

import { BidTable } from "./BidTable";
import { AskTable } from "./AskTable";
import { SignalingManager } from "@/app/utils/SignalingManager";


export function DepthComponent({
    asks,
    bids,
    price,
}:{
    asks: [string, string][],
    bids: [string, string][],
    price: string,
}) {
    



    return <div className="relative mt-6">
        <TableHeader />
        <div className="h-[500px] relative overflow-y-scroll no-scrollbar">
            {asks && <AskTable asks={asks} />}
            {price && <div>{price}</div>}
            {bids && <BidTable bids={bids} />}
        </div>  
    </div>
}

function TableHeader() {
    return <div className="absolute top-0 left-0 w-full h-5 flex justify-between text-xs bg-black z-10">
    <div className="text-white">Price</div>
    <div className="text-slate-500">Size</div>
    <div className="text-slate-500">Total</div>
</div>
}