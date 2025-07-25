export interface FlowFieldConfig {
  scale: number;
  particleSpeed: number;
  particleCount: number;
}

export interface CanvasDrawingContext {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
}
