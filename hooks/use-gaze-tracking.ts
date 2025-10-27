import { RefObject, useCallback, useEffect, useState } from "react";

const P_MIN = -15;
const P_MAX = 15;
const STEP = 2.5;
const SIZE = 594;

function quantizeToGrid(val: number): number {
  const raw = P_MIN + ((val + 1) * (P_MAX - P_MIN)) / 2; // [-1,1] -> [-15,15]
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

export function useGazeTracking(
  containerRef: RefObject<HTMLElement | null>,
  basePath: string = "/faces/",
) {
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [isLoading] = useState(false);
  const [error] = useState<string | null>(null);

  const updateGaze = useCallback(
    (clientX: number, clientY: number) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // X: same as before (left -> negative, right -> positive)
      const nx = (clientX - centerX) / (rect.width / 2);

      // Y: invert so "up" becomes positive
      const ny = (centerY - clientY) / (rect.height / 2);

      const clampedX = Math.max(-1, Math.min(1, nx));
      const clampedY = Math.max(-1, Math.min(1, ny));

      const px = quantizeToGrid(clampedX);
      const py = quantizeToGrid(clampedY);

      const filename = gridToFilename(px, py);
      const imagePath = `${basePath}${filename}`;

      setCurrentImage(imagePath);
    },
    [basePath, containerRef],
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
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("touchmove", handleTouchMove, { passive: true });

    // Initial center gaze
    const rect = container.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    updateGaze(centerX, centerY);

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("touchmove", handleTouchMove);
    };
  }, [handleMouseMove, handleTouchMove, updateGaze, containerRef]);

  return { currentImage, isLoading, error };
}

export default useGazeTracking;
