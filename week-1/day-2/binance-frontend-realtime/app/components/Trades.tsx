import React, { useEffect, useState } from "react";
import { SignalingManager } from "../utils/SignalingManager";
import { Trade } from "../utils/types";
import moment from "moment";
import { getTrades } from "../utils/httpClient";

const Trades = ({ market }: { market: string }) => {
  const [trades, setTrades] = useState<Trade[]>();

  useEffect(() => {
    getTrades(market).then((d) => {
      // setBids(d.bids.reverse());
      setTrades(d);
    });
    SignalingManager.getInstance().registerCallback(
      "trade",
      (data: Partial<Trade>) => {
        if (data) {
          console.log("trades data aya hai", data);
          let newData: Trade = {
            id: data.id ? data.id : 0,
            isBuyerMaker: data.isBuyerMaker ? data.isBuyerMaker : false,
            price: data.price ? data.price : "",
            quantity: data.quantity ? data.quantity : "",
            quoteQuantity: data.quoteQuantity ? data.quoteQuantity : "",
            timestamp: data.timestamp ? data.timestamp : 0,
          };
          setTrades((prev) => (prev && data ? [newData, ...prev] : [newData]));
        }
      },
      market
    );

    SignalingManager.getInstance().sendMessage({
      method: "SUBSCRIBE",
      params: [`trade.${market}`],
    });

    return () => {
      SignalingManager.getInstance().deRegisterCallback("trade", market);
      SignalingManager.getInstance().sendMessage({
        method: "UNSUBSCRIBE",
        params: [`trade.${market}`],
      });
    };
  }, [market]);
  return (
    <div>
      <TradeHeader />
      <div className="flex flex-col justify-between">
        {trades?.slice(0, 25)?.map((data) => {
          return (
            <TradesTable
              key={data.id}
              price={data.price}
              quantity={data.quantity}
              timestamp={data.timestamp}
            />
          );
        })}
      </div>
    </div>
  );
};
function TradeHeader() {
  return (
    <div className="flex justify-between text-xs">
      <div className="text-white">Price (USDC)</div>
      <div className="text-slate-500">Qty (SOL)</div>
      <div className="text-slate-500">time</div>
    </div>
  );
}
function TradesTable({
  price,
  quantity,
  timestamp,
}: {
  price: string;
  quantity: string;
  timestamp: number;
}) {
  return (
    <div
      style={{
        display: "flex",
        position: "relative",
        width: "100%",
        backgroundColor: "transparent",
        overflow: "hidden",
      }}
    >
      <div className={`flex justify-between text-xs w-full`}>
        <div className="text-[#04945f] font-normal">{price}</div>
        <div className="text-[#d3d3d4]">{quantity}</div>
        <div className="text-[#848c9b]">
          {moment(timestamp).format("hh:mm:ss")}
        </div>
      </div>
    </div>
  );
}
export default Trades;
