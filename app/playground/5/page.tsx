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
  cell_size: number;
  show_grid: boolean;
  animated: AnimationType;
  speed: number;
}

export default function Page() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [config, setConfig] = useState<Config>({
    scale: 0.001, // Controls noise frequency
    cell_size: 40,
    show_grid: false,
    animated: animationOptions[0].value,
    speed: 0.001,
  });
  const configRef = useRef<Config>(config);
  const noiseRef = useRef(new PerlinNoise(Math.random()));
  const arrowImage = new Image();
  arrowImage.src = "/arrow.png";
  const animationFrameRef = useRef<number | null>(null);
  const timeRef = useRef<number>(0);

  function drawArrow(
    c: CanvasRenderingContext2D,
    x: number,
    y: number,
    angle: number,
    length: number,
  ) {
    c.save();
    c.translate(x, y);
    c.rotate(angle);
    c.beginPath();
    c.moveTo(0, 0);
    c.lineTo(length, 0);
    c.lineTo(length - 5, -3);
    c.moveTo(length, 0);
    c.lineTo(length - 5, 3);
    c.stroke();
    c.restore();
  }

  function draw(time: number = 0) {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const c = canvas.getContext("2d");
    if (!c || !configRef.current) return;

    const { scale, cell_size, show_grid, animated, speed } = configRef.current;

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
          noise = noiseRef.current.perlin2(x * scale, y * scale);
        } else if (animated === "xaxis") {
          noise = noiseRef.current.perlin2(x * scale + time * speed, y * scale);
        } else if (animated === "yaxis") {
          noise = noiseRef.current.perlin2(x * scale, y * scale + time * speed);
        } else if (animated === "diagonal") {
          noise = noiseRef.current.perlin2(
            x * scale + time * speed,
            y * scale + time * speed,
          );
        } else {
          noise = noiseRef.current.perlin3(x * scale, y * scale, time * speed);
        }
        const angle = noise * Math.PI * 2; // map to [0, 2π]
        const center_x = x + cell_size / 2;
        const center_y = y + cell_size / 2;
        drawArrow(c, center_x, center_y, angle, cell_size * 0.4);
        c.rect(x, y, cell_size, cell_size);
      }
    }
  }

  function animate(currentTime: number) {
    timeRef.current = currentTime;
    draw(currentTime);
    animationFrameRef.current = requestAnimationFrame(animate);
  }

  useEffect(() => {
    configRef.current = config;

    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    if (config.animated !== "off") {
      timeRef.current = performance.now();
      animationFrameRef.current = requestAnimationFrame(animate);
    } else {
      draw();
    }

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [config]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      if (config.animated === "off") draw();
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
        <Toggle
          label="Show grid"
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
          min={0.001}
          max={0.13}
          step={0.009}
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
        {config.animated !== "off" && (
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
