"use client";

import { useRef } from "react";

export default function HomeEdition() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleClick = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio("/sounds/mandl.mp3");
    }
    audioRef.current.currentTime = 0;
    audioRef.current.play();
  };

  return (
    <div
      onClick={handleClick}
      className="flex flex-col items-center justify-center text-center font-slab max-[1200px]:hidden"
    >
      <span className="block whitespace-nowrap">The People&apos;s Paper</span>
      <hr className="my-1 w-full" />
      <span>HOME EDITION</span>
      <hr className="my-1 w-full" />
      <span>All the news, All the time</span>
    </div>
  );
}
