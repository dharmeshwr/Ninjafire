"use client";

import React, { useRef } from "react";

import useClickSpark from "@/hooks/use-click-spark";

export const ClickSpark = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const createSparks = useClickSpark(canvasRef, {
    sparkSize: 12,
    duration: 600,
  });

  return (
    <div
      className="absolute left-0 top-0 size-full"
      onClick={(e) => createSparks(e.clientX, e.clientY)}
    >
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0"
      />
    </div>
  );
};
