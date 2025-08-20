import { ANIMATION_OPTIONS } from "./constants";

export type AnimationType = (typeof ANIMATION_OPTIONS)[number]["value"];

export interface FlowFieldConfig {
  scale: number;
  cellSize: number;
  showGrid: boolean;
  radius: number;
  animated: AnimationType;
  fieldSpeed: number;
  particleSpeed: number;
  showParticles: boolean;
  particleCount: number;
}

export interface CanvasDrawingContext {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
}
