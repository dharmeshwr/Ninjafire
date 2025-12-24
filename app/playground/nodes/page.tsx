"use client";

import { useEffect, useRef } from "react";
import Matter from "matter-js";
import Stats from "stats.js";

const WALL_THICKNESS = 50;
const NODE_RADIUS = 13;
const NODE_COUNT = 20;

const PHYSICS_CONFIG = {
  frictionAir: 0.1,
  restitution: 0.3,
  friction: 0.1,
};

const COLORS = {
  background: "#111",
  node: "#bfbfbf",
  nodeDimmed: "#636363",
  nodeHover: "#6495ED",
  nodeHoverBorder: "#1b6afc",
  link: "#333",
  text: "#fff",
};

const MOCK_NODES = Array.from({ length: NODE_COUNT }, (_, i) => ({
  id: `node-${i}`,
  label: `Note ${i}`,
  x: typeof window === "undefined" ? 0 : Math.random() * window.innerWidth,
  y: typeof window === "undefined" ? 0 : Math.random() * window.innerHeight,
}));

const createWalls = (width: number, height: number) => {
  const thickness = WALL_THICKNESS;

  return [
    // Top wall
    Matter.Bodies.rectangle(width / 2, -thickness / 2, width, thickness, {
      isStatic: true,
      render: { visible: false },
    }),
    // Bottom wall
    Matter.Bodies.rectangle(
      width / 2,
      height + thickness / 2,
      width,
      thickness,
      {
        isStatic: true,
        render: { visible: false },
      },
    ),
    // Right wall
    Matter.Bodies.rectangle(
      width + thickness / 2,
      height / 2,
      thickness,
      height,
      {
        isStatic: true,
        render: { visible: false },
      },
    ),
    // Left wall
    Matter.Bodies.rectangle(-thickness / 2, height / 2, thickness, height, {
      isStatic: true,
      render: { visible: false },
    }),
  ];
};

const createNodeBodies = (nodes: typeof MOCK_NODES) => {
  return nodes.map((node) =>
    Matter.Bodies.circle(node.x, node.y, NODE_RADIUS, {
      isStatic: false,
      ...PHYSICS_CONFIG,
      label: node.id,
      render: { fillStyle: COLORS.node },
      plugin: { label: node.label },
    }),
  );
};

const setupMouseInteraction = (
  engine: Matter.Engine,
  render: Matter.Render,
) => {
  const mouse = Matter.Mouse.create(render.canvas);
  mouse.pixelRatio = window.devicePixelRatio;

  const mouseConstraint = Matter.MouseConstraint.create(engine, {
    mouse,
    constraint: {
      stiffness: 0.2,
      render: { visible: false },
    },
  });

  render.mouse = mouse;
  return { mouse, mouseConstraint };
};

const createConnections = (bodies: Matter.Body[]) => {
  const constraints: Matter.Constraint[] = [];

  bodies.forEach((bodyA) => {
    const connectionsCount = Math.floor(Math.random() * 2) + 1;

    for (let i = 0; i < connectionsCount; i++) {
      const randomIdx = Math.floor(Math.random() * bodies.length);
      const bodyB = bodies[randomIdx];

      if (bodyA !== bodyB) {
        const constraint = Matter.Constraint.create({
          bodyA: bodyA,
          bodyB: bodyB,
          stiffness: 0.005,
          damping: 0.1,
          render: {
            visible: true,
            strokeStyle: COLORS.link,
            lineWidth: 1,
            type: "line",
          },
        });
        constraints.push(constraint);
      }
    }
  });
  return constraints;
};

const handleHoverEffects = (
  bodies: Matter.Body[],
  canvas: HTMLCanvasElement,
  mouse: Matter.Mouse,
  mouseConstraint: Matter.MouseConstraint,
) => {
  const hoveredBodies = Matter.Query.point(bodies, mouse.position);
  const draggedBody = mouseConstraint.body;

  const isInteracting = hoveredBodies.length > 0 || draggedBody !== null;

  bodies.forEach((body) => {
    const isActive = hoveredBodies.includes(body) || body === draggedBody;

    if (isActive) {
      body.render.fillStyle = COLORS.nodeHover;
      body.render.strokeStyle = COLORS.nodeHoverBorder;
      body.render.lineWidth = 4;
    } else {
      body.render.fillStyle = isInteracting ? COLORS.nodeDimmed : COLORS.node;
      body.render.strokeStyle = "transparent";
      body.render.lineWidth = 0;
    }
  });

  canvas.style.cursor = isInteracting ? "pointer" : "default";
};

const renderLabels = (ctx: CanvasRenderingContext2D, bodies: Matter.Body[]) => {
  ctx.font = "20px Inter, sans-serif";
  ctx.textAlign = "center";
  ctx.fillStyle = COLORS.text;

  bodies.forEach((body) => {
    if (!body.plugin?.label) return;

    const { x, y } = body.position;
    const radius = body.circleRadius || NODE_RADIUS;

    ctx.fillText(body.plugin.label, x, y + radius + 25);
  });
};

const setupStats = () => {
  const stats = new Stats();
  stats.showPanel(0);
  stats.dom.style.position = "absolute";
  stats.dom.style.top = "";
  stats.dom.style.bottom = "0px";
  document.body.appendChild(stats.dom);
  return stats;
};

export default function Nodes() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const renderRef = useRef<Matter.Render | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (typeof window === "undefined" || !canvas) return;

    // Create physics engine
    const engine = Matter.Engine.create({ enableSleeping: false });
    engine.gravity.y = 0;
    engineRef.current = engine;

    // Create renderer
    const render = Matter.Render.create({
      canvas,
      engine,
      options: {
        width: window.innerWidth,
        height: window.innerHeight,
        background: COLORS.background,
        wireframes: false,
        pixelRatio: window.devicePixelRatio,
      },
    });
    renderRef.current = render;

    // Create world elements
    const walls = createWalls(window.innerWidth, window.innerHeight);
    const bodies = createNodeBodies(MOCK_NODES);
    const constraints = createConnections(bodies);

    Matter.Composite.add(engine.world, [...walls, ...bodies, ...constraints]);

    // Setup mouse interaction
    const { mouse, mouseConstraint } = setupMouseInteraction(engine, render);
    Matter.Composite.add(engine.world, mouseConstraint);

    Matter.Events.on(render, "beforeRender", () => {
      handleHoverEffects(bodies, canvas, mouse, mouseConstraint);
    });

    Matter.Events.on(render, "afterRender", () => {
      const allBodies = Matter.Composite.allBodies(engine.world);
      renderLabels(render.context, allBodies);
    });

    const stats = setupStats();
    Matter.Events.on(render, "beforeRender", () => stats.begin());
    Matter.Events.on(render, "afterRender", () => stats.end());

    const runner = Matter.Runner.create();
    runnerRef.current = runner;
    Matter.Runner.run(runner, engine);
    Matter.Render.run(render);

    return () => {
      if (stats.dom && document.body.contains(stats.dom)) {
        document.body.removeChild(stats.dom);
      }
      Matter.Render.stop(render);
      Matter.Runner.stop(runner);
      Matter.Engine.clear(engine);
    };
  }, []);

  return <canvas ref={canvasRef} />;
}
