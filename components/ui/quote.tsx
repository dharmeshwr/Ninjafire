"use client";

import { useEffect, useState } from "react";
import { getQuote } from "@/actions/quote-action";

type QuoteProp = {
  q: string;
  a: string;
  h: string;
  date: number;
};
const QUOTE_KEY = "quote";

export const Quote = () => {
  const [quote, setQuote] = useState({
    q: "",
    a: "",
    h: "",
    date: new Date().getDate(),
  });

  useEffect(() => {
    (async () => {
      try {
        const data = localStorage.getItem(QUOTE_KEY) ?? "{}";
        const savedQuote = JSON.parse(data);

        if (data.length > 0 && savedQuote.date === quote.date) {
          setQuote(savedQuote);
        } else {
          const data: QuoteProp = await getQuote();
          if (data) {
            setQuote(data);
            data["date"] = new Date().getDate();
            localStorage.setItem(QUOTE_KEY, JSON.stringify(data));
          }
        }
      } catch (error) {
        console.error("Failed to load quote:", error);
      }
    })();
  }, []);

  if (!quote?.q.length) {
    return (
      <div className="mx-auto flex w-full max-w-md flex-col items-center pt-10">
        <div className="mb-2 h-4 w-3/4 animate-pulse rounded bg-neutral-400/20"></div>
        <div className="h-4 w-1/3 animate-pulse rounded bg-neutral-400/20"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center pt-10 text-center">
      <blockquote className="font-semibold">&ldquo;{quote.q}&ldquo;</blockquote>
      <span className="font-cursive pt-3 text-4xl">&mdash; {quote.a}</span>
    </div>
  );
};
