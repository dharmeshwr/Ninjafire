"use client";

import { useRef, useState } from "react";

export const Jet2Holiday = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [muted, setMuted] = useState(true);

  const handleMouseEnter = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !audioRef.current.muted;
      setMuted(audioRef.current.muted);
    }
  };

  return (
    <div
      className="relative border-2 border-black px-1"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span className="block pt-2 font-schwachsinn text-5xl italic mix-blend-multiply">
        Jet2Holidays
      </span>
      <div className="my-2 text-justify">
        Nothing beats a Jet2Holiday and right now you can save £50 per person,
        that&apos;s £200 off for a family of four. We’ve got millions of
        child-play holidays available, with 22 kg of baggage included. Buy now
        with Jet2Holidays - Package holidays you can trust.
        <br />
        <span className="text-sm">After natural protected</span>
      </div>

      <button
        className="absolute bottom-1 right-1 text-xs"
        onClick={toggleMute}
      >
        {muted ? "Muted" : "Mute"}
      </button>
      <audio ref={audioRef} src="/sounds/jet.mp3" muted preload="auto" />
    </div>
  );
};
