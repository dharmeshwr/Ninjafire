import { getStocks } from "@/actions/stock-action";
import { ArrowDownIcon, ArrowUpIcon, Minus, Plus } from "lucide-react";
import Balancer from "react-wrap-balancer";

export default async function Stocks() {
  const stocks = await getStocks();

  return (
    <div className="border border-black p-1">
      <Balancer className="mb-3 block font-yorktown text-3xl uppercase mix-blend-multiply">
        Stocks Update
      </Balancer>

      <div>
        {Object.entries(stocks).map(([ticker, data]) => {
          if (!data) return;

          const change = data.close - data.open;
          const changePercent = Math.abs((change / data.open) * 100).toFixed(2);
          const isPositive = change >= 0;

          return (
            <div
              key={ticker}
              className="mb-2 grid grid-cols-4 items-center gap-2"
            >
              <div className="text-[1.1rem] font-bold">{ticker}</div>

              <div className="col-span-1 text-left text-[1.1rem] font-medium">
                ${data.close.toFixed(2)}
              </div>

              <div
                className={
                  "col-span-2 flex items-center justify-center gap-1 text-[1.1rem]"
                }
              >
                {isPositive ? (
                  <ArrowUpIcon size={18} className="shrink-0" />
                ) : (
                  <ArrowDownIcon size={18} className="shrink-0" />
                )}
                {isPositive ? <Plus size={11} /> : <Minus size={11} />}$
                {Math.abs(change).toFixed(2)}
                <span className="flex items-center text-sm opacity-90">
                  ( {isPositive ? <Plus size={11} /> : <Minus size={11} />}{" "}
                  {changePercent}%)
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
