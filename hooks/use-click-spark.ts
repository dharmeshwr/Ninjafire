import { useCallback, useEffect, useRef } from "react";

interface Spark {
  x: number;
  y: number;
  angle: number;
  startTime: number;
  color: string; // Add color to Spark interface
}

interface UseClickSparkProps {
  sparkSize?: number;
  sparkRadius?: number;
  sparkCount?: number;
  duration?: number;
}

const GRUVBOX_COLORS = [
  "#fb4934",
  "#b8bb26",
  "#fabd2f",
  "#83a598",
  "#d3869b",
  "#8ec07c",
  "#fe8019",
];

const useClickSpark = (
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  {
    sparkSize = 10,
    sparkRadius = 15,
    sparkCount = 8,
    duration = 400,
  }: UseClickSparkProps = {},
) => {
  const sparksRef = useRef<Spark[]>([]);
  const startTimeRef = useRef<number | null>(null);

  const easeOut = useCallback((t: number) => t * (2 - t), []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const { width, height } = parent.getBoundingClientRect();
      canvas.width = width;
      canvas.height = height;
    };

    resizeCanvas();
    const ro = new ResizeObserver(resizeCanvas);
    if (canvas.parentElement) ro.observe(canvas.parentElement);

    let animationId: number;
    const draw = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      sparksRef.current = sparksRef.current.filter((spark) => {
        const elapsed = timestamp - spark.startTime;
        if (elapsed >= duration) return false;

        const progress = elapsed / duration;
        const eased = easeOut(progress);
        const distance = eased * sparkRadius;
        const lineLength = sparkSize * (1 - eased);

        const x1 = spark.x + distance * Math.cos(spark.angle);
        const y1 = spark.y + distance * Math.sin(spark.angle);
        const x2 = spark.x + (distance + lineLength) * Math.cos(spark.angle);
        const y2 = spark.y + (distance + lineLength) * Math.sin(spark.angle);

        ctx.strokeStyle = spark.color; // Use spark-specific color
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        return true;
      });

      animationId = requestAnimationFrame(draw);
    };

    animationId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationId);
      ro.disconnect();
    };
  }, [sparkSize, sparkRadius, sparkCount, duration]);

  const createSparks = useCallback(
    (clientX: number, clientY: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      const randomColor =
        GRUVBOX_COLORS[Math.floor(Math.random() * GRUVBOX_COLORS.length)];

      const now = performance.now();
      const newSparks: Spark[] = Array.from({ length: sparkCount }, (_, i) => ({
        x,
        y,
        angle: (2 * Math.PI * i) / sparkCount,
        startTime: now,
        color: randomColor,
      }));

      sparksRef.current.push(...newSparks);
    },
    [sparkCount, canvasRef],
  );

  return createSparks;
};

export default useClickSpark;
