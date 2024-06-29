"use client";

import { useEffect, useState } from "react";
import {
  getDepth,
  getKlines,
  getTicker,
  getTrades,
} from "../../utils/httpClient";
import { BidTable } from "./BidTable";
import { AskTable } from "./AskTable";
import { SignalingManager } from "@/app/utils/SignalingManager";
<<<<<<< HEAD
import { Depth, Ticker } from "@/app/utils/types";
=======
>>>>>>> 3617fd85ae94badc4370ca4a5a1bba5634a9b4d0

export function Depth({ market }: { market: string }) {
  const [bids, setBids] = useState<[string, string][]>();
  const [asks, setAsks] = useState<[string, string][]>();
  const [price, setPrice] = useState<string>();
  useEffect(() => {
    try {
      getDepth(market).then((d) => {
        // setBids(d.bids.reverse());
        setBids(d.bids);

<<<<<<< HEAD
        setAsks(d.asks);
      });

      getTicker(market).then((t) => setPrice(t.lastPrice));
      getTrades(market).then((t) => setPrice(t[0].price));
    } catch (error) {}
    // getKlines(market, "1h", 1640099200, 1640100800).then(t => setPrice(t[0].close));
  }, []);
  useEffect(() => {
    SignalingManager.getInstance().registerCallback(
      "depth",
      (data: Partial<Depth>) => {
        if (data) {
          setBids((prev) =>
            prev && data?.bids ? [...data.bids, ...prev] : []
          );

          setAsks((prev) =>
            prev && data?.asks ? [...data.asks, ...prev] : []
          );
        }
      },
      market
    );
    SignalingManager.getInstance().registerCallback(
      "ticker",
      (data: Partial<Ticker>) => setPrice(data?.lastPrice),
      market
    );
    SignalingManager.getInstance().sendMessage({
      method: "SUBSCRIBE",
      params: [`depth.${market}`],
    });
    // SignalingManager.getInstance().sendMessage({
    //   method: "SUBSCRIBE",
    //   params: [`ticker.${market}`],
    // });

    return () => {
      SignalingManager.getInstance().deRegisterCallback("depth", market);
      // SignalingManager.getInstance().deRegisterCallback("ticker", market);
      SignalingManager.getInstance().sendMessage({
        method: "UNSUBSCRIBE",
        params: [`depth.${market}`],
      });
      document.title = "Apni exchange";

      // SignalingManager.getInstance().sendMessage({
      //   method: "UNSUBSCRIBE",
      //   params: [`ticker.${market}`],
      // });
    };
  }, [market]);
  console.log("rerender");

  return (
    <div>
      <TableHeader />
      <div className=" overflow-scroll hideScrollBar h-[520px] ">
=======
    useEffect(() => {
        SignalingManager.getInstance().registerCallback("depth", (data: any) => {
            
            setBids((originalBids) => {
                const bidsAfterUpdate = [...(originalBids || [])];

                for (let i = 0; i < bidsAfterUpdate.length; i++) {
                    for (let j = 0; j < data.bids.length; j++)  {
                        if (bidsAfterUpdate[i][0] === data.bids[j][0]) {
                            bidsAfterUpdate[i][1] = data.bids[j][1];
                            break;
                        }
                    }
                }
                return bidsAfterUpdate; 
            });

            setAsks((originalAsks) => {
                const asksAfterUpdate = [...(originalAsks || [])];

                for (let i = 0; i < asksAfterUpdate.length; i++) {
                    for (let j = 0; j < data.asks.length; j++)  {
                        if (asksAfterUpdate[i][0] === data.asks[j][0]) {
                            asksAfterUpdate[i][1] = data.asks[j][1];
                            break;
                        }
                    }
                }
                return asksAfterUpdate; 
            });
        }, `DEPTH-${market}`);
        
        SignalingManager.getInstance().sendMessage({"method":"SUBSCRIBE","params":[`depth.${market}`]});

        getDepth(market).then(d => {    
            setBids(d.bids.reverse());
            setAsks(d.asks);
        });

        getTicker(market).then(t => setPrice(t.lastPrice));
        getTrades(market).then(t => setPrice(t[0].price));
        // getKlines(market, "1h", 1640099200, 1640100800).then(t => setPrice(t[0].close));
        return () => {
            SignalingManager.getInstance().sendMessage({"method":"UNSUBSCRIBE","params":[`depth.200ms.${market}`]});
            SignalingManager.getInstance().deRegisterCallback("depth", `DEPTH-${market}`);
        }
    }, [])
    
    return <div>
        <TableHeader />
>>>>>>> 3617fd85ae94badc4370ca4a5a1bba5634a9b4d0
        {asks && <AskTable asks={asks} />}
        {price && <div>{price}</div>}
        {bids && <BidTable bids={bids} />}
      </div>
    </div>
  );
}

function TableHeader() {
  return (
    <div className="flex justify-between text-xs">
      <div className="text-white">Price</div>
      <div className="text-slate-500">Size</div>
      <div className="text-slate-500">Total</div>
    </div>
  );
}
