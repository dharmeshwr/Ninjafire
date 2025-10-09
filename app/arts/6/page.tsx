"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { PerlinNoise } from "@/lib/perlin";
import ControlPanel, { RangeSlider } from "@/components/shared/control-panel";

import { DEFAULT_CONFIG } from "./constants";
import { createParticles, Particle } from "./particle";
import { FlowFieldConfig } from "./types";
import { drawFlowField, useCanvas } from "./use-canvas";

export default function Page() {
  const { canvasRef, getDrawingContext, updateCanvasSize } = useCanvas();
  const [config, setConfig] = useState<FlowFieldConfig>(DEFAULT_CONFIG);
  const configRef = useRef<FlowFieldConfig>(config);
  const noiseRef = useRef(new PerlinNoise(Math.random()));
  const animationFrameRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const flowFieldRef = useRef<number[][]>([]);

  const updateConfig = useCallback((updates: Partial<FlowFieldConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  }, []);

  const cancelAnimation = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  };

  const draw = useCallback(() => {
    const drawingContext = getDrawingContext();
    if (!drawingContext) return;

    flowFieldRef.current = drawFlowField(
      drawingContext,
      configRef.current,
      noiseRef.current,
    );
  }, [getDrawingContext]);

  const animate = useCallback(() => {
    draw();
    if (particlesRef.current.length > 0) {
      const drawingContext = getDrawingContext();
      if (drawingContext) {
        particlesRef.current.forEach((particle) => {
          particle.update(flowFieldRef.current, configRef.current);
        });
      }
    }
    animationFrameRef.current = requestAnimationFrame(animate);
  }, [draw, getDrawingContext]);

  useEffect(() => {
    configRef.current = config;
    cancelAnimation();
    const drawingContext = getDrawingContext();
    if (drawingContext) {
      const { ctx, width, height } = drawingContext;
      if (ctx) {
        ctx.clearRect(0, 0, width, height);
        particlesRef.current = createParticles(
          drawingContext,
          config.particleCount,
        );
      }
    }

    animate();
    return cancelAnimation;
  }, [config, getDrawingContext, animate]);

  useEffect(() => {
    const drawingContext = getDrawingContext();
    if (drawingContext) {
      if (particlesRef.current.length !== config.particleCount) {
        particlesRef.current = createParticles(
          drawingContext,
          config.particleCount,
        );
      }
    }
  }, [config.particleCount, getDrawingContext]);

  useEffect(() => {
    const handleResize = () => {
      updateCanvasSize();
      const drawingContext = getDrawingContext();
      if (drawingContext) {
        particlesRef.current = createParticles(
          drawingContext,
          configRef.current.particleCount,
        );
        draw();
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [updateCanvasSize, getDrawingContext, draw]);

  return (
    <>
      <canvas className="fixed inset-0 z-[500] bg-black" ref={canvasRef} />
      <ControlPanel collapsed={0} name="Flow Field II">
        <RangeSlider
          label="Scale"
          value={config.scale}
          onChange={(v: number) => updateConfig({ scale: v })}
          min={0.001}
          max={0.01}
          step={0.0001}
        />
        <RangeSlider
          label="Particles"
          value={config.particleCount}
          onChange={(v: number) => updateConfig({ particleCount: v })}
          min={5}
          step={10}
          max={2000}
        />
        <RangeSlider
          label="Particle Speed"
          value={config.particleSpeed}
          onChange={(v: number) => updateConfig({ particleSpeed: v })}
          min={0.5}
          step={0.5}
          max={10}
        />
      </ControlPanel>
    </>
  );
}
