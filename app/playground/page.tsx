"use client";

import { useRef } from "react";

import { useParticleText } from "@/hooks/use-particle-text";

export default function Page() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useParticleText(canvasRef, "Hello Everynyyan!!! fine, thank you");

  return (
    <canvas className="fixed inset-0 z-10 bg-black" ref={canvasRef}></canvas>
  );
}
