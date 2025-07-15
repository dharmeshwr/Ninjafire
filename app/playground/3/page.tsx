"use client";

import { useEffect, useRef } from "react";

import { PerlinNoise } from "./perlin";

export default function Page() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const c = canvas.getContext("2d");
    if (!c) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const noise = new PerlinNoise(Math.random());
    console.log(noise);
  }, []);

  return (
    <canvas
      className="fixed inset-0 z-[500] bg-background"
      ref={canvasRef}
    ></canvas>
  );
}
