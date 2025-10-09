"use client";

import { useAudioManager } from "@/lib/audio";

export default function WeatherBox({ weather }: { weather: string }) {
  const { playEffect } = useAudioManager();

  return (
    <div
      onClick={() => playEffect("/sounds/wind.wav")}
      className="relative flex max-w-48 flex-col items-center justify-center text-center font-slab max-[1200px]:hidden"
    >
      <span>WEATHER</span>
      <hr className="my-1 w-full" />
      <span className="leading-5">{weather}</span>
    </div>
  );
}
