"use client";

import { Trade } from "../utils/types";



export default function Trades({
    trades,
}:{
    trades: Partial<Trade>[],
}){
    return <div className="relative mt-6">
        <TableHeader />
        <div className="h-[500px] relative overflow-y-scroll no-scrollbar">
        { trades && trades.map((trade,index)=>{
            let timestamp = trade.timestamp!;
            let date = new Date(timestamp);
            // Extract hours, minutes, and seconds
            let hours = date.getUTCHours();
            // Get minutes part from the timestamp
            let minutes = date.getUTCMinutes();
            // Get seconds part from the timestamp
            let seconds = date.getUTCSeconds();

            // Pad hours, minutes, and seconds to ensure two digits
            let formattedHours = String(hours).padStart(2, '0');
            let formattedMinutes = String(minutes).padStart(2, '0');
            let formattedSeconds = String(seconds).padStart(2, '0');

            // Format the time as HH.MM.SS
            let timeStr = `${formattedHours}.${formattedMinutes}.${formattedSeconds}`;
            return (
                <>
                <div key={index}className="flex justify-between text-xs w-full">
                    <div>
                        {trade.price}
                    </div>
                    <div>
                        {trade.quantity}
                    </div>
                    <div>
                        {timeStr}
                    </div>
                </div>
                </>
            )
        })
        }
        </div>  
    </div>
}

function TableHeader() {
    return <div className="absolute top-0 left-0 w-full h-5 flex justify-between text-xs bg-black z-10">
    <div className="text-white">Price</div>
    <div className="text-slate-500">Qunatity</div>
    <div className="text-slate-500">Time</div>
</div>
}