"use client";

import { useEffect, useRef } from "react";

export default function Page() {
  let isZoomed = false;
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

  const drawBackground = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!canvas || !ctx) return;

    const gridSize = 20;

    ctx.strokeStyle = "rgba(255,255,255,0.08)";
    ctx.lineWidth = 1;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let x = 0; x < canvas.width; x += gridSize) {
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.arc(x, y, 1, 0, 2 * Math.PI);
        ctx.stroke();
      }
    }
  };

  const drawImage = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const image = imageRef.current;

    if (!canvas || !ctx || !image) return;

    const { x, y, width, height } = getImageDimensions();

    drawBackground();
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

  const zoomEffect = (x, y) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!canvas || !ctx) return;

    const duration = 1000;
    const start = performance.now();

    const animate = (time) => {
      let progress = (time - start) / duration;
      if (progress > 1) {
        isZoomed = true;
        progress = 1;
      }

      const eased = easeOutBack(progress);
      const scale = 1 + (ZOOM_LEVEL - 1) * eased;

      ctx.save();

      ctx.translate(x, y);
      ctx.scale(scale, scale);
      ctx.translate(-x, -y);

      drawImage();

      ctx.restore();

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

    const animate = (time) => {
      const progress = (time - start) / duration;
      if (progress > 1) progress = 1;

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
    createImage("/profile.png");

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

      <span className="absolute bottom-0 left-1/2 translate-x-[-50%] text-sm opacity-30">
        Press <strong>U</strong> to upload image
      </span>
    </div>
  );
}

{
  /*
      Most basic zoom logic

      const zoomEffect = (x, y) => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d')

        if (!canvas || !ctx) return

        let currentZoom = 1
        const scaler = () => {
          if (currentZoom >= ZOOM_LEVEL) return

          ctx.save();

          ctx.translate(x, y);
          ctx.scale(currentZoom, currentZoom);
          ctx.translate(-x, -y);


          drawImage()
          currentZoom += 0.03

          ctx.restore();
          requestAnimationFrame(scaler)
        }

        requestAnimationFrame(scaler)
      }
  */
}
