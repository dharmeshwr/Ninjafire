import { useCallback, useEffect, useState } from "react";

const P_MIN = -15;
const P_MAX = 15;
const STEP = 2.5;
const SIZE = 594;

function quantizeToGrid(val: number): number {
  const raw = P_MIN + ((val + 1) * (P_MAX - P_MIN)) / 2;
  const snapped = Math.round(raw / STEP) * STEP;
  return Math.max(P_MIN, Math.min(P_MAX, snapped));
}

function gridToFilename(px: number, py: number): string {
  const sanitize = (val: number): string => {
    const fixed = Math.abs(val) < 1e-9 ? "0.0" : val.toFixed(1);
    return fixed.replace("-", "m").replace(".", "p");
  };
  return `gaze_px${sanitize(px)}_py${sanitize(py)}_${SIZE}.webp`;
}

export function useGazeTracking(basePath: string = "/faces/") {
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [isLoading] = useState(false);
  const [error] = useState<string | null>(null);

  const updateGaze = useCallback(
    (clientX: number, clientY: number) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;

      const nx = (clientX - centerX) / (window.innerWidth / 2);
      const ny = (centerY - clientY) / (window.innerHeight / 2);

      const clampedX = Math.max(-1, Math.min(1, nx));
      const clampedY = Math.max(-1, Math.min(1, ny));

      let px = quantizeToGrid(clampedX);
      let py = quantizeToGrid(clampedY);

      if (px > 0 && px <= 15) px = 7.5;
      else if (px < 0 && px >= -15) px = -7.5;
      else if (px === 0) px = 0;

      if (py > 0 && py <= 15) py = 7.5;
      else if (py < 0 && py >= -15) py = -7.5;
      else if (py === 0) py = 0;

      const filename = gridToFilename(px, py);
      const imagePath = `${basePath}${filename}`;

      setCurrentImage(imagePath);
    },
    [basePath],
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      updateGaze(e.clientX, e.clientY);
    },
    [updateGaze],
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        updateGaze(touch.clientX, touch.clientY);
      }
    },
    [updateGaze],
  );

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    updateGaze(centerX, centerY);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [handleMouseMove, handleTouchMove, updateGaze]);

  return { currentImage, isLoading, error };
}

export default useGazeTracking;
