import { useEffect, useRef, useState } from "react";
import { ChartManager } from "../utils/ChartManager";
import { getKlines } from "../utils/httpClient";
import { KLine } from "../utils/types";
import { SignalingManager } from "../utils/SignalingManager";

export function TradeView({
  market,
}: {
  market: string;
}) {

  const chartRef = useRef<HTMLDivElement>(null);
  const chartManagerRef = useRef<ChartManager>(null);

  useEffect(() => {
    
      if (chartRef) {
        if (chartManagerRef.current) {
          chartManagerRef.current.destroy();
        }

        const chartManager = new ChartManager(
          chartRef.current,
          [],
          {
            background: "#0e0f14",
            color: "white",
          }
        );
        //@ts-ignore
        chartManagerRef.current = chartManager;
      }


      SignalingManager.getInstance().registerCallback('kline', (data:any)=>{
        chartManagerRef.current?.update(data);

      }, `Kline-${market}`);
 
      SignalingManager.getInstance().sendMessage({"method":"SUBSCRIBE","params":[`kline.5m.${market}`]});

    return ()=>{
        SignalingManager.getInstance().deRegisterCallback("kline", `Kline-${market}`);
        SignalingManager.getInstance().sendMessage({"method":"UNSUBSCRIBE","params":[`kline.5m.${market}`]}	);
    }

  }, [market, chartRef]);

  return (
    <>
      <div ref={chartRef} style={{ height: "520px", width: "100%", marginTop: 4 }}></div>
    </>
  );
}
