import Image from "next/image";
import { getQuote } from "@/actions/quote-action";
import { getWeather } from "@/actions/weather-action";
import { format } from "date-fns";

export default async function Header() {
  const weather = await getWeather();
  const quote = await getQuote();
  const date = format(new Date(), "EEEE, MMM dd, yyyy");

  return (
    <div className="pt-8">
      <div className="flex w-full items-center justify-between px-6">
        <div className="flex flex-col items-center justify-center text-center font-slab max-[1200px]:hidden">
          <span>The People&apos; s Paper</span>
          <hr className="my-1 w-full" />
          <span>HOME EDITION</span>
          <hr className="my-1 w-full" />
          <span>All the news, All the time</span>
        </div>

        <div className="w-full">
          <div className="flex items-center justify-center gap-4 font-oldEnglish text-7xl max-[700px]:flex-col">
            <span>Undefined</span>
            <Image
              src="/logo.svg"
              alt="Logo"
              width={150}
              height={100}
              className="scale-110 max-[700px]:absolute max-[700px]:top-10 max-[700px]:scale-150 max-[700px]:opacity-40"
            />
            <span>Chronicle</span>
          </div>
          <div className="mx-auto mt-2 flex w-full items-center justify-center text-center font-slab leading-3 max-[700px]:w-3/4 max-[700px]:pt-2 max-[700px]:leading-5">
            {quote?.q}
          </div>
        </div>

        <div className="relative flex max-w-48 flex-col items-center justify-center text-center font-slab max-[1200px]:hidden">
          <span>WEATHER</span>
          <hr className="my-1 w-full" />
          <span className="leading-5">{weather}</span>
        </div>
      </div>

      <div className="mt-4">
        <hr className="my-0.5 w-full" />
        <hr className="my-0.5 w-full" />
        <div className="flex flex-wrap items-center justify-between gap-2 text-center font-slab leading-5 max-[600px]:justify-center max-[600px]:gap-x-10">
          <div>
            <span className="mr-2"> Vol. LXXIV, </span>
            <span> No. 72 </span>
          </div>
          <div className="max-[1200px]:hidden">CCC</div>
          <div className="order-3 max-[600px]:order-4">Gurugram, {date}</div>
          <div className="max-[1200px]:hidden">****</div>
          <div className="order-4 max-[600px]:order-3">DAILY, 5 CENTS</div>
        </div>
        <hr className="my-0.5 w-full" />
        <hr className="my-0.5 w-full" />
      </div>
    </div>
  );
}
