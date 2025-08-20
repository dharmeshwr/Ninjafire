"use client";

import { useEffect, useRef, useState } from "react";

import { PerlinNoise } from "@/lib/perlin";
import ControlPanel, { RangeSlider } from "@/components/shared/control-panel";

interface Config {
  scale: number;
  amplitude: number;
}

export default function Page() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [config, setConfig] = useState<Config>({
    scale: 0.01, // Controls noise frequency
    amplitude: 100, // Controls noise height
  });
  const configRef = useRef<Config>(config);
  const noiseRef = useRef(new PerlinNoise(Math.random()));

  function draw() {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const c = canvas.getContext("2d");
    if (!c || !configRef.current) return;

    c.clearRect(0, 0, canvas.width, canvas.height);

    c.beginPath();
    c.strokeStyle = "#ebddb2";
    c.moveTo(0, canvas.height / 2);

    for (let x = 1; x < canvas.width; x++) {
      const val =
        noiseRef.current.perlin1(x * configRef.current.scale) *
        configRef.current.amplitude;
      c.lineTo(x, val + canvas.height / 2);
    }
    c.stroke();
  }

  useEffect(() => {
    configRef.current = config;
    draw();
  }, [config]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      draw();
    };

    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);

    return () => window.removeEventListener("resize", updateCanvasSize);
  }, []);

  return (
    <>
      <canvas
        className="fixed inset-0 z-[500] bg-background"
        ref={canvasRef}
      ></canvas>
      <ControlPanel>
        <RangeSlider
          label="Scale"
          value={config.scale}
          onChange={(v: number) => setConfig((prev) => ({ ...prev, scale: v }))}
          min={0.001}
          max={1}
          step={0.009}
        />
        <RangeSlider
          label="Amplitude"
          value={config.amplitude}
          onChange={(v: number) =>
            setConfig((prev) => ({ ...prev, amplitude: v }))
          }
          min={10}
          max={900}
          step={5}
        />
      </ControlPanel>
    </>
  );
}
