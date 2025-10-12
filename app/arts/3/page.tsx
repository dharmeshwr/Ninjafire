"use client";

import { useEffect, useRef, useState } from "react";

import { PerlinNoise } from "@/lib/perlin";
import ControlPanel, {
  RangeSlider,
  Toggle,
} from "@/components/shared/control-panel";

interface Config {
  scale: number;
  amplitude: number;
}

export default function Page() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [config, setConfig] = useState<Config>({
    scale: 0.01,
    amplitude: 100,
  });
  const [isAnimating, setIsAnimating] = useState(false);

  const configRef = useRef(config);
  const noiseRef = useRef(new PerlinNoise(Math.random()));
  const animationRef = useRef<number | null>(null);
  const timeRef = useRef(0);

  function draw(timeOffset = 0) {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const c = canvas.getContext("2d");
    if (!c) return;

    const { scale, amplitude } = configRef.current;
    c.clearRect(0, 0, canvas.width, canvas.height);

    c.beginPath();
    c.strokeStyle = "#ebddb2";
    c.moveTo(0, canvas.height / 2);

    for (let x = 1; x < canvas.width; x++) {
      const val = noiseRef.current.perlin2(x * scale, timeOffset) * amplitude;
      c.lineTo(x, val + canvas.height / 2);
    }

    c.stroke();
  }

  // Animate perlin noise over time
  useEffect(() => {
    if (isAnimating) {
      const animate = () => {
        timeRef.current += 0.01;
        draw(timeRef.current);
        animationRef.current = requestAnimationFrame(animate);
      };
      animationRef.current = requestAnimationFrame(animate);
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isAnimating]);

  // Redraw on config change
  useEffect(() => {
    configRef.current = config;
    if (!isAnimating) draw(timeRef.current);
  }, [config, isAnimating]);

  // Handle resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      draw(timeRef.current);
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

      <ControlPanel collapsed={0} name="1D Perlin Noise">
        <RangeSlider
          label="Scale"
          value={config.scale}
          onChange={(v) => setConfig((prev) => ({ ...prev, scale: v }))}
          min={0.001}
          max={1}
          step={0.009}
        />
        <RangeSlider
          label="Amplitude"
          value={config.amplitude}
          onChange={(v) => setConfig((prev) => ({ ...prev, amplitude: v }))}
          min={10}
          max={900}
          step={5}
        />
        <Toggle
          label="Animate"
          checked={isAnimating}
          onChange={setIsAnimating}
        />
      </ControlPanel>
    </>
  );
}
