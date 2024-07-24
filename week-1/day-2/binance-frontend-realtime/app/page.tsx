"use client"
import Image from "next/image";
import { PrimaryButton, SuccessButton } from "./components/core/Button";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <div className=" h-auto grid grid-cols-3">
        <div className="col-span-2 m-16" >
          
              <div className="text-white font-bold" style={{fontSize: '5rem'}}>
                 Look First/
              </div>
              <div className="text-white font-bold" style={{fontSize: '5rem'}}>
                 Then Leap.
              </div>
              <div className="text-white font-bold" style={{fontSize: '1.5rem'}}>
                 <p>The best trades require research, then <br />commitment.</p>
              </div>

              <div className="flex mt-10">
                <div className="p-2 mr-2">
                    <SuccessButton onClick={() => router.push("/markets")}>All Markets</SuccessButton>
                    <PrimaryButton onClick={() => {
                
                      router.push('/trade/SOL_USDC');
                    }}>Solana</PrimaryButton>
                </div>
            </div>
        </div>
       <div className="col-span-1 relative">
    <div className="absolute bottom-0 right-24 text-white" >
        <div style={{ fontSize: "1.5rem" }}>
          MarketNexus.inc
        </div>
        <div className="text-gray-400 flex justify-end" 
        style={{fontSize: "1rem"}}>
            CEO: Ritik Bora
        </div>
    </div>
    
</div>

    </div>
  );
}
