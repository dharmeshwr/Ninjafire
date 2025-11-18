"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

import useGazeTracking from "@/hooks/use-gaze-tracking";

export const Profile = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [displayedSrc, setDisplayedSrc] = useState("/profile/index.png");

  const { currentImage } = useGazeTracking(containerRef, "/profile/faces/");

  useEffect(() => {
    if (currentImage) {
      setDisplayedSrc(currentImage);
    }
  }, [currentImage]);

  const handleImageError = () => {
    setDisplayedSrc("/profile/index.png");
  };

  return (
    <div className="flex h-fit justify-center" ref={containerRef}>
      <Image
        src={displayedSrc}
        alt="profile picture"
        width={500}
        height={500}
        className="mix-blend-multiply"
        onError={handleImageError}
      />
    </div>
  );
};
