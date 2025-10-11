import { useState } from "react";
import { audioAtom } from "@/store";
import { useAtom } from "jotai";

export function useAudioManager() {
  const [audios, setAudios] = useAtom(audioAtom);
  const [isPlaying, setIsPlaying] = useState(false);
  const [soundEffects, setSoundEffects] = useState<
    Map<string, HTMLAudioElement>
  >(new Map());

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

  const playAudio = (src: string, volume = 0.5) => {
    // Stop if already playing
    if (soundEffects.has(src)) {
      const existingAudio = soundEffects.get(src)!;
      existingAudio.pause();
      existingAudio.currentTime = 0;
    }

    const audio = new Audio(src);
    audio.volume = volume;

    const bg = audios["bg"];
    if (bg) bg.pause();

    audio.addEventListener("ended", () => {
      if (bg && isPlaying) bg.play();
      setSoundEffects((prev) => {
        const newMap = new Map(prev);
        newMap.delete(src);
        return newMap;
      });
    });

    audio.play();

    setSoundEffects((prev) => {
      const newMap = new Map(prev);
      newMap.set(src, audio);
      return newMap;
    });
  };

  const stopAudio = (src: string) => {
    const audio = soundEffects.get(src);
    if (audio) {
      audio.pause();
      audio.currentTime = 0;

      setSoundEffects((prev) => {
        const newMap = new Map(prev);
        newMap.delete(src);
        return newMap;
      });

      // Resume background music if no other sounds are playing
      if (soundEffects.size === 1) {
        // Will be 0 after delete
        const bg = audios["bg"];
        if (bg && isPlaying) {
          bg.play();
        }
      }
    }
  };

  const stopBg = () => {
    const bg = audios["bg"];
    if (bg) bg.pause();
  };

  const toggleBackgroundMusic = () => {
    if (isPlaying) {
      stopBg();
    } else {
      playBg("/sounds/bg.mp3", 0.2);
    }
    setIsPlaying((prev) => !prev);
  };

  return {
    playAudio,
    stopAudio,
    stopBg,
    isPlaying,
    toggleBackgroundMusic,
  };
}
