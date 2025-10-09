import { useState } from "react";
import { audioAtom } from "@/store";
import { useAtom } from "jotai";

export function useAudioManager() {
  const [audios, setAudios] = useAtom(audioAtom);
  const [isPlaying, setIsPlaying] = useState(false);

  const playBg = (src: string, volume = 0.15) => {
    let audio = audios["bg"];
    if (!audio) {
      audio = new Audio(src);
      audio.loop = true;
      audio.volume = volume;
      setAudios((prev) => ({ ...prev, bg: audio }));
    }
    audio.play().catch(() => {});
  };

  const playEffect = (src: string, volume = 1) => {
    const audio = new Audio(src);
    audio.volume = volume;

    const bg = audios["bg"];
    if (bg) bg.pause();

    audio.addEventListener("ended", () => {
      if (bg) bg.play();
    });
    audio.play();
  };

  const stopBg = () => {
    const bg = audios["bg"];
    if (bg) bg.pause();
  };

  const toggleBackgroundMusic = () => {
    if (isPlaying) {
      stopBg();
    } else {
      playBg("/sounds/bg.mp3", 0.15);
    }
    setIsPlaying((prev) => !prev);
  };

  return { playBg, playEffect, stopBg, isPlaying, toggleBackgroundMusic };
}
