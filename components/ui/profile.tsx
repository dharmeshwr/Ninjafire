"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import useGazeTracking from "@/hooks/use-gaze-tracking";

export const Profile = () => {
  const [displayedSrc, setDisplayedSrc] = useState("/profile/index.png");

  const { currentImage } = useGazeTracking("/profile/faces/");

  useEffect(() => {
    if (currentImage) {
      setDisplayedSrc(currentImage);
    }
  }, [currentImage]);

  const handleImageError = () => {
    setDisplayedSrc("/profile/index.png");
  };

  return (
    <div className="flex h-fit justify-center">
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
