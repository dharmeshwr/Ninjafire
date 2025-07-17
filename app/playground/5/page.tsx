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
  cell_size: number;
  show_grid: boolean;
}

export default function Page() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [config, setConfig] = useState<Config>({
    scale: 0.01, // Controls noise frequency
    amplitude: 1, // Controls noise height
    cell_size: 40,
    show_grid: false,
  });
  const configRef = useRef<Config>(config);
  const noiseRef = useRef(new PerlinNoise(Math.random()));

  function draw() {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const c = canvas.getContext("2d");
    if (!c || !configRef.current) return;

    const { scale, amplitude, cell_size, show_grid } = configRef.current;

    c.clearRect(0, 0, canvas.width, canvas.height);

    c.beginPath();
    c.strokeStyle = "black";

    if (show_grid) {
      for (let x = cell_size; x <= canvas.width; x += cell_size) {
        c.moveTo(x, 0);
        c.lineTo(x, canvas.height);
      }

      for (let y = cell_size; y <= canvas.height; y += cell_size) {
        c.moveTo(0, y);
        c.lineTo(canvas.width, y);
      }
    }

    c.stroke();
    for (let x = 0; x < canvas.width; x += cell_size) {
      for (let y = 0; y < canvas.height; y += cell_size) {
        c.beginPath();
        const noise =
          noiseRef.current.perlin2(x * scale, y * scale) * amplitude;
        // const noise = Math.random()
        const opacity = (noise + 1) / 2; // Maps [-1, 1] to [0, 1]
        c.fillStyle = `rgba(0, 0, 0, ${opacity})`;
        c.rect(x, y, cell_size, cell_size);
        c.fill();
      }
    }
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
        className="fixed inset-0 z-[500] bg-white"
        ref={canvasRef}
      ></canvas>
      <ControlPanel collapsed={0}>
        <RangeSlider
          label="Scale"
          value={config.scale}
          onChange={(v: number) => setConfig((prev) => ({ ...prev, scale: v }))}
          min={0.001}
          max={0.13}
          step={0.009}
        />
        <RangeSlider
          label="Amplitude"
          value={config.amplitude}
          onChange={(v: number) =>
            setConfig((prev) => ({ ...prev, amplitude: v }))
          }
          min={0}
          max={10}
          step={1}
        />
        <RangeSlider
          label="Cell Size"
          value={config.cell_size}
          onChange={(v: number) =>
            setConfig((prev) => ({ ...prev, cell_size: v }))
          }
          min={4}
          max={100}
          step={1}
        />
        <Toggle
          label="Show grid"
          checked={config.show_grid}
          onChange={(v) => setConfig((prev) => ({ ...prev, show_grid: v }))}
        />
      </ControlPanel>
    </>
  );
}
