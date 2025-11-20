"use client";

import { useEffect } from "react";

export default function ScreenDetector() {
  useEffect(() => {
    if (sessionStorage.getItem("screenTracked")) return;

    const width = window.innerWidth;
    let bucket: string;
    if (width < 800) bucket = "small";
    else if (width < 1550) bucket = "laptop";
    else bucket = "desktop";

    const payload = JSON.stringify({ bucket });

    navigator.sendBeacon("/api/track-screen", payload);

    sessionStorage.setItem("screenTracked", "true");
  }, []);

  return null;
}
