import { PARTICLE_COLOR } from "./constants";
import { CanvasDrawingContext, FlowFieldConfig } from "./types";

export class Particle {
  private opacity: number;
  private targetOpacity: number = 0.2; // Target opacity
  private opacityIncrement: number = 0.005; // Controls fade-in speed

  constructor(
    public x: number,
    public y: number,
    private ctx: CanvasRenderingContext2D,
  ) {
    this.opacity = 0; // Start at 0 opacity
  }

  draw(opacity: number = this.opacity): void {
    this.ctx.fillStyle = `rgba(${PARTICLE_COLOR},${opacity})`;
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, 1, 0, 2 * Math.PI); // Fixed radius
    this.ctx.fill();
  }

  update(flowField: number[][], config: FlowFieldConfig): void {
    const cellSize = 4; // Fixed value
    const col = Math.floor(this.x / cellSize);
    const row = Math.floor(this.y / cellSize);
    const rows = flowField.length;
    const cols = rows > 0 ? flowField[0].length : 0;

    if (
      row >= 0 &&
      row < rows &&
      col >= 0 &&
      col < cols &&
      flowField[row] &&
      flowField[row][col] !== undefined
    ) {
      const angle = flowField[row][col];
      const speed = config.particleSpeed;
      this.x += Math.cos(angle) * speed;
      this.y += Math.sin(angle) * speed;
    }

    // Gradually increase opacity until it reaches target
    if (this.opacity < this.targetOpacity) {
      this.opacity = Math.min(
        this.opacity + this.opacityIncrement,
        this.targetOpacity,
      );
    }

    this.draw();
    this.wrap();
  }

  private wrap(): void {
    const width = window.innerWidth;
    const height = window.innerHeight;
    if (this.x >= width) {
      this.x = 0;
      this.y = Math.random() * height;
      this.opacity = 0; // Reset to 0 opacity on wrap
    }
    if (this.y >= height) {
      this.y = 0;
      this.x = Math.random() * width;
      this.opacity = 0; // Reset to 0 opacity on wrap
    }
    if (this.x <= 0) {
      this.x = width;
      this.y = Math.random() * height;
      this.opacity = 0; // Reset to 0 opacity on wrap
    }
    if (this.y <= 0) {
      this.y = height;
      this.x = Math.random() * width;
      this.opacity = 0; // Reset to 0 opacity on wrap
    }
  }
}

export const createParticles = (
  drawingContext: CanvasDrawingContext,
  count: number,
): Particle[] => {
  const { width, height, ctx } = drawingContext;
  const particles: Particle[] = [];
  for (let i = 0; i < count; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    particles.push(new Particle(x, y, ctx));
  }
  return particles;
};
