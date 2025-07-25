import { PARTICLE_COLOR } from "./constants";
import { CanvasDrawingContext, FlowFieldConfig } from "./types";

export class Particle {
  private opacity: number;
  constructor(
    public x: number,
    public y: number,
    private ctx: CanvasRenderingContext2D,
    public radius: number = 10,
  ) {
    this.opacity = Math.random();
  }

  draw(): void {
    this.ctx.fillStyle = `rgba(${PARTICLE_COLOR},${this.opacity})`;
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    this.ctx.fill();
  }

  update(flowField: number[][], config: FlowFieldConfig): void {
    const { cellSize } = config;

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

    this.wrap();
  }

  private wrap(): void {
    const width = window.innerWidth;
    const height = window.innerHeight;

    if (this.x > width) {
      this.x = 0;
      this.y = Math.random() * height;
    }

    if (this.y > height) {
      this.y = 0;
      this.x = Math.random() * width;
    }

    if (this.x < 0) {
      this.x = width;
      this.y = Math.random() * height;
    }

    if (this.y < 0) {
      this.y = height;
      this.x = Math.random() * width;
    }
  }
}

export const createParticles = (
  drawingContext: CanvasDrawingContext,
  count: number,
  radius: number,
): Particle[] => {
  const { width, height, ctx } = drawingContext;
  const particles: Particle[] = [];

  for (let i = 0; i < count; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    particles.push(new Particle(x, y, ctx, radius));
  }

  return particles;
};
