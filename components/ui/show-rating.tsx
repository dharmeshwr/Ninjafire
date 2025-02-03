"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { GetRatingWithPeople } from "@/actions/rating-action";
import { Star, User } from "lucide-react";

import { cn, throttle } from "@/lib/utils";

export function ShowRating() {
  const [data, setData] = useState({ rating: 0, people: 0 });
  const [show, setShow] = useState(false);
  const pathname = usePathname();

  const handleMouseMove = (event: MouseEvent) => {
    const { clientX, clientY } = event;
    const radius = 70;
    if (
      clientX > window.innerWidth - radius &&
      clientY > window.innerHeight - radius
    ) {
      setShow(true);
    } else {
      setShow(false);
    }
  };

  useEffect(() => {
    const fetcher = async () => {
      const { rating, people } = await GetRatingWithPeople();
      setData({ rating: Number(rating), people: Number(people) });
    };

    fetcher();

    if (pathname == "/") {
      const throttledMouseHandler = throttle(handleMouseMove, 150);

      window.addEventListener("mousemove", throttledMouseHandler);
      return () =>
        window.removeEventListener("mousemove", throttledMouseHandler);
    }
  }, [pathname]);

  return (
    <div
      className={cn(
        "fixed bottom-0 right-0 z-20 m-2 cursor-pointer rounded border border-foreground/40 bg-background p-1 shadow-lg",
        "transition-transform duration-300 ease-in-out",
        show == false
          ? "translate-x-12 translate-y-12"
          : "translate-x-0 translate-y-0",
      )}
    >
      <div className="flex gap-2">
        {String(data.rating)}
        <Star />
        <strong>|</strong>
        {String(data.people)}
        <User />
      </div>
    </div>
  );
}
