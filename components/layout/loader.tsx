"use client";

import "@/styles/loader.css";

import { useEffect, useState } from "react";
import Balancer from "react-wrap-balancer";

export default function LoaderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleLoad = () => setTimeout(() => setLoading(false), 500);

    if (document.readyState === "complete") handleLoad();
    else {
      window.addEventListener("load", handleLoad);
      return () => window.removeEventListener("load", handleLoad);
    }
  }, []);

  if (process.env.NODE_ENV === "development") {
    return <>{children}</>;
  }

  return (
    <>
      {loading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#d6c299] text-black transition-opacity duration-700">
          <div className="loader">
            <div className="cup">
              <div className="cup-handle"></div>
              <div className="smoke one"></div>
              <div className="smoke two"></div>
              <div className="smoke three"></div>
            </div>
            <div className="load">..........................</div>
          </div>

          <div className="text-center font-serif text-3xl">
            <Balancer> Hang about a moment, would you? </Balancer>
          </div>
        </div>
      )}

      <div
        className={`transition-opacity duration-700 ${
          loading ? "opacity-0" : "opacity-100"
        }`}
      >
        {children}
      </div>
    </>
  );
}
