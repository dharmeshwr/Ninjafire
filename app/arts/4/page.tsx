"use client";

import { useEffect, useRef, useState } from "react";

import { PerlinNoise } from "@/lib/perlin";
import ControlPanel, {
  RangeSlider,
  Select,
  Toggle,
} from "@/components/shared/control-panel";

const animationOptions = [
  { label: "Off", value: "off" },
  { label: "X-axis", value: "xaxis" },
  { label: "Y-axis", value: "yaxis" },
  { label: "Diagonal", value: "diagonal" },
  { label: "3D", value: "3d" },
] as const;

type AnimationType = (typeof animationOptions)[number]["value"];

interface Config {
  scale: number;
  amplitude: number;
  speed: number;
  cell_size: number;
  show_grid: boolean;
  animated: AnimationType;
}

export default function Page() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const noiseRef = useRef(new PerlinNoise(Math.random()));
  const fpsRef = useRef({
    value: 0,
    framesCount: 0,
  });
  const animationFrameIdRef = useRef<number | null>(null);
  const [config, setConfig] = useState<Config>({
    scale: 0.01, // Controls noise frequency
    amplitude: 1, // Controls noise height
    speed: 0.001,
    cell_size: 11,
    show_grid: false,
    animated: animationOptions[0].value,
  });
  const configRef = useRef<Config>(config);

  function draw(time: number = 0) {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const c = canvas.getContext("2d");
    if (!c || !configRef.current) return;

    const { scale, amplitude, cell_size, show_grid, speed, animated } =
      configRef.current;

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
        let noise: number;
        if (animated === "off") {
          noise = noiseRef.current.perlin2(x * scale, y * scale) * amplitude;
        } else if (animated === "xaxis") {
          noise =
            noiseRef.current.perlin2(x * scale + time * speed, y * scale) *
            amplitude;
        } else if (animated === "yaxis") {
          noise =
            noiseRef.current.perlin2(x * scale, y * scale + time * speed) *
            amplitude;
        } else if (animated === "diagonal") {
          noise =
            noiseRef.current.perlin2(
              x * scale + time * speed,
              y * scale + time * speed,
            ) * amplitude;
        } else {
          noise =
            noiseRef.current.perlin3(x * scale, y * scale, time * speed) *
            amplitude;
        }

        const opacity = (noise + 1) / 2; // Maps [-1, 1] to [0, 1]
        c.fillStyle = `rgba(0,0,0, ${opacity})`;
        c.rect(x, y, cell_size, cell_size);
        c.fill();
      }
    }

    c.font = "16px Monospace";
    c.fillStyle = "white";
    c.textAlign = "right";
    c.textBaseline = "bottom";
    c.fillText(
      `FPS: ${fpsRef.current.value}`,
      canvas.width - 10,
      canvas.height - 10,
    );
  }

  function animate(currentTime: number) {
    const deltaTime = currentTime - lastTimeRef.current;
    fpsRef.current.framesCount++;

    if (deltaTime >= 1000) {
      fpsRef.current.value = fpsRef.current.framesCount;
      fpsRef.current.framesCount = 0;
      lastTimeRef.current = currentTime;
    }

    draw(currentTime);

    animationFrameIdRef.current = requestAnimationFrame(animate);
  }

  const lastTimeRef = useRef(performance.now());

  useEffect(() => {
    configRef.current = config;
    if (animationFrameIdRef.current !== null) {
      cancelAnimationFrame(animationFrameIdRef.current);
      animationFrameIdRef.current = null;
    }

    if (config.animated) {
      lastTimeRef.current = performance.now();
      animationFrameIdRef.current = requestAnimationFrame(animate);
    } else {
      fpsRef.current = { value: 0, framesCount: 0 };
      draw();
    }

    return () => {
      if (animationFrameIdRef.current !== null) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [config]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      if (!config.animated) draw();
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
      <ControlPanel collapsed={0} name="2D Perlin Noise">
        <Toggle
          label="Grid"
          checked={config.show_grid}
          onChange={(v) => setConfig((prev) => ({ ...prev, show_grid: v }))}
        />
        <Select
          label="Animate"
          value={config.animated}
          onChange={(v) =>
            setConfig((prev) => ({ ...prev, animated: v as AnimationType }))
          }
          options={animationOptions}
        />
        <RangeSlider
          label="Scale"
          value={config.scale}
          onChange={(v: number) => setConfig((prev) => ({ ...prev, scale: v }))}
          min={0.005}
          max={0.06}
          step={0.001}
        />
        <RangeSlider
          label="Amplitude"
          value={config.amplitude}
          onChange={(v: number) =>
            setConfig((prev) => ({ ...prev, amplitude: v }))
          }
          min={0}
          max={4}
          step={0.05}
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
        {config.animated && (
          <RangeSlider
            label="Speed"
            value={config.speed}
            onChange={(v: number) =>
              setConfig((prev) => ({ ...prev, speed: v }))
            }
            min={0.001}
            max={0.01}
            step={0.001}
          />
        )}
      </ControlPanel>
    </>
  );
}
