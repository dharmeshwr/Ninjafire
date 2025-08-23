"use client";

import { useEffect, useRef, useState } from "react";

class VideoPreview {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.video = null;

    this.currentTime = 0;
    this.duration = 0;
    this.isPlaying = false;
    this.isDragging = false;

    this.timeline = null;
    this.onTimeUpdate = null;

    this.zoomFactor = 1;
    this.panX = 0;
    this.panY = 0;
  }

  init(canvasElement, onTimeUpdate) {
    this.canvas = canvasElement;
    this.ctx = this.canvas.getContext("2d");
    this.onTimeUpdate = onTimeUpdate;
    this.setupCanvas();
  }

  setupCanvas() {
    if (!this.canvas) return;

    this.canvas.width = 800;
    this.canvas.height = 450;

    this.ctx.fillStyle = "#000000";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.fillStyle = "#666666";
    this.ctx.font = "24px Arial";
    this.ctx.textAlign = "center";
    this.ctx.fillText(
      "Load a video file to start",
      this.canvas.width / 2,
      this.canvas.height / 2,
    );
  }

  loadVideo(file) {
    if (!file) return;

    if (this.video) {
      this.video.remove();
    }

    this.video = document.createElement("video");
    this.video.style.display = "none";
    this.video.crossOrigin = "anonymous";

    document.body.appendChild(this.video);

    const url = URL.createObjectURL(file);
    this.video.src = url;

    this.video.addEventListener("loadedmetadata", () => {
      this.duration = this.video.duration;
      this.currentTime = 0;
      this.isPlaying = false;
      this.startRenderLoop();

      if (this.onTimeUpdate) {
        this.onTimeUpdate(this.currentTime, this.duration);
      }
    });

    this.video.addEventListener("play", () => {
      this.isPlaying = true;
    });

    this.video.addEventListener("pause", () => {
      this.isPlaying = false;
    });
  }

  setZoom(factor) {
    this.zoomFactor = Math.max(1, factor);
    // Clamp pan based on new zoom
    const vw = this.video?.videoWidth || 0;
    const vh = this.video?.videoHeight || 0;
    if (vw && vh) {
      const cw = vw / this.zoomFactor;
      const ch = vh / this.zoomFactor;
      const maxPanX = (vw - cw) / 2;
      const maxPanY = (vh - ch) / 2;
      this.panX = Math.max(-maxPanX, Math.min(maxPanX, this.panX));
      this.panY = Math.max(-maxPanY, Math.min(maxPanY, this.panY));
    }
  }

  startRenderLoop() {
    const render = () => {
      if (this.video && this.video.readyState >= 2 && this.ctx) {
        this.ctx.fillStyle = "#000000";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        const vw = this.video.videoWidth;
        const vh = this.video.videoHeight;
        if (vw && vh) {
          const zoom = this.zoomFactor;
          const cw = vw / zoom;
          const ch = vh / zoom;
          let cx = (vw - cw) / 2 + this.panX;
          let cy = (vh - ch) / 2 + this.panY;

          // Clamp crop to video bounds
          cx = Math.max(0, Math.min(vw - cw, cx));
          cy = Math.max(0, Math.min(vh - ch, cy));

          this.ctx.drawImage(
            this.video,
            cx,
            cy,
            cw,
            ch,
            0,
            0,
            this.canvas.width,
            this.canvas.height,
          );
        } else {
          this.ctx.drawImage(
            this.video,
            0,
            0,
            this.canvas.width,
            this.canvas.height,
          );
        }

        // Update currentTime every frame for smooth playhead movement
        if (!this.isDragging && this.onTimeUpdate) {
          this.currentTime = this.video.currentTime;
          this.onTimeUpdate(this.currentTime, this.duration);
        }
      }
      requestAnimationFrame(render);
    };
    requestAnimationFrame(render);
  }

  togglePlayPause() {
    if (!this.video) return;

    if (this.isPlaying) {
      this.video.pause();
    } else {
      this.video.play();
    }
  }

  seekTo(time) {
    if (!this.video) return;

    time = Math.max(0, Math.min(time, this.duration));
    this.video.currentTime = time;
    this.currentTime = time;

    if (this.onTimeUpdate) {
      this.onTimeUpdate(this.currentTime, this.duration);
    }
  }
}

function formatTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  if (h > 0) {
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function Page() {
  const videoPreviewRef = useRef(null);
  const canvasRef = useRef(null);
  const timelineScrollRef = useRef(null);
  const timelineContainerRef = useRef(null);
  const playheadRef = useRef(null);

  const [zoomLevel, setZoomLevel] = useState(5);
  const [videoZoom, setVideoZoom] = useState(1);
  const [width, setWidth] = useState(100);
  const [ticks, setTicks] = useState([]);

  const [currentTime, setCurrentTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // RAF and smooth-playhead refs
  const rafRef = useRef(null);
  const displayedXRef = useRef(0); // the interpolated X used for transform
  const targetXRef = useRef(0); // the raw target X (currentTime * px/sec)

  const handleTimeUpdate = (time, duration) => {
    setCurrentTime(time);
    if (duration && duration !== videoDuration) {
      setVideoDuration(duration);
    }
  };

  useEffect(() => {
    if (canvasRef.current) {
      videoPreviewRef.current = new VideoPreview();
      videoPreviewRef.current.init(canvasRef.current, handleTimeUpdate);
    }

    return () => {
      if (videoPreviewRef.current?.video)
        videoPreviewRef.current.video.remove();
    };
  }, []);

  useEffect(() => {
    videoPreviewRef.current?.setZoom(videoZoom);
  }, [videoZoom]);

  // Add pan and zoom interactions on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let isPanDragging = false;
    let startMouseX, startMouseY, startPanX, startPanY;

    const handleMouseDown = (e) => {
      if (videoZoom > 1) {
        isPanDragging = true;
        startMouseX = e.clientX;
        startMouseY = e.clientY;
        startPanX = videoPreviewRef.current.panX;
        startPanY = videoPreviewRef.current.panY;
        canvas.style.cursor = "grabbing";
      }
    };

    const handleMouseMove = (e) => {
      if (isPanDragging) {
        const deltaX = e.clientX - startMouseX;
        const deltaY = e.clientY - startMouseY;

        const zoom = videoPreviewRef.current.zoomFactor;
        const vw = videoPreviewRef.current.video?.videoWidth || 0;
        const vh = videoPreviewRef.current.video?.videoHeight || 0;
        const destW = canvas.width;
        const destH = canvas.height;

        if (vw && vh && zoom > 1) {
          const cropW = vw / zoom;
          const cropH = vh / zoom;
          const scaleX = cropW / destW;
          const scaleY = cropH / destH;

          const newPanX = startPanX - deltaX * scaleX;
          const newPanY = startPanY - deltaY * scaleY;

          const maxPanX = (vw - cropW) / 2;
          const maxPanY = (vh - cropH) / 2;

          videoPreviewRef.current.panX = Math.max(
            -maxPanX,
            Math.min(maxPanX, newPanX),
          );
          videoPreviewRef.current.panY = Math.max(
            -maxPanY,
            Math.min(maxPanY, newPanY),
          );
        }
      }
    };

    const handleMouseUp = () => {
      isPanDragging = false;
      canvas.style.cursor = "default";
    };

    const handleWheel = (e) => {
      e.preventDefault();
      const delta = -Math.sign(e.deltaY) * 0.5; // +0.5 for zoom in (wheel up), -0.5 for out
      setVideoZoom((prev) => Math.max(1, Math.min(10, prev + delta)));
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("wheel", handleWheel);
    };
  }, [videoZoom]);

  // Tick configurations for each zoom level
  const tickConfigs = [
    // zoom 0: min zoom
    { majorInterval: 600, minorsBetween: 1 }, // 10 min major, 1 minor
    // zoom 1
    { majorInterval: 300, minorsBetween: 0 }, // 5 min major, no minor
    // zoom 2
    { majorInterval: 105, minorsBetween: 6 }, // 105s major, 6 minors
    // zoom 3
    { majorInterval: 60, minorsBetween: 3 }, // 60s major, 3 minors
    // zoom 4
    { majorInterval: 30, minorsBetween: 1 }, // 30s major, 1 minor
    // zoom 5
    { majorInterval: 12, minorsBetween: 11 }, // 12s major, 11 minors
    // zoom 6
    { majorInterval: 6, minorsBetween: 5 }, // 6s major, 5 minors
    // zoom 7
    { majorInterval: 3, minorsBetween: 2 }, // 3s major, 2 minors
    // zoom 8
    { majorInterval: 2, minorsBetween: 1 }, // 2s major, 1 minor
    // zoom 9 (if allowed)
    { majorInterval: 1, minorsBetween: 0 }, // 1s major, no minor
  ];

  // compute pixelsPerSecond and update width/ticks only if video is loaded
  useEffect(() => {
    if (videoDuration <= 0) {
      setTicks([]);
      setWidth(0);
      return;
    }

    let pixelsPerSecond = Math.pow(2, zoomLevel);
    const minPixelsPerSecond = 800 / videoDuration;
    if (pixelsPerSecond < minPixelsPerSecond) {
      pixelsPerSecond = minPixelsPerSecond;
    }
    const totalWidth = videoDuration * pixelsPerSecond;
    setWidth(totalWidth);

    const effectiveZoom = Math.log2(pixelsPerSecond);
    let configIndex = Math.round(effectiveZoom);
    configIndex = Math.max(0, Math.min(9, configIndex));
    const config = tickConfigs[configIndex];
    const majorInterval = config.majorInterval;
    const minorsBetween = config.minorsBetween;
    const minorInterval =
      minorsBetween > 0 ? majorInterval / (minorsBetween + 1) : 0;

    const newTicks = [];

    for (let t = 0; t <= videoDuration; t += majorInterval) {
      newTicks.push({
        x: t * pixelsPerSecond,
        time: t,
        label: formatTime(t),
        type: "major",
        height: 20,
      });
    }

    // Add minor ticks if applicable
    if (minorInterval > 0) {
      for (let t = minorInterval; t <= videoDuration; t += minorInterval) {
        // Avoid adding minor if it coincides with major (floating point tolerance)
        if (Math.abs(t % majorInterval) > 1e-6) {
          newTicks.push({
            x: t * pixelsPerSecond,
            time: t,
            label: null,
            type: "minor",
            height: 10,
          });
        }
      }
    }

    // Always add a major tick at the end if the distance allows (to ensure end label visibility)
    const minLabelDistancePx = 60;
    const lastTick = newTicks[newTicks.length - 1] || { x: 0, time: 0 };
    const endX = videoDuration * pixelsPerSecond;
    if (
      endX - lastTick.x > minLabelDistancePx &&
      Math.abs(videoDuration - lastTick.time) > 1e-6
    ) {
      newTicks.push({
        x: endX,
        time: videoDuration,
        label: formatTime(videoDuration),
        type: "major",
        height: 20,
      });
    }

    setTicks(newTicks);
  }, [zoomLevel, videoDuration]);

  // Update targetX whenever currentTime or zoom changes
  useEffect(() => {
    if (videoDuration <= 0) return;

    let pixelsPerSecond = Math.pow(2, zoomLevel);
    const minPixelsPerSecond = 800 / videoDuration;
    if (pixelsPerSecond < minPixelsPerSecond) {
      pixelsPerSecond = minPixelsPerSecond;
    }
    const target = currentTime * pixelsPerSecond;
    targetXRef.current = target;
    // start RAF loop if not running
    if (!rafRef.current) {
      startPlayheadRAF();
    }
  }, [currentTime, zoomLevel, videoDuration]);

  // Smooth animation: lerp displayedX -> (targetX - scrollLeft)
  function startPlayheadRAF() {
    if (!playheadRef.current) return;
    if (rafRef.current) return; // already running

    const step = () => {
      const scrollLeft = timelineScrollRef.current?.scrollLeft || 0;
      const targetVisibleX = targetXRef.current - scrollLeft;

      // LERP
      const displayed = displayedXRef.current;
      const delta = targetVisibleX - displayed;
      // easing factor (0 < f < 1). tweak for more/less smoothness
      const f = 0.16;
      displayedXRef.current = displayed + delta * f;

      // apply transform (use translateX so GPU handles it)
      playheadRef.current.style.transform = `translateX(${displayedXRef.current}px)`;

      // stop RAF if very close to target to avoid permanent loop
      if (Math.abs(delta) > 0.2) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        // snap to exact value and clear RAF id
        playheadRef.current.style.transform = `translateX(${targetVisibleX}px)`;
        displayedXRef.current = targetVisibleX;
        rafRef.current = null;
      }
    };

    rafRef.current = requestAnimationFrame(step);
  }

  // make sure RAF stops on unmount
  useEffect(() => {
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, []);

  // Auto-scroll to keep playhead visible (uses currentTime directly)
  useEffect(() => {
    if (!timelineScrollRef.current || videoDuration <= 0) return;
    const container = timelineScrollRef.current;
    const containerWidth = container.clientWidth;
    let pixelsPerSecond = Math.pow(2, zoomLevel);
    const minPixelsPerSecond = 800 / videoDuration;
    if (pixelsPerSecond < minPixelsPerSecond) {
      pixelsPerSecond = minPixelsPerSecond;
    }
    const playheadX = currentTime * pixelsPerSecond;

    // Auto-scroll when playhead goes beyond visible area (left or right edge)
    if (
      playheadX < container.scrollLeft + 20 ||
      playheadX > container.scrollLeft + containerWidth - 50
    ) {
      const newScrollLeft = Math.max(0, playheadX - containerWidth / 2);
      container.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });
      // after a smooth scroll, the RAF loop will compute the correct visible position automatically
      // ensure RAF is running to catch transform updates while scroll animates
      if (!rafRef.current) startPlayheadRAF();
    }
  }, [currentTime, zoomLevel, videoDuration]);

  // When user scrolls the timeline, we need to update the playhead's displayed position smoothly
  useEffect(() => {
    const el = timelineScrollRef.current;
    if (!el || videoDuration <= 0) return;

    let ticking = false;
    const onScroll = () => {
      if (!playheadRef.current) return;
      if (!ticking) {
        // ensure RAF is active so transform uses updated scrollLeft
        startPlayheadRAF();
        ticking = true;
        requestAnimationFrame(() => {
          // after one frame allow next scroll to re-trigger
          ticking = false;
        });
      }
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [videoDuration]);

  // Handle timeline click and drag (unchanged behavior)
  const handleTimelineMouseDown = (e) => {
    if (videoDuration <= 0) return;

    const timelineElement =
      timelineScrollRef.current?.querySelector(".timeline-content");
    if (!timelineElement) return;

    const rect = timelineElement.getBoundingClientRect();
    const clickX = e.clientX - rect.left + timelineScrollRef.current.scrollLeft;
    let pixelsPerSecond = Math.pow(2, zoomLevel);
    const minPixelsPerSecond = 800 / videoDuration;
    if (pixelsPerSecond < minPixelsPerSecond) {
      pixelsPerSecond = minPixelsPerSecond;
    }
    const seekTime = clickX / pixelsPerSecond;

    if (videoPreviewRef.current && videoDuration > 0) {
      videoPreviewRef.current.isDragging = true;
      videoPreviewRef.current.seekTo(seekTime);
    } else {
      const clampedTime = Math.max(0, Math.min(seekTime, videoDuration));
      setCurrentTime(clampedTime);
    }

    setIsDragging(true);
    e.preventDefault();
  };

  const handleTimelineMouseMove = (e) => {
    if (!isDragging || videoDuration <= 0) return;

    const timelineElement =
      timelineScrollRef.current?.querySelector(".timeline-content");
    if (!timelineElement) return;

    const rect = timelineElement.getBoundingClientRect();
    const mouseX = e.clientX - rect.left + timelineScrollRef.current.scrollLeft;
    let pixelsPerSecond = Math.pow(2, zoomLevel);
    const minPixelsPerSecond = 800 / videoDuration;
    if (pixelsPerSecond < minPixelsPerSecond) {
      pixelsPerSecond = minPixelsPerSecond;
    }
    const seekTime = Math.max(
      0,
      Math.min(mouseX / pixelsPerSecond, videoDuration),
    );

    if (videoPreviewRef.current && videoDuration > 0) {
      videoPreviewRef.current.seekTo(seekTime);
    } else {
      setCurrentTime(seekTime);
    }
  };

  const handleTimelineMouseUp = () => {
    if (videoPreviewRef.current) {
      videoPreviewRef.current.isDragging = false;
    }
    setIsDragging(false);
  };

  useEffect(() => {
    document.addEventListener("mousemove", handleTimelineMouseMove);
    document.addEventListener("mouseup", handleTimelineMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleTimelineMouseMove);
      document.removeEventListener("mouseup", handleTimelineMouseUp);
    };
  }, [isDragging, zoomLevel, videoDuration]);

  useEffect(() => {
    const timelineElement = timelineScrollRef.current;
    if (!timelineElement || videoDuration <= 0) return;

    const handleWheel = (e) => {
      e.preventDefault();

      const scrollAmount = e.deltaY;
      const scrollMultiplier = Math.max(2, 15 - zoomLevel * 2);

      timelineElement.scrollLeft += scrollAmount * scrollMultiplier;
    };

    timelineElement.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      timelineElement.removeEventListener("wheel", handleWheel);
    };
  }, [zoomLevel, videoDuration]);

  const minPixelsPerSecond = videoDuration > 0 ? 800 / videoDuration : 0;
  const isZoomOutDisabled =
    zoomLevel === 0 ||
    (videoDuration > 0 && Math.pow(2, zoomLevel) <= minPixelsPerSecond);
  const isZoomInDisabled = zoomLevel === 9;

  const isVideoZoomOutDisabled = videoZoom <= 1;
  const isVideoZoomInDisabled = videoZoom >= 10;

  return (
    <div className="fixed inset-0 z-50 bg-background p-4 font-mono">
      <div className="mb-4 flex w-full justify-center py-2 text-xl">
        Video Preview on a canvas
      </div>

      <div>
        <div className="flex w-full justify-center">
          <canvas ref={canvasRef} width={800} height={450} />
        </div>

        <div className="flex w-full items-center justify-evenly py-3">
          <button
            onClick={() => videoPreviewRef.current?.togglePlayPause()}
            disabled={!videoDuration}
          >
            Play/Pause
          </button>

          <input
            type="file"
            accept="video/*"
            onChange={(e) =>
              videoPreviewRef.current?.loadVideo(e.target.files[0])
            }
            className="text-sm"
          />

          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-400">Timeline Zoom:</span>
            <button
              className="rounded border border-neutral-500 bg-neutral-700 px-2 py-0.5 hover:bg-neutral-600"
              onClick={() => setZoomLevel((prev) => Math.max(0, prev - 1))}
              disabled={isZoomOutDisabled}
            >
              -
            </button>
            <span className="w-8 text-center font-mono text-sm">
              {zoomLevel}
            </span>
            <button
              className="rounded border border-neutral-500 bg-neutral-700 px-2 py-0.5 hover:bg-neutral-600"
              onClick={() => setZoomLevel((prev) => Math.min(9, prev + 1))}
              disabled={isZoomInDisabled}
            >
              +
            </button>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-400">Video Zoom:</span>
            <button
              className="rounded border border-neutral-500 bg-neutral-700 px-2 py-0.5 hover:bg-neutral-600"
              onClick={() => setVideoZoom((prev) => Math.max(1, prev - 0.5))}
              disabled={isVideoZoomOutDisabled}
            >
              -
            </button>
            <span className="w-8 text-center font-mono text-sm">
              {videoZoom.toFixed(1)}
            </span>
            <button
              className="rounded border border-neutral-500 bg-neutral-700 px-2 py-0.5 hover:bg-neutral-600"
              onClick={() => setVideoZoom((prev) => Math.min(10, prev + 0.5))}
              disabled={isVideoZoomInDisabled}
            >
              +
            </button>
          </div>
        </div>

        {videoDuration > 0 && (
          <>
            <div className="flex items-center justify-between bg-neutral-800 px-4 py-2 text-xs text-neutral-400">
              <div>
                Current Time: {formatTime(currentTime)} /{" "}
                {formatTime(videoDuration)}
              </div>
              <div>
                Timeline Zoom: {Math.pow(2, zoomLevel).toFixed(1)}x | Video
                Zoom: {videoZoom.toFixed(1)}x
              </div>
            </div>

            <div className="relative pt-4" ref={timelineContainerRef}>
              {/* Playhead — use transform for smooth GPU animation */}
              <div
                ref={playheadRef}
                className="pointer-events-none absolute bottom-0 top-4 z-10 h-full w-px rounded-full bg-[rgb(226,64,64)]"
                style={{
                  left: 0, // we'll position via transform
                  willChange: "transform",
                }}
              >
                <div className="-ml-[calc(0.37rem-0.5px)] -mt-2 size-3 rounded-full bg-[rgb(226,64,64)]" />
              </div>

              <div
                ref={timelineScrollRef}
                className="scrollbar-thin scrollbar-track-neutral-800 scrollbar-thumb-neutral-600 hover:scrollbar-thumb-neutral-500 h-12 cursor-grab overflow-x-auto bg-neutral-900"
                style={{ scrollbarWidth: "thin" }}
              >
                <div
                  className="timeline-content relative h-full"
                  style={{ width: `${width}px`, minWidth: "100%" }}
                  onMouseDown={handleTimelineMouseDown}
                >
                  {ticks.map((tick, idx) => (
                    <div key={idx}>
                      <div
                        className={`absolute bottom-0 ${
                          tick.type === "major"
                            ? "w-px bg-neutral-400"
                            : "w-px bg-neutral-600"
                        }`}
                        style={{
                          left: `${tick.x}px`,
                          height: `${tick.height}px`,
                        }}
                      />
                      {tick.label && (
                        <div
                          className="pointer-events-none absolute select-none font-mono text-xs text-neutral-300"
                          style={{
                            left: `${tick.x}px`,
                            top: "4px",
                            transform: "translateX(-50%)",
                          }}
                        >
                          {tick.label}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative my-3 flex h-[4.25rem] flex-row overflow-hidden bg-neutral-800 py-0.5">
                <div
                  style={{
                    "--segment-x": "0px",
                    transform: "translateX(var(--segment-x))",
                    width: `${width}px`,
                  }}
                  className="group absolute inset-y-0 overflow-hidden rounded border border-[#4585bb]"
                >
                  <canvas
                    className="pointer-events-none absolute inset-0 h-full w-full"
                    height="52"
                    width="500px"
                  ></canvas>
                  <div className="flex size-full items-center justify-center bg-[#458588]">
                    Clip
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
