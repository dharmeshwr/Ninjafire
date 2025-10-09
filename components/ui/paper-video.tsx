"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

export function VideoPaper({ href, src }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  let isTouchDevice: number | boolean = 0;

  useEffect(() => {
    isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints;
  }, []);

  return (
    <div className="mix-blend-multiply grayscale sepia">
      <Link href={href}>
        <video
          ref={videoRef}
          src={src}
          muted={true}
          loop
          playsInline
          onMouseEnter={() => !isTouchDevice && videoRef.current?.play()}
          onMouseLeave={() => !isTouchDevice && videoRef.current?.pause()}
        />
      </Link>
    </div>
  );
}
