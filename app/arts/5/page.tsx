"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { PerlinNoise } from "@/lib/perlin";
import ControlPanel, {
  RangeSlider,
  Select,
  Toggle,
} from "@/components/shared/control-panel";

import { ANIMATION_OPTIONS, DEFAULT_CONFIG } from "./constants";
import { createParticles, Particle } from "./particle";
import { AnimationType, FlowFieldConfig } from "./types";
import { drawFlowField, useCanvas } from "./use-canvas";

export default function Page() {
  const { canvasRef, getDrawingContext, updateCanvasSize } = useCanvas();
  const [config, setConfig] = useState<FlowFieldConfig>(DEFAULT_CONFIG);
  const configRef = useRef<FlowFieldConfig>(config);
  const noiseRef = useRef(new PerlinNoise(Math.random()));
  const animationFrameRef = useRef<number | null>(null);
  const timeRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const flowFieldRef = useRef<number[][]>([]);

  const lastFrameTimeRef = useRef<number>(performance.now());
  const frameCountRef = useRef<number>(0);
  const fpsRef = useRef<number>(0);

  const updateConfig = useCallback((updates: Partial<FlowFieldConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  }, []);

  const cancelAnimation = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  };

  // Draw function with FPS calculation and rendering
  const draw = useCallback(() => {
    const drawingContext = getDrawingContext();
    if (!drawingContext) return;

    const { ctx } = drawingContext;

    const currentTime = performance.now();
    timeRef.current = currentTime;

    // Calculate FPS
    frameCountRef.current += 1;
    const elapsed = currentTime - lastFrameTimeRef.current;
    if (elapsed >= 1000) {
      fpsRef.current = Math.round((frameCountRef.current * 1000) / elapsed);
      frameCountRef.current = 0;
      lastFrameTimeRef.current = currentTime;
    }

    flowFieldRef.current = drawFlowField(
      drawingContext,
      configRef.current,
      noiseRef.current,
      timeRef.current,
    );

    ctx.save();
    ctx.font = "16px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "right";
    ctx.textBaseline = "bottom";
    const canvas = drawingContext.canvas;
    ctx.fillText(
      `FPS: ${fpsRef.current}`,
      canvas.width - 20,
      canvas.height - 10,
    );
    ctx.restore();
  }, [getDrawingContext]);

  const animate = useCallback(() => {
    draw();

    // Update and draw particles if enabled
    if (configRef.current.showParticles && particlesRef.current.length > 0) {
      const drawingContext = getDrawingContext();
      if (drawingContext) {
        particlesRef.current.forEach((particle) => {
          particle.update(flowFieldRef.current, configRef.current);
          particle.draw();
        });
      }
    }

    // Continue animation if needed
    if (
      configRef.current.animated !== "off" ||
      configRef.current.showParticles
    ) {
      animationFrameRef.current = requestAnimationFrame(animate);
    }
  }, [draw, getDrawingContext]);

  // Update config and handle animation
  useEffect(() => {
    configRef.current = config;
    cancelAnimation();
    if (config.animated !== "off" || config.showParticles) {
      animate();
    } else {
      draw();
    }
    return cancelAnimation;
  }, [config, draw, animate]);

  // Handle particle creation/destruction
  useEffect(() => {
    if (config.showParticles) {
      const drawingContext = getDrawingContext();
      if (drawingContext) {
        if (
          !particlesRef.current.length ||
          particlesRef.current.length !== config.particleCount
        ) {
          particlesRef.current = createParticles(
            drawingContext,
            config.particleCount,
            config.radius,
          );
        }
        particlesRef.current.forEach((particle) => {
          particle.radius = config.radius;
        });
      }
    } else {
      particlesRef.current = [];
    }
  }, [
    config.showParticles,
    config.particleCount,
    config.radius,
    getDrawingContext,
  ]);

  // Resize listener
  useEffect(() => {
    const handleResize = () => {
      updateCanvasSize();
      // Recreate particles with new canvas size
      if (configRef.current.showParticles) {
        const drawingContext = getDrawingContext();
        if (drawingContext) {
          particlesRef.current = createParticles(
            drawingContext,
            configRef.current.particleCount,
            configRef.current.radius,
          );
        }
      }
      // Redraw immediately for static fields
      if (
        configRef.current.animated === "off" &&
        !configRef.current.showParticles
      ) {
        draw();
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [updateCanvasSize, getDrawingContext, draw]);

  return (
    <>
      <canvas className="fixed inset-0 z-[500] bg-[#4169e1]" ref={canvasRef} />
      <ControlPanel collapsed={0}>
        <Toggle
          label="Show grid"
          checked={config.showGrid}
          onChange={(v) => updateConfig({ showGrid: v })}
        />
        <Toggle
          label="Show particles"
          checked={config.showParticles}
          onChange={(v) => updateConfig({ showParticles: v })}
        />
        <Select
          label="Animate Field"
          value={config.animated}
          onChange={(v) => updateConfig({ animated: v as AnimationType })}
          options={ANIMATION_OPTIONS}
        />
        <RangeSlider
          label="Scale"
          value={config.scale}
          onChange={(v: number) => updateConfig({ scale: v })}
          min={0.001}
          max={0.01}
          step={0.0001}
        />
        <RangeSlider
          label="Cell Size"
          value={config.cellSize}
          onChange={(v: number) => updateConfig({ cellSize: v })}
          min={4}
          max={100}
          step={1}
        />
        {config.animated !== "off" && (
          <RangeSlider
            label="Field Speed"
            value={config.fieldSpeed}
            onChange={(v: number) => updateConfig({ fieldSpeed: v })}
            min={0.0001}
            max={0.01}
            step={0.001}
          />
        )}
        {config.showParticles && (
          <>
            <RangeSlider
              label="Particles"
              value={config.particleCount}
              onChange={(v: number) => updateConfig({ particleCount: v })}
              min={5}
              step={10}
              max={2000}
            />
            <RangeSlider
              label="Particles Speed"
              value={config.particleSpeed}
              onChange={(v: number) => updateConfig({ particleSpeed: v })}
              min={5}
              step={5}
              max={50}
            />
            <RangeSlider
              label="Radius"
              value={config.radius}
              onChange={(v: number) => updateConfig({ radius: v })}
              min={1}
              max={40}
              step={1}
            />
          </>
        )}
      </ControlPanel>
    </>
  );
}
