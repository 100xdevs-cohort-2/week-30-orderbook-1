import { MarketTable } from "../components/market/MarketTable";

export default function Page() {
    return (
        <div className="h-screen text-white">
            <div className="flex flex-row flex-1">
                <div className="flex justify-center flex-row flex-1">
                    <div className="flex flex-col flex-1 max-w-[1280px]">
                        <div className="flex flex-col pb-8">
                            <div className="flex items-center flex-row my-4">
                                <p className="text-baseTextHighEmphasis text-[28px] font-semibold">Markets</p>
                            </div>
                            <div className="flex flex-col w-full rounded-lg bg-baseBackgroundL1 py-3">
                                <MarketTable/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}