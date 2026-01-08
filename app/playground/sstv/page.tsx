"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";
import { PauseIcon, PlayIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import ControlPanel, { RangeSlider } from "@/components/shared/control-panel";

import { fetchWaifuImage } from "./utils";

export default function Page() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const configRef = useRef({ resolution: 64, speed: 10 });
  const playbackRef = useRef<
    ((startPos?: { row: number; col: number; phase: string }) => void) | null
  >(null);
  const cancelledRef = useRef(false);
  const isRunningRef = useRef(false);
  const savePositionOnCancelRef = useRef(true);
  const playbackPositionRef = useRef<{
    row: number;
    col: number;
    phase: string;
    imgData: Uint8ClampedArray;
    rows: number;
    cols: number;
  } | null>(null);
  const drawImageFnRef = useRef<
    | ((activeState?: {
        row: number;
        col: number;
        phase: string;
        rows: number;
        cols: number;
      }) =>
        | { rows: number; cols: number; imgData: Uint8ClampedArray }
        | undefined)
    | null
  >(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [mode] = useState("i2a");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const [config, setConfig] = useState(configRef.current);

  const initAudio = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();

      gainNodeRef.current = audioContextRef.current.createGain();
      gainNodeRef.current.gain.value = 0;
      gainNodeRef.current.connect(audioContextRef.current.destination);

      oscillatorRef.current = audioContextRef.current.createOscillator();
      oscillatorRef.current.type = "sine";
      oscillatorRef.current.frequency.value = 1500;
      oscillatorRef.current.connect(gainNodeRef.current);
      oscillatorRef.current.start();
    }
  };

  const playTone = async (frequency: number, durationMs: number) => {
    if (
      !audioContextRef.current ||
      !oscillatorRef.current ||
      !gainNodeRef.current
    )
      return;

    const ctx = audioContextRef.current;
    const now = ctx.currentTime;

    oscillatorRef.current.frequency.setValueAtTime(frequency, now);
    gainNodeRef.current.gain.setValueAtTime(0.3, now);
    gainNodeRef.current.gain.setValueAtTime(0, now + durationMs / 1000);

    await new Promise((resolve) => setTimeout(resolve, durationMs));
  };

  const valueToFrequency = (value: number) => {
    return 1500 + (value / 255) * 800;
  };

  // Generate complete audio buffer with phase continuity
  const generateAudioBuffer = (
    imgData: Uint8ClampedArray,
    rows: number,
    cols: number,
  ) => {
    const sampleRate = 44100;
    const pixelDuration = (20 * configRef.current.speed) / 1000; // seconds per pixel
    const syncDuration = 0.03; // 30ms sync beep between lines
    const separatorDuration = 0.002; // 2ms separator

    const samplesPerPixel = Math.floor(pixelDuration * sampleRate);
    const samplesPerSync = Math.floor(syncDuration * sampleRate);
    const samplesPerSeparator = Math.floor(separatorDuration * sampleRate);

    // Calculate total samples needed (R, G, B order per row, then sync beep)
    const samplesPerRow =
      cols * samplesPerPixel +
      samplesPerSeparator + // red scan
      cols * samplesPerPixel +
      samplesPerSeparator + // green scan
      cols * samplesPerPixel +
      samplesPerSync; // blue scan + line sync
    const totalSamples = rows * samplesPerRow;

    // Create audio context and buffer
    const ctx = new AudioContext();
    const buffer = ctx.createBuffer(1, totalSamples, sampleRate);
    const channelData = buffer.getChannelData(0);

    let phase = 0; // Track phase for continuity
    let sampleIndex = 0;

    // Helper function to generate samples for a given frequency
    const generateSamples = (frequency: number, numSamples: number) => {
      const omega = (2 * Math.PI * frequency) / sampleRate;
      for (let i = 0; i < numSamples; i++) {
        channelData[sampleIndex++] = 0.3 * Math.sin(phase);
        phase += omega;
        // Keep phase in reasonable range to avoid precision issues
        if (phase > 2 * Math.PI) {
          phase -= 2 * Math.PI;
        }
      }
    };

    // Generate audio for each row
    for (let row = 0; row < rows; row++) {
      // Red scan
      for (let col = 0; col < cols; col++) {
        const pixelIndex = (row * cols + col) * 4;
        const r = imgData[pixelIndex];
        const freq = valueToFrequency(r);
        generateSamples(freq, samplesPerPixel);
      }

      // Separator (silence)
      sampleIndex += samplesPerSeparator;

      // Green scan
      for (let col = 0; col < cols; col++) {
        const pixelIndex = (row * cols + col) * 4;
        const g = imgData[pixelIndex + 1];
        const freq = valueToFrequency(g);
        generateSamples(freq, samplesPerPixel);
      }

      // Separator (silence)
      sampleIndex += samplesPerSeparator;

      // Blue scan
      for (let col = 0; col < cols; col++) {
        const pixelIndex = (row * cols + col) * 4;
        const b = imgData[pixelIndex + 2];
        const freq = valueToFrequency(b);
        generateSamples(freq, samplesPerPixel);
      }

      // Line sync beep - 1200 Hz
      generateSamples(1200, samplesPerSync);
    }

    return buffer;
  };

  // Convert AudioBuffer to WAV file
  const audioBufferToWav = (buffer: AudioBuffer) => {
    const length = buffer.length * buffer.numberOfChannels * 2;
    const arrayBuffer = new ArrayBuffer(44 + length);
    const view = new DataView(arrayBuffer);
    const channels = [];
    let offset = 0;
    let pos = 0;

    // Write WAV header
    const setUint16 = (data: number) => {
      view.setUint16(pos, data, true);
      pos += 2;
    };

    const setUint32 = (data: number) => {
      view.setUint32(pos, data, true);
      pos += 4;
    };

    // "RIFF" chunk descriptor
    setUint32(0x46464952); // "RIFF"
    setUint32(36 + length); // file length - 8
    setUint32(0x45564157); // "WAVE"

    // "fmt " sub-chunk
    setUint32(0x20746d66); // "fmt "
    setUint32(16); // subchunk size
    setUint16(1); // audio format (1 = PCM)
    setUint16(buffer.numberOfChannels);
    setUint32(buffer.sampleRate);
    setUint32(buffer.sampleRate * buffer.numberOfChannels * 2); // byte rate
    setUint16(buffer.numberOfChannels * 2); // block align
    setUint16(16); // bits per sample

    // "data" sub-chunk
    setUint32(0x61746164); // "data"
    setUint32(length);

    // Write audio data
    for (let i = 0; i < buffer.numberOfChannels; i++) {
      channels.push(buffer.getChannelData(i));
    }

    while (pos < arrayBuffer.byteLength) {
      for (let i = 0; i < buffer.numberOfChannels; i++) {
        let sample = Math.max(-1, Math.min(1, channels[i][offset]));
        sample = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
        view.setInt16(pos, sample, true);
        pos += 2;
      }
      offset++;
    }

    return new Blob([arrayBuffer], { type: "audio/wav" });
  };

  // Download the generated audio
  const downloadAudio = async () => {
    const result = drawImageFnRef.current?.();
    if (!result || isConverting) return;

    const wasPlaying = isPlaying;
    const savedPosition = playbackPositionRef.current;

    // Stop any ongoing playback
    if (wasPlaying) {
      stopPlayback();
      setIsPlaying(false);
      // Wait for the animation loop to exit
      await new Promise((resolve) => setTimeout(resolve, 50));
    }

    setIsConverting(true);

    // Use setTimeout to allow UI to update before heavy processing
    await new Promise((resolve) => setTimeout(resolve, 10));

    try {
      const buffer = generateAudioBuffer(
        result.imgData,
        result.rows,
        result.cols,
      );
      const wavBlob = audioBufferToWav(buffer);
      const url = URL.createObjectURL(wavBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "sstv-audio.wav";
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setIsConverting(false);

      // Resume playback from saved position if it was playing before
      if (wasPlaying && savedPosition && playbackRef.current) {
        setIsPlaying(true);
        playbackRef.current({
          row: savedPosition.row,
          col: savedPosition.col,
          phase: savedPosition.phase,
        });
      }
    }
  };

  const stopPlayback = (savePosition = true) => {
    savePositionOnCancelRef.current = savePosition;
    cancelledRef.current = true;
    if (!savePosition) {
      playbackPositionRef.current = null;
    }
    if (gainNodeRef.current && audioContextRef.current) {
      gainNodeRef.current.gain.setValueAtTime(
        0,
        audioContextRef.current.currentTime,
      );
    }
  };

  const updateConfig = (updates: Record<string, number>) => {
    // Stop playback and reset when config changes
    stopPlayback(false);
    setIsPlaying(false);

    setConfig((prev) => {
      const newState = { ...prev, ...updates };
      configRef.current = newState;
      return newState;
    });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Stop playback and DON'T save position - we want fresh start
      stopPlayback(false);
      setIsPlaying(false);

      const objectUrl = URL.createObjectURL(file);
      setImgSrc(objectUrl);
    }
  };

  const startAnimation = async (
    imgData: Uint8ClampedArray,
    rows: number,
    cols: number,
    startPos?: { row: number; col: number; phase: string },
  ) => {
    if (isRunningRef.current) return;
    isRunningRef.current = true;
    cancelledRef.current = false;

    initAudio();

    const phases = ["red", "green", "blue"] as const;
    let startRow = startPos?.row ?? 0;
    let startCol = startPos?.col ?? 0;
    let startPhaseIndex = startPos?.phase
      ? phases.indexOf(startPos.phase as any)
      : 0;
    if (startPhaseIndex === -1) startPhaseIndex = 0;

    for (let row = startRow; row < rows; row++) {
      for (
        let phaseIdx = row === startRow ? startPhaseIndex : 0;
        phaseIdx < phases.length;
        phaseIdx++
      ) {
        const phase = phases[phaseIdx];
        const colorOffset = phaseIdx; // 0 for red, 1 for green, 2 for blue

        const colStart =
          row === startRow && phaseIdx === startPhaseIndex ? startCol : 0;

        for (let col = colStart; col < cols; col++) {
          if (cancelledRef.current) {
            if (savePositionOnCancelRef.current) {
              playbackPositionRef.current = {
                row,
                col,
                phase,
                imgData,
                rows,
                cols,
              };
            }
            isRunningRef.current = false;
            return;
          }

          const pixelIndex = (row * cols + col) * 4;
          const colorValue = imgData[pixelIndex + colorOffset];
          const freq = valueToFrequency(colorValue);

          drawImageFnRef.current?.({ row, col, phase, rows, cols });
          await playTone(freq, 20 * configRef.current.speed);
        }

        // Separator after each color scan (except after blue which gets sync)
        if (phase !== "blue") {
          await new Promise((resolve) => setTimeout(resolve, 2));
        }
      }

      // Line sync beep after blue scan - 1200 Hz for 30ms
      if (!cancelledRef.current) {
        await playTone(1200, 30);
      }
    }

    if (!cancelledRef.current) {
      drawImageFnRef.current?.({
        row: -1,
        col: -1,
        phase: "complete",
        rows,
        cols,
      });
      playbackPositionRef.current = null;
    }

    setIsPlaying(false);
    isRunningRef.current = false;
  };

  const process = () => {
    if (isPlaying) {
      stopPlayback();
      setIsPlaying(false);
    } else {
      if (playbackRef.current) {
        const savedPos = playbackPositionRef.current;
        if (savedPos) {
          playbackRef.current({
            row: savedPos.row,
            col: savedPos.col,
            phase: savedPos.phase,
          });
        } else {
          playbackRef.current();
        }
      }
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    fetchWaifuImage().then((url) => {
      if (url) setImgSrc(url);
    });
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || !imgSrc) return;

    const rect = canvas.getBoundingClientRect();

    const resizer = () => {
      const dpr = window.devicePixelRatio || 1;

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;

      ctx.scale(dpr, dpr);
    };

    resizer();

    ctx.font = "30px Helvetica";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Loading...", rect.width / 2, rect.height / 2);

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imgSrc;

    const drawImage = (activeState?: {
      row: number;
      col: number;
      phase: string;
      rows: number;
      cols: number;
    }) => {
      ctx.clearRect(0, 0, rect.width, rect.height);
      const { resolution } = configRef.current;

      const aspectRatio = img.width / img.height;
      const cols = resolution;
      const rows = Math.round(resolution / aspectRatio);

      const offCanvas = document.createElement("canvas");
      offCanvas.width = cols;
      offCanvas.height = rows;
      const offCtx = offCanvas.getContext("2d");
      if (!offCtx) return;

      offCtx.drawImage(img, 0, 0, cols, rows);

      const imgData = offCtx.getImageData(0, 0, cols, rows).data;

      const scaleX = rect.width / cols;
      const scaleY = rect.height / rows;
      const blockSize = Math.min(scaleX, scaleY);

      const totalWidth = cols * blockSize;
      const totalHeight = rows * blockSize;
      const startX = (rect.width - totalWidth) / 2;
      const startY = (rect.height - totalHeight) / 2;

      let activePixelData: any = null;

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const pixelIndex = (y * cols + x) * 4;

          let r = imgData[pixelIndex];
          let g = imgData[pixelIndex + 1];
          let b = imgData[pixelIndex + 2];
          const a = imgData[pixelIndex + 3];

          if (a < 10) continue;

          const currentX = startX + x * blockSize;
          const currentY = startY + y * blockSize;

          if (activeState && activeState.phase !== "complete") {
            if (activeState.phase === "green") {
              r = 0;
              b = 0;
            } else if (activeState.phase === "blue") {
              r = 0;
              g = 0;
            } else if (activeState.phase === "red") {
              g = 0;
              b = 0;
            }

            if (y === activeState.row && x === activeState.col) {
              activePixelData = { r, g, b, a, x: currentX, y: currentY };
              continue;
            }
          }

          ctx.fillStyle = `rgba(${r},${g},${b},${a / 255})`;
          ctx.fillRect(currentX, currentY, blockSize, blockSize);
        }
      }

      if (activePixelData) {
        const { r, g, b, a, x, y } = activePixelData;
        const scaleFactor = 2;
        const size = blockSize * scaleFactor;
        const offset = (size - blockSize) / 2;
        const ax = x - offset;
        const ay = y - offset;

        ctx.fillStyle = `rgba(${r},${g},${b},${a / 255})`;
        ctx.fillRect(ax, ay, size, size);

        ctx.strokeStyle = "#facc15";
        ctx.lineWidth = 2;
        ctx.strokeRect(ax, ay, size, size);
      }

      return { rows, cols, imgData };
    };

    img.onload = () => {
      drawImage();
    };

    drawImageFnRef.current = drawImage;

    playbackRef.current = (startPos?: {
      row: number;
      col: number;
      phase: string;
    }) => {
      // When resuming, use saved imgData; otherwise get fresh data from drawImage
      const savedPos = playbackPositionRef.current;
      if (startPos && savedPos) {
        startAnimation(
          savedPos.imgData,
          savedPos.rows,
          savedPos.cols,
          startPos,
        );
      } else {
        const result = drawImage();
        if (result) {
          startAnimation(result.imgData, result.rows, result.cols, startPos);
        }
      }
    };

    const handleResize = () => {
      resizer();
      drawImage();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelledRef.current = true;
      isRunningRef.current = false;
      playbackPositionRef.current = null;

      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
        oscillatorRef.current = null;
      }
      if (gainNodeRef.current) {
        gainNodeRef.current.disconnect();
        gainNodeRef.current = null;
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    };
  }, [imgSrc, configRef.current]);

  return (
    <div className="fixed inset-0 size-full bg-neutral-900 font-mono text-white">
      <canvas ref={canvasRef} className="block size-full" />

      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center border border-neutral-700 bg-neutral-800/80 shadow-xl backdrop-blur-md">
        <div className="flex h-full border-r border-neutral-700 bg-neutral-900">
          <button
            // onClick={() => setMode('i2a')}
            className={`select-none whitespace-nowrap p-2 text-xs font-medium outline-none transition-all ${
              mode === "i2a"
                ? "bg-yellow-700 text-white shadow-sm"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            Image {"->"} Audio
          </button>
          {/*
           <button
             onClick={() => setMode('a2i')}
             className={`text-xs p-2 font-medium select-none outline-none transition-all ${mode === 'a2i'
               ? 'bg-yellow-700 text-white shadow-sm'
               : 'text-neutral-400 hover:text-white'
               }`}
           >
             Audio {'->'} Image
           </button>
          */}
        </div>

        <div className="flex gap-3 px-3">
          {imgSrc && (
            <button
              className={cn(
                "flex select-none items-center justify-center gap-1 text-sm",
                "font-medium uppercase outline-none transition-colors",
                isPlaying ? "text-emerald-500" : "hover:text-emerald-500",
              )}
              onClick={process}
            >
              {isPlaying ? (
                <>
                  <PauseIcon className="mb-0.5" size={14} fill="currentColor" />
                  Pause
                </>
              ) : (
                <>
                  <PlayIcon className="mb-0.5" size={14} fill="currentColor" />
                  Play
                </>
              )}
            </button>
          )}

          <button
            onClick={() => fileInputRef.current?.click()}
            className="cursor-pointer select-none text-sm font-medium uppercase outline-none transition-colors hover:text-cyan-500"
          >
            Upload
          </button>

          <button
            onClick={downloadAudio}
            disabled={!imgSrc || isConverting}
            className="select-none text-sm font-medium uppercase outline-none transition-colors hover:text-teal-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isConverting ? "Converting..." : "Download"}
          </button>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={mode === "i2a" ? "image/*" : "audio/*"}
        className="hidden"
        onChange={handleFileChange}
      />

      <ControlPanel name="SSTV" collapsed={2}>
        <RangeSlider
          label="Resolution"
          value={config.resolution}
          onChange={(v) => updateConfig({ resolution: v })}
          min={16}
          step={1}
          max={512}
        />
        <RangeSlider
          label="Delay"
          value={config.speed}
          onChange={(v) => updateConfig({ speed: v })}
          min={5}
          step={1}
          max={15}
        />
      </ControlPanel>

      <button
        onClick={() => setShowExplanation(!showExplanation)}
        className="fixed bottom-3 right-3 border border-neutral-700 bg-neutral-800/80 px-3 py-2 text-xs font-medium uppercase outline-none backdrop-blur-md transition-colors hover:border-yellow-500 max-md:hidden"
      >
        {"How it's happening"}
      </button>

      <button
        onClick={() => setShowExplanation(!showExplanation)}
        className="fixed left-3 top-3 border border-neutral-700 bg-neutral-800/80 px-3 py-2 text-xs font-medium uppercase outline-none backdrop-blur-md transition-colors hover:border-yellow-500 md:hidden"
      >
        {"?"}
      </button>

      {showExplanation && (
        <div className="fixed border border-neutral-700 bg-neutral-800/95 p-4 text-sm shadow-2xl backdrop-blur-md max-md:left-3 max-md:top-16 md:bottom-16 md:right-3">
          <div className="mb-3 flex items-start justify-between">
            <h3 className="text-xs font-bold uppercase text-yellow-500">
              SSTV Process
            </h3>
            <button
              onClick={() => setShowExplanation(false)}
              className="text-neutral-400 transition-colors hover:text-white"
            >
              ✕
            </button>
          </div>
          <ul className="space-y-2 text-xs leading-relaxed text-neutral-300">
            <li>{">"} Image downsampled to selected resolution</li>
            <li>{">"} Each row scanned line-by-line in RGB order</li>
            <li>
              {">"} Color values (0-255) mapped to frequencies (1500-2300 Hz)
            </li>
            <li>{">"} Higher pixel values = higher pitch tones</li>
            <li>
              {">"} Red scan → separator (Beep) → Green scan → separator (Beep)
              → Blue scan
            </li>
            <li>{">"} 1200 Hz sync beep marks end of each row</li>
            <li>{">"} Audio tones reconstruct the image when decoded</li>
            <li>{">"} Yellow highlight shows current pixel being encoded</li>
          </ul>
        </div>
      )}
    </div>
  );
}
