import { useCallback, useRef } from "react";

import { PerlinNoise } from "@/lib/perlin";

import { ARROW_COLOR, GRID_COLOR } from "./constants";
import { AnimationType, CanvasDrawingContext, FlowFieldConfig } from "./types";

export const useCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const getDrawingContext = useCallback((): CanvasDrawingContext | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    return {
      canvas,
      ctx,
      width: canvas.width,
      height: canvas.height,
    };
  }, []);

  const updateCanvasSize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }, []);

  return { canvasRef, getDrawingContext, updateCanvasSize };
};

export const drawArrow = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  angle: number,
  length: number,
): void => {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(length, 0);
  ctx.lineTo(length - 5, -3);
  ctx.moveTo(length, 0);
  ctx.lineTo(length - 5, 3);
  ctx.stroke();
  ctx.restore();
};

export const drawGrid = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  cellSize: number,
): void => {
  ctx.beginPath();
  ctx.strokeStyle = GRID_COLOR;

  for (let x = cellSize; x <= width; x += cellSize) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
  }

  for (let y = cellSize; y <= height; y += cellSize) {
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
  }

  ctx.stroke();
};

export const drawFlowField = (
  drawingContext: CanvasDrawingContext,
  config: FlowFieldConfig,
  noise: PerlinNoise,
  time: number,
): number[][] => {
  const { ctx, width, height } = drawingContext;
  const { scale, cellSize, showGrid, fieldSpeed, animated } = config;

  const cols = Math.ceil(width / cellSize);
  const rows = Math.ceil(height / cellSize);

  const flowField: number[][] = [];

  ctx.clearRect(0, 0, width, height);

  if (showGrid) {
    drawGrid(ctx, width, height, cellSize);
  }

  ctx.strokeStyle = ARROW_COLOR;

  for (let y = 0; y < rows; y++) {
    flowField[y] = [];
    for (let x = 0; x < cols; x++) {
      const worldX = x * cellSize;
      const worldY = y * cellSize;

      const noiseValue = calculateNoise(
        noise,
        worldX,
        worldY,
        scale,
        time,
        fieldSpeed,
        animated,
      );
      const angle = ((noiseValue + 1) / 2) * Math.PI * 2;

      const centerX = worldX + cellSize / 2;
      const centerY = worldY + cellSize / 2;

      if (showGrid) drawArrow(ctx, centerX, centerY, angle, cellSize * 0.4);

      flowField[y][x] = angle;
    }
  }

  return flowField;
};

const calculateNoise = (
  noise: PerlinNoise,
  x: number,
  y: number,
  scale: number,
  time: number,
  speed: number,
  animationType: AnimationType,
): number => {
  const scaledX = x * scale;
  const scaledY = y * scale;
  const timeOffset = time * speed;

  switch (animationType) {
    case "off":
      return noise.perlin2(scaledX, scaledY);
    case "xaxis":
      return noise.perlin2(scaledX + timeOffset, scaledY);
    case "yaxis":
      return noise.perlin2(scaledX, scaledY + timeOffset);
    case "diagonal":
      return noise.perlin2(scaledX + timeOffset, scaledY + timeOffset);
    case "3d":
      return noise.perlin3(scaledX, scaledY, timeOffset);
    default:
      return noise.perlin2(scaledX, scaledY);
  }
};
