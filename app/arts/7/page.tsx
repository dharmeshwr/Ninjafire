"use client";

import { useEffect, useRef, useState } from "react";

import ControlPanel, { RangeSlider } from "@/components/shared/control-panel";

import { fragmentShaderSource, vertexShaderSource } from "./shaders";

export default function Page() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);

  const [config, setConfig] = useState({
    zr: 0,
    zi: 0,
    zoom: 1,
    panX: 0,
    panY: 0,
  });

  const isDraggingRef = useRef(false);
  const lastMousePosRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl");
    if (!gl) {
      const msg = "WebGL not supported";
      alert(msg);
      console.error(msg);
      return;
    }

    glRef.current = gl;

    canvas.width = canvas.clientWidth * 2;
    canvas.height = canvas.clientHeight * 2;
    gl.viewport(0, 0, canvas.width, canvas.height);

    const compileShader = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader compile error:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertexShader = compileShader(gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = compileShader(
      gl.FRAGMENT_SHADER,
      fragmentShaderSource,
    );
    const program = gl.createProgram();

    if (!vertexShader || !fragmentShader || !program) return;

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program link error:", gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);
    programRef.current = program;

    const positions = new Float32Array([-1.0, -1.0, 3.0, -1.0, -1.0, 3.0]);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    gl.uniform2f(resolutionLocation, canvas.width, canvas.height);

    return () => {
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      gl.deleteBuffer(buffer);
    };
  }, []);

  useEffect(() => {
    const gl = glRef.current;
    const program = programRef.current;
    if (!gl || !program) return;

    gl.useProgram(program);

    const zrOffsetLocation = gl.getUniformLocation(program, "u_zr");
    const ziOffsetLocation = gl.getUniformLocation(program, "u_zi");
    const panLocation = gl.getUniformLocation(program, "u_pan");
    const zoomLocation = gl.getUniformLocation(program, "u_zoom");

    gl.uniform1f(zrOffsetLocation, config.zr);
    gl.uniform1f(ziOffsetLocation, config.zi);
    gl.uniform2f(panLocation, config.panX, config.panY);
    gl.uniform1f(zoomLocation, config.zoom);

    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }, [config]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;

      setConfig((prev) => ({
        ...prev,
        zoom: prev.zoom * zoomFactor,
      }));
    };

    const handleMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      lastMousePosRef.current = { x: e.clientX, y: e.clientY };
      canvas.style.cursor = "grabbing";
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;

      const dx = e.clientX - lastMousePosRef.current.x;
      const dy = e.clientY - lastMousePosRef.current.y;

      const canvas = canvasRef.current;
      if (!canvas) return;

      const aspect = canvas.width / canvas.height;
      const moveScale = 3.5 / canvas.clientWidth;

      setConfig((prev) => ({
        ...prev,
        panX: prev.panX - (dx * moveScale) / prev.zoom,
        panY: prev.panY + (dy * moveScale * (2.0 / 3.5) * aspect) / prev.zoom,
      }));

      lastMousePosRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      canvas.style.cursor = "grab";
    };

    canvas.addEventListener("wheel", handleWheel, { passive: false });
    canvas.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    canvas.style.cursor = "grab";

    return () => {
      canvas.removeEventListener("wheel", handleWheel);
      canvas.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-neutral-900">
      <span className="absolute hidden text-white/60">
        If it is blurry it&apos;s on your graphic card not on my code.
      </span>
      <canvas
        ref={canvasRef}
        className="m-auto w-full min-w-[80rem] rounded"
        style={{ aspectRatio: "7/4" }}
      />

      <ControlPanel collapsed={2} name="Mandelbrot Set">
        <RangeSlider
          label="Z Real"
          value={config.zr}
          onChange={(v: number) => setConfig((prev) => ({ ...prev, zr: v }))}
          min={-3}
          max={3}
          step={0.1}
        />
        <RangeSlider
          label="Z Imaginary"
          value={config.zi}
          onChange={(v: number) => setConfig((prev) => ({ ...prev, zi: v }))}
          min={-3}
          max={3}
          step={0.1}
        />
      </ControlPanel>
    </div>
  );
}
