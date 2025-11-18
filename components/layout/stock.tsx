import { getStocks } from "@/actions/stock-action";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import Balancer from "react-wrap-balancer";

export default async function Stocks() {
  const stocks = await getStocks();

  return (
    <div className="border border-black p-1">
      <Balancer className="mb-3 block font-yorktown text-3xl uppercase italic mix-blend-multiply">
        Stocks Update
      </Balancer>

      <div>
        {Object.entries(stocks).map(([ticker, data]) => {
          if (!data) return;

          const change = data.close - data.open;
          const changePercent = ((change / data.open) * 100).toFixed(2);
          const isPositive = change >= 0;

          return (
            <div key={ticker} className="mb-2 flex justify-between">
              <div className="text-[1.1rem] font-bold"> {ticker} </div>

              <div className="flex gap-10 text-[1.1rem]">
                <div> ${data.close.toFixed(2)} </div>
                <div className="flex items-center gap-1">
                  {isPositive ? (
                    <ArrowUpIcon size={20} />
                  ) : (
                    <ArrowDownIcon size={20} />
                  )}
                  <span>
                    {isPositive ? "+" : ""}${Math.abs(change).toFixed(2)}(
                    {isPositive ? "+" : ""}
                    {changePercent}%)
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
