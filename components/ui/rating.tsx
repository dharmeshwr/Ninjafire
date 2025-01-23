"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { UpdateRating } from "@/actions/rating-action";
import { Star } from "lucide-react";

import { cn } from "@/lib/utils";

export default function Rating() {
  const [starHover, setStarHover] = useState(-1);
  const [rating, setRating] = useState(-1);
  const [showHand, setShowHand] = useState(false);

  useEffect(() => {
    const hasRated = document.cookie
      .split(";")
      .some((cookie) => cookie.trim().startsWith(`hasRated=`));
    if (hasRated) return;

    const timeoutId = setTimeout(() => setRating(0), 1000);
    return () => clearTimeout(timeoutId);
  }, []);

  const handleRatingChange = async (index: number) => {
    setRating(index);

    const { success } = await UpdateRating(index);

    if (success) {
      document.cookie = `hasRated=true; max-age=${365 * 24 * 60 * 60}; path=/`;
    }

    setTimeout(() => {
      setShowHand(true);
      setTimeout(() => {
        setRating(-1);
        setShowHand(false);
      }, 600);
    }, 700);
  };

  return (
    <>
      <div
        className={cn(
          "fixed bottom-10 min-w-[19rem] rounded-lg border border-foreground/10 bg-background p-4 shadow-lg transition-all duration-500",
          rating == 0 ? "translate-y-0" : "pointer-events-none translate-y-36",
        )}
      >
        <span>What would you rate this portfolio ?</span>
        <div className="mt-2 flex w-full">
          {Array.from({ length: 5 }).map((_, index) => (
            <Star
              key={index}
              className={cn(
                "w-full cursor-pointer transition-colors duration-300 ease-in-out",
                index <= starHover && "text-orange-500",
                rating > 0 && index <= rating && "text-orange-500",
              )}
              onMouseOver={() => setStarHover(index)}
              onMouseOut={() => setStarHover(-1)}
              onClick={() => handleRatingChange(index)}
            />
          ))}
        </div>
      </div>
      <div
        className={cn(
          "fixed bottom-10 block rounded-lg border border-foreground/10 bg-background p-4 shadow-lg transition-all duration-500",
          rating > 0 ? "translate-y-0" : "pointer-events-none translate-y-36",
        )}
      >
        <span>Have a lovely day 🤗</span>
      </div>
      <Image
        src={"/hand.png"}
        alt="*"
        width={60}
        height={60}
        className={cn(
          "fixed bottom-10 transition-all duration-500",
          showHand ? "translate-y-12 rotate-12" : "translate-y-36 rotate-45",
        )}
      />
    </>
  );
}
