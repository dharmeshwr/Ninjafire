import { useEffect } from "react";
import {
  Bodies,
  Body,
  Composite,
  Engine,
  Events,
  Mouse,
  MouseConstraint,
  Render,
  Runner,
  Vector,
} from "matter-js";

// for playground use
export function useMatterJS(sceneRef: React.RefObject<HTMLDivElement>) {
  useEffect(() => {
    if (!sceneRef.current) return;
    const { clientWidth, clientHeight } = sceneRef.current;

    // Setup engine, runner and render
    const engine = Engine.create();
    const runner = Runner.create();
    const render = Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width: clientWidth,
        height: clientHeight,
        wireframes: false,
        background: "transparent",
        showAngleIndicator: false,
      },
    });

    // Make objects and interaction
    const THICCNESS = 60;
    const ground = Bodies.rectangle(
      clientWidth / 2,
      clientHeight + THICCNESS / 2,
      clientWidth,
      THICCNESS,
      { isStatic: true },
    );
    const leftWall = Bodies.rectangle(
      -1 - THICCNESS / 2,
      clientHeight / 2,
      THICCNESS,
      clientHeight * 5,
      { isStatic: true },
    );
    const rightWall = Bodies.rectangle(
      clientWidth + THICCNESS / 2,
      clientHeight / 2,
      THICCNESS,
      clientHeight * 5,
      { isStatic: true },
    );

    const circles = Array.from({ length: 50 }).map((_, i) => {
      return Bodies.circle(i, 10, 30, {
        friction: 0.3,
        frictionAir: 0.00001,
        restitution: 0.8,
        label: `${i + 1}`,
      });
    });

    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.1,
        render: { visible: false },
      },
    });

    // Add objects to composition
    Composite.add(engine.world, circles);
    Composite.add(engine.world, [ground, leftWall, rightWall]);
    Composite.add(engine.world, mouseConstraint);

    Events.on(render, "afterRender", () => {
      const context = render.context;

      circles.forEach((circle) => {
        const { x, y } = circle.position;
        context.fillStyle = "#ffffff"; // Text color
        context.font = "16px monospace";
        context.textAlign = "center";
        context.fillText(circle.label, x, y); // Draw the text
      });
    });
    // Now you can see objects
    Render.run(render);

    // Now this will make the objects fall to do whatever
    Runner.run(runner, engine);

    const handleResize = () => {
      if (!sceneRef.current) return;
      render.canvas.width = sceneRef?.current.clientWidth;
      render.canvas.height = sceneRef?.current.clientHeight;

      Body.setPosition(
        ground,
        Vector.create(
          sceneRef.current.clientWidth / 2,
          sceneRef.current.clientHeight + THICCNESS / 2,
        ),
      );
      Body.setPosition(
        rightWall,
        Vector.create(
          sceneRef.current.clientWidth + THICCNESS / 2,
          sceneRef.current.clientHeight / 2,
        ),
      );
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);

      Render.stop(render);
      Runner.stop(runner);
      Engine.clear(engine);
      render.canvas.remove();
      render.textures = {};
    };
  }, [sceneRef]);
}
