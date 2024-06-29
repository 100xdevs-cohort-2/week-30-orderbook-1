"use client";
import { MarketBar } from "@/app/components/MarketBar";
import { SwapUI } from "@/app/components/SwapUI";
import { TradeView } from "@/app/components/TradeView";
import Trades from "@/app/components/Trades";
import { Depth } from "@/app/components/depth/Depth";
import { useParams } from "next/navigation";
import { useEffect, useImperativeHandle, useState } from "react";

export default function Page() {
  const { market } = useParams();
  const [type, setType] = useState("book");
  return (
    <div className="flex flex-row flex-1">
      <div className="flex flex-col flex-1">
        <MarketBar market={market as string} />
        <div className="flex flex-row h-[920px] border-y border-slate-800">
          <div className="flex flex-col flex-1">
            <TradeView market={market as string} />
          </div>
          <div>
            <div className="flex gap-5">
              <BookButton type={type} setType={setType} />
              <TradeButton type={type} setType={setType} />
            </div>
            {type === "book" ? (
              <div className="flex p-1 flex-col w-[250px] overflow-hidden">
                <Depth market={market as string} />
              </div>
            ) : (
              <div className="flex p-1 flex-col w-[250px] overflow-hidden">
                <Trades market={market as string} />
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="w-[10px] flex-col border-slate-800 border-l"></div>
      <div>
        <div className="flex flex-col w-[250px]">
          <SwapUI market={market as string} />
        </div>
      </div>
    </div>
  );
}
function BookButton({ type, setType }: { type: string; setType: any }) {
  return (
    <div
      className="flex flex-col cursor-pointer justify-center py-2"
      onClick={() => setType("book")}
    >
      <div
        className={`text-sm font-medium py-1 border-b-2 ${
          type === "book"
            ? "border-accentBlue text-baseTextHighEmphasis"
            : "border-transparent text-baseTextMedEmphasis hover:border-baseTextHighEmphasis hover:text-baseTextHighEmphasis"
        }`}
      >
        Book
      </div>
    </div>
  );
}

function TradeButton({ type, setType }: { type: string; setType: any }) {
  return (
    <div
      className="flex flex-col cursor-pointer justify-center py-2"
      onClick={() => setType("trade")}
    >
      <div
        className={`text-sm font-medium py-1 border-b-2 ${
          type === "trade"
            ? "border-accentBlue text-baseTextHighEmphasis"
            : "border-b-2 border-transparent text-baseTextMedEmphasis hover:border-baseTextHighEmphasis hover:text-baseTextHighEmphasis"
        } `}
      >
        Trades
      </div>
    </div>
  );
}
