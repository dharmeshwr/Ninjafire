"use client";

import { useRef } from "react";
import Image from "next/image";

import useGazeTracking from "@/hooks/use-gaze-tracking";

export const Profile = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const { currentImage } = useGazeTracking(containerRef, "/profile/faces/");

  return (
    <div className="flex h-fit justify-center" ref={containerRef}>
      <Image
        src={currentImage ? currentImage : "/profile/index.png"}
        alt="profile picture"
        width={600}
        height={600}
        className="mix-blend-multiply"
      />
    </div>
  );
};
