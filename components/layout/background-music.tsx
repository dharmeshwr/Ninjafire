"use client";

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
    </div>
  );
}
