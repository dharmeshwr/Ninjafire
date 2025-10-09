"use client";

import { useEffect, useRef, useState } from "react";
import { GetRatingWithPeople, UpdateRating } from "@/actions/rating-action";

import { cn } from "@/lib/utils";

export default function GetRating() {
  const [starHover, setStarHover] = useState(-1);
  const [rating, setRating] = useState(-1);
  const [ratingData, setRatingData] = useState({ rating: "0.0", people: "0" });
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    (async () => {
      const res = await GetRatingWithPeople();
      if (res.success) {
        setRatingData({ rating: res.rating, people: res.people });
      }
    })();

    const ratedCookie = document.cookie
      .split(";")
      .find((cookie) => cookie.trim().startsWith("hasRated="));

    if (ratedCookie) {
      const ratedValue = Number(ratedCookie.split("=")[1]);
      setRating(ratedValue);
    }
  }, []);

  const handleRatingChange = async (index: number) => {
    setRating(index);
    await UpdateRating(index);
    const res = await GetRatingWithPeople();
    if (res.success) {
      setRatingData({ rating: res.rating, people: res.people });
      if (!audioRef.current) {
        audioRef.current = new Audio("/sounds/tea.mp3");
      }
      audioRef.current.currentTime = 0;
      audioRef.current.volume = 1;
      audioRef.current.play();
    }
  };

  return (
    <div className="text-md w-fit">
      {Array.from({ length: 5 }).map((_, index) => (
        <span
          key={index}
          className={cn(
            "cursor-pointer transition-colors duration-300 ease-in-out",
            index <= starHover && "text-orange-900",
            rating > 0 && index <= rating && "text-orange-900",
          )}
          onMouseOver={() => setStarHover(index)}
          onMouseOut={() => setStarHover(-1)}
          onClick={() => handleRatingChange(index)}
        >
          (star)
        </span>
      ))}
      <span className="ml-1">
        - {ratingData.rating} stars from {ratingData.people} people
      </span>
    </div>
  );
}
