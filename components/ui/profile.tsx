"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

import useGazeTracking from "@/hooks/use-gaze-tracking";

// Generate all possible image paths
function generateAllImagePaths(basePath: string): string[] {
  const paths: string[] = [];
  const P_MIN = -15;
  const P_MAX = 15;
  const STEP = 2.5;
  const SIZE = 594;

  const sanitize = (val: number): string => {
    const fixed = Math.abs(val) < 1e-9 ? "0.0" : val.toFixed(1);
    return fixed.replace("-", "m").replace(".", "p");
  };

  for (let px = P_MIN; px <= P_MAX; px += STEP) {
    for (let py = P_MIN; py <= P_MAX; py += STEP) {
      const filename = `gaze_px${sanitize(px)}_py${sanitize(py)}_${SIZE}.webp`;
      paths.push(`${basePath}${filename}`);
    }
  }
  return paths;
}

export const Profile = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [displayedSrc, setDisplayedSrc] = useState("/profile/index.png");
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const { currentImage } = useGazeTracking(containerRef, "/profile/faces/");

  // Preload all images
  useEffect(() => {
    const imagePaths = generateAllImagePaths("/profile/faces/");
    let loadedCount = 0;
    const totalImages = imagePaths.length;

    const preloadPromises = imagePaths.map((path) => {
      return new Promise<void>((resolve) => {
        const img = new window.Image();
        img.onload = () => {
          loadedCount++;
          resolve();
        };
        img.onerror = () => {
          loadedCount++;
          resolve(); // Resolve even on error to not block
        };
        img.src = path;
      });
    });

    Promise.all(preloadPromises).then(() => {
      setImagesLoaded(true);
      console.log(`Preloaded ${loadedCount}/${totalImages} images`);
    });
  }, []);

  useEffect(() => {
    if (currentImage && imagesLoaded) {
      setDisplayedSrc(currentImage);
    }
  }, [currentImage, imagesLoaded]);

  const handleImageError = () => {
    setDisplayedSrc("/profile/index.png");
  };

  return (
    <div className="flex h-fit justify-center" ref={containerRef}>
      <Image
        src={displayedSrc}
        alt="profile picture"
        width={600}
        height={600}
        className="mix-blend-multiply"
        onError={handleImageError}
        priority
      />
      {!imagesLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80">
          <div className="text-sm text-gray-600">
            Loading interactive face...
          </div>
        </div>
      )}
    </div>
  );
};
