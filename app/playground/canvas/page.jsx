"use client";

import { useEffect, useRef } from "react";

export default function Page() {
  let isZoomed = false;
  let currentScale = 1;
  let currentTranslateX = 0;
  let currentTranslateY = 0;
  const ZOOM_LEVEL = 2;
  const canvasRef = useRef(null);
  const inputRef = useRef(null);
  const imageRef = useRef(null);

  const easeOutBack = (t, s = 1.70158) => --t * t * ((s + 1) * t + s) + 1;

  const getImageDimensions = () => {
    const canvas = canvasRef.current;
    const image = imageRef.current;

    if (!canvas || !image) return;

    const imgAspect = image.width / image.height;
    const canvasAspect = canvas.width / canvas.height;

    let drawWidth, drawHeight, offsetX, offsetY;

    if (imgAspect > canvasAspect) {
      drawWidth = canvas.width;
      drawHeight = canvas.width / imgAspect;
      offsetX = 0;
      offsetY = (canvas.height - drawHeight) / 2;
    } else {
      drawHeight = canvas.height;
      drawWidth = canvas.height * imgAspect;
      offsetY = 0;
      offsetX = (canvas.width - drawWidth) / 2;
    }

    return { x: offsetX, y: offsetY, width: drawWidth, height: drawHeight };
  };

  const drawImage = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const image = imageRef.current;

    if (!canvas || !ctx || !image) return;

    const { x, y, width, height } = getImageDimensions();

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, x, y, width, height);
  };

  const createImage = (url) => {
    const img = new Image();
    img.src = url;

    img.onload = () => {
      imageRef.current = img;
      drawImage();
    };
  };

  const handleInputFile = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    createImage(url);
  };

  const onKeyDown = (event) => {
    if (event.key === "u" || event.key === "U") inputRef.current.click();
  };

  const onMouseDown = (event) => {
    if (isZoomed) {
      panEffect(event.clientX, event.clientY);
    } else {
      zoomEffect(event.clientX, event.clientY);
    }
  };

  const draw = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();

    ctx.translate(currentTranslateX, currentTranslateY);
    ctx.scale(currentScale, currentScale);

    drawImage();

    ctx.restore();
  };

  // Updated zoomEffect (now uses/sets shared state for consistency with pan)
  const zoomEffect = (x, y) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const duration = 1000;
    const start = performance.now();
    const startScale = currentScale;
    const targetScale = ZOOM_LEVEL;
    const startTranslateX = currentTranslateX;
    const startTranslateY = currentTranslateY;

    // World coords of clicked point
    const worldX = (x - startTranslateX) / startScale;
    const worldY = (y - startTranslateY) / startScale;

    // Target translate keeps clicked point fixed during zoom
    const targetTranslateX = x - targetScale * worldX;
    const targetTranslateY = y - targetScale * worldY;

    const animate = (time) => {
      let progress = Math.min((time - start) / duration, 1);
      if (progress === 1) {
        isZoomed = true;
        currentScale = targetScale;
        currentTranslateX = targetTranslateX;
        currentTranslateY = targetTranslateY;
      } else {
        const eased = easeOutBack(progress);
        currentScale = startScale + (targetScale - startScale) * eased;
        currentTranslateX =
          startTranslateX + (targetTranslateX - startTranslateX) * eased;
        currentTranslateY =
          startTranslateY + (targetTranslateY - startTranslateY) * eased;
      }

      draw();

      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  };

  const panEffect = (x, y) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const duration = 1000;
    const start = performance.now();
    const startTranslateX = currentTranslateX;
    const startTranslateY = currentTranslateY;

    // World coords of clicked point
    const worldX = (x - currentTranslateX) / currentScale;
    const worldY = (y - currentTranslateY) / currentScale;

    // Target translate moves clicked world point to canvas center
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const targetTranslateX = centerX - currentScale * worldX;
    const targetTranslateY = centerY - currentScale * worldY;

    const animate = (time) => {
      let progress = Math.min((time - start) / duration, 1);
      if (progress === 1) {
        currentTranslateX = targetTranslateX;
        currentTranslateY = targetTranslateY;
      } else {
        const eased = easeOutBack(progress); // Or use a different easing if preferred (e.g., linear)
        currentTranslateX =
          startTranslateX + (targetTranslateX - startTranslateX) * eased;
        currentTranslateY =
          startTranslateY + (targetTranslateY - startTranslateY) * eased;
      }

      draw();

      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  };

  const onResize = () => {
    setupCanvas();
    drawImage();
  };

  const setupCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!canvas || !ctx) return;

    /* High DPI / crispness */
    const cssW = window.innerWidth;
    const cssH = window.innerHeight;

    const dpr = window.devicePixelRatio || 1;

    canvas.width = Math.floor(cssW * dpr);
    canvas.height = Math.floor(cssH * dpr);

    canvas.style.width = cssW + "px";
    canvas.style.height = cssH + "px";

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  useEffect(() => {
    setupCanvas();
    createImage("https://placewaifu.com/image");

    canvasRef.current &&
      canvasRef.current.addEventListener("mousedown", onMouseDown);

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", drawImage);
      window.removeEventListener("keydown", onResize);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50">
      <canvas ref={canvasRef} className="bg-background"></canvas>

      <input
        type="file"
        ref={inputRef}
        className="hidden"
        onChange={handleInputFile}
      />

      <span className="absolute bottom-0 left-1/2 translate-x-[-50%] rounded-t-lg bg-white/30 px-2 py-1 text-sm text-black/40 backdrop-blur-md">
        Press U to upload image
      </span>
    </div>
  );
}
