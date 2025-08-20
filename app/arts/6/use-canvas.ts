import { useCallback, useRef } from "react";

import { PerlinNoise } from "@/lib/perlin";

import { ARROW_COLOR } from "./constants";
import { CanvasDrawingContext, FlowFieldConfig } from "./types";

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

export const drawFlowField = (
  drawingContext: CanvasDrawingContext,
  config: FlowFieldConfig,
  noise: PerlinNoise,
): number[][] => {
  const { ctx, width, height } = drawingContext;
  const { scale } = config;
  const cellSize = 4; // Fixed value
  const cols = Math.ceil(width / cellSize);
  const rows = Math.ceil(height / cellSize);
  const flowField: number[][] = [];
  ctx.strokeStyle = ARROW_COLOR;

  for (let y = 0; y < rows; y++) {
    flowField[y] = [];
    for (let x = 0; x < cols; x++) {
      const worldX = x * cellSize;
      const worldY = y * cellSize;
      const noiseValue = noise.perlin2(worldX * scale, worldY * scale);
      const angle = ((noiseValue + 1) / 2) * Math.PI * 2;
      flowField[y][x] = angle;
    }
  }

  return flowField;
};
