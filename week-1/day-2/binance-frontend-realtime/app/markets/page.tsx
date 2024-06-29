"use client";
import { useEffect, useState } from "react";
import MarketTable from "../components/MarketTable";
import { getMarketData } from "../utils/httpClient";
import { useParams } from "next/navigation";
import { MarketData } from "../utils/types";

export default function Page() {
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  useEffect(() => {
    getMarketData().then((data) => {
      console.log("this is the markedata", data);
      setMarketData(data);
    });
  }, []);
  return (
    <div className="flex flex-row flex-1">
      <div className="flex px-24 flex-col justify-center items-center flex-1 pt-[100px]">
        <MarketTable data={marketData} />
      </div>
    </div>
  );
}
