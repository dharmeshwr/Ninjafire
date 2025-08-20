"use client";

import { useEffect, useRef, useState } from "react";

import { ControlPanel, RangeSlider } from "@/components/shared/control-panel";

export default function Page() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef<{ x: number | null; y: number | null }>({
    x: null,
    y: null,
  });
  const colors = [
    "#fbf8cc",
    "#fde4cf",
    "#ffcfd2",
    "#f1c0e8",
    "#cfbaf0",
    "#a3c4f3",
    "#90dbf4",
    "#8eecf5",
    "#98f5e1",
    "#b9fbc0",
  ];

  const [config, setConfig] = useState({
    circleCount: 400,
    speedFactor: 1,
    maxRadius: 40,
  });

  const configRef = useRef(config);

  useEffect(() => {
    configRef.current = config;
  }, [config]);

  class Circle {
    x: number;
    y: number;
    radius: number;
    baseDx: number;
    baseDy: number;
    ctx: CanvasRenderingContext2D;
    minRadius: number;
    color: string;

    constructor(
      x: number,
      y: number,
      radius: number,
      context: CanvasRenderingContext2D,
    ) {
      this.x = x;
      this.y = y;
      this.radius = radius;
      this.baseDx = (Math.random() - 0.5) * 2;
      this.baseDy = (Math.random() - 0.5) * 2;
      this.ctx = context;
      this.minRadius = radius;
      this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    draw() {
      this.ctx.fillStyle = this.color;
      this.ctx.beginPath();
      this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      this.ctx.fill();
    }

    update() {
      const { speedFactor, maxRadius } = configRef.current;
      const dx = this.baseDx * speedFactor;
      const dy = this.baseDy * speedFactor;

      this.x += dx;
      this.y += dy;

      if (this.x + this.radius > innerWidth || this.x - this.radius < 0) {
        this.baseDx = -this.baseDx;
      }

      if (this.y + this.radius > innerHeight || this.y - this.radius < 0) {
        this.baseDy = -this.baseDy;
      }

      if (
        mouseRef.current.x &&
        mouseRef.current.y &&
        Math.abs(mouseRef.current.x - this.x) < 100 &&
        Math.abs(mouseRef.current.y - this.y) < 100
      ) {
        if (this.radius < maxRadius) {
          this.radius += 1;
        }
      } else if (this.radius > this.minRadius) {
        this.radius -= 1;
      }

      this.draw();
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let circles: Circle[] = [];
    let animationFrameId: number;
    let lastCircleCount = configRef.current.circleCount;
    let lastTime = performance.now();
    let frameCount = 0;
    let fps = 0;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const init = () => {
      circles = [];
      const { circleCount } = configRef.current;
      for (let i = 0; i < circleCount; i++) {
        const radius = Math.random() + 1;
        const x = Math.random() * (window.innerWidth - radius * 2) + radius;
        const y = Math.random() * (window.innerHeight - radius * 2) + radius;
        circles.push(new Circle(x, y, radius, ctx));
      }
    };

    const animate = () => {
      const currentTime = performance.now();
      frameCount++;
      const deltaTime = currentTime - lastTime;
      if (deltaTime >= 1000) {
        fps = frameCount;
        frameCount = 0;
        lastTime = currentTime;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      circles.forEach((circle) => circle.update());

      ctx.font = "16px Monospace";
      ctx.fillStyle = "white";
      ctx.textAlign = "right";
      ctx.textBaseline = "bottom";
      ctx.fillText(`FPS: ${fps}`, canvas.width - 10, canvas.height - 10);

      if (lastCircleCount !== configRef.current.circleCount) {
        init();
        lastCircleCount = configRef.current.circleCount;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    resizeCanvas();
    init();
    animate();

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    const onResize = () => {
      resizeCanvas();
      init();
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      <canvas
        className="fixed inset-0 z-[100] bg-background"
        ref={canvasRef}
      ></canvas>
      <ControlPanel>
        <RangeSlider
          label="Circle Count"
          value={config.circleCount}
          onChange={(v) => setConfig((prev) => ({ ...prev, circleCount: v }))}
          min={10}
          max={2000}
          step={10}
        />
        <RangeSlider
          label="Speed"
          value={config.speedFactor}
          onChange={(v) => setConfig((prev) => ({ ...prev, speedFactor: v }))}
          min={0.1}
          max={10}
          step={0.1}
        />
        <RangeSlider
          label="Max Radius"
          value={config.maxRadius}
          onChange={(v) => setConfig((prev) => ({ ...prev, maxRadius: v }))}
          min={5}
          max={100}
          step={1}
        />
      </ControlPanel>
    </>
  );
}
