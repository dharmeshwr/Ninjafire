"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

import { metaData } from "@/config/site";

export function Name() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  const text = metaData.name;

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", {
      willReadFrequently: true,
    });

    canvas.width = 300;
    canvas.height = 100;

    if (!ctx) return;

    class Particle {
      effect: Effect;
      x: number;
      y: number;
      color: string;
      originX: number;
      originY: number;
      size: number;
      dx: number;
      dy: number;
      vx: number;
      vy: number;
      force: number;
      angle: number;
      distance: number;
      friction: number;
      ease: number;

      constructor(effect: Effect, x: number, y: number, color: string) {
        this.effect = effect;
        this.x = Math.random() * this.effect.canvasWidth;
        this.y = y + Math.random();
        this.color = color;
        this.originX = x;
        this.originY = y;
        this.size = this.effect.step;
        this.dx = 0;
        this.dy = 0;
        this.vx = 0;
        this.vy = 0;
        this.force = 0;
        this.angle = 0;
        this.distance = 0;
        this.friction = Math.random() * 0.6 + 0.15;
        this.ease = Math.random() * 0.8 + 0.07;
      }

      draw() {
        this.effect.context.fillStyle = this.color;
        this.effect.context.fillRect(this.x, this.y, this.size, this.size);
      }

      update() {
        this.dx = this.effect.mouse.x - this.x;
        this.dy = this.effect.mouse.y - this.y;
        this.distance = this.dx * this.dx + this.dy * this.dy;
        this.force = -this.effect.mouse.radius / this.distance;

        if (this.distance < this.effect.mouse.radius) {
          this.angle = Math.atan2(this.dy, this.dx);
          this.vx += this.force * Math.cos(this.angle);
          this.vy += this.force * Math.sin(this.angle);
        }

        this.x +=
          (this.vx *= this.friction) + (this.originX - this.x) * this.ease;
        this.y +=
          (this.vy *= this.friction) + (this.originY - this.y) * this.ease;
      }
    }

    class Effect {
      context: CanvasRenderingContext2D;
      canvasWidth: number;
      canvasHeight: number;
      textX: number;
      textY: number;
      fontSize: number;
      maxTextWidth: number;
      lineHeight: number;
      particles: Particle[];
      step: number;
      mouse: Record<string, number>;

      constructor(
        context: CanvasRenderingContext2D,
        canvasWidth: number,
        canvasHeight: number,
        options: Record<string, boolean>,
      ) {
        this.context = context;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.textX = this.canvasWidth / 2;
        this.textY = this.canvasHeight / 2 + 10;
        this.fontSize = 30;
        this.maxTextWidth = canvas.width;
        this.lineHeight = this.fontSize * 0.8;
        this.particles = [];
        this.step = 1;
        this.mouse = {
          radius: 1000,
          x: -100,
          y: -100,
        };

        window.addEventListener("mousemove", (event: MouseEvent) => {
          const rect = canvas.getBoundingClientRect();
          this.mouse.x = event.clientX - rect.left;
          this.mouse.y = event.clientY - rect.top;

          if (
            this.mouse.x < 0 ||
            this.mouse.x > rect.width ||
            this.mouse.y < 0 ||
            this.mouse.y > rect.height
          ) {
            this.mouse.x = -100;
            this.mouse.y = -100;
          }
        });

        Object.entries(options).forEach(([key, value]) => {
          if (key == "axis" && value == true) {
            this.drawAxis();
          }
        });
      }

      drawAxis() {
        this.context.strokeStyle = "red";

        this.context.beginPath();
        this.context.moveTo(canvas.width / 2, 0);
        this.context.lineTo(canvas.width / 2, canvas.height);
        this.context.stroke();

        this.context.strokeStyle = "green";

        this.context.beginPath();
        this.context.moveTo(0, canvas.height / 2);
        this.context.lineTo(canvas.width, canvas.height / 2);
        this.context.stroke();
      }

      addText(text: string) {
        this.context.lineWidth = 3;
        this.context.fillStyle = theme == "light" ? "#1d2021" : "#f9f5d7";
        this.context.font = `${this.fontSize}px Helvetica`;
        this.context.textAlign = "center";
        this.context.textBaseline = "alphabetic";

        // Word Wrap
        const lines: string[] = [];
        let currentLine = "";
        const words = text.split(" ");

        words.forEach((word) => {
          const testLine = `${currentLine}${word} `;
          if (this.context.measureText(testLine).width > this.maxTextWidth) {
            lines.push(currentLine.trim());
            currentLine = `${word} `;
          } else {
            currentLine = testLine;
          }
        });

        if (currentLine) {
          lines.push(currentLine.trim());
        }

        lines.forEach((line, index) => {
          this.context.fillText(
            line,
            this.textX,
            this.textY + index * this.lineHeight,
          );
        });

        this.convertToParticle();
      }

      convertToParticle() {
        this.particles = [];
        const imageData = this.context.getImageData(
          0,
          0,
          this.canvasWidth,
          this.canvasHeight,
        );
        this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

        for (let col = 0; col < imageData.width; col += this.step) {
          for (let row = 0; row < imageData.height; row += this.step) {
            const index = (row * imageData.width + col) * 4;
            const alpha = imageData.data[index + 3];
            if (alpha > 0) {
              const red = imageData.data[index];
              const green = imageData.data[index + 1];
              const blue = imageData.data[index + 2];
              const color = `rgb(${red},${green},${blue})`;
              this.particles.push(new Particle(this, col, row, color));
            }
          }
        }
      }

      render() {
        this.particles.forEach((particle) => {
          particle.update();
          particle.draw();
        });
      }

      resize(width: number, height: number) {
        this.canvasWidth = width;
        this.canvasHeight = height;
        this.textX = this.canvasWidth / 2;
        this.textY = this.canvasHeight / 2;
        this.maxTextWidth = this.canvasWidth;
      }
    }

    const effect = new Effect(ctx, canvas.width, canvas.height, {
      axis: false,
    });
    effect.addText(text);
    effect.render();

    function animate() {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      effect.render();
      requestAnimationFrame(animate);
    }

    animate();
  }, [text, theme]);

  return (
    <div className="absolute -top-12 left-[-5.3rem] mb-6 md:mb-0">
      <canvas ref={canvasRef}></canvas>
    </div>
  );
}
