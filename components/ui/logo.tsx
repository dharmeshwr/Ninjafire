"use client";

import Image from "next/image";

import { useAudioManager } from "@/lib/audio";

export default function Logo() {
  const { playAudio } = useAudioManager();

  return (
    <>
      <Image
        src="/logo.svg"
        alt="Logo"
        width={150}
        height={100}
        onClick={() => playAudio("/sounds/trumpet.wav")}
        className="scale-110 max-[700px]:absolute max-[700px]:top-10 max-[700px]:scale-150 max-[700px]:opacity-40"
      />
    </>
  );
}
