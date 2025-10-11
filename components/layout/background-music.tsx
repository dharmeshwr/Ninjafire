"use client";

import Image from "next/image";

import { useAudioManager } from "@/lib/audio";

export default function BackgroundMusic() {
  const { isPlaying, toggleBackgroundMusic } = useAudioManager();

  return (
    <div className="mx-auto cursor-pointer py-2 text-center text-sm">
      <button onClick={toggleBackgroundMusic}>
        {!isPlaying
          ? "Want to hear some string quintet while reading ?"
          : "Nope !"}
      </button>
      <div className="relative flex h-fit justify-center">
        {isPlaying && (
          <Image
            src={"/gifs/102.gif"}
            alt="Voilin"
            width={200}
            height={200}
            className="absolute mix-blend-multiply"
            unoptimized
          />
        )}
      </div>
    </div>
  );
}
