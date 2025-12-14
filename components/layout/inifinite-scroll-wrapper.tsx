"use client";

import { useEffect, useRef, useState } from "react";

export default function InfinteScrollWrapper({ children }) {
  const loaderRef = useRef(null);
  const [items, setItems] = useState([1]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const target = entries[0];
      if (target.isIntersecting) {
        setItems((prev) => [...prev, prev.length + 1]);
      }
    });
    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }
    return () => {
      if (loaderRef.current) observer.disconnect();
    };
  }, []);

  return (
    <div>
      {items.map((id) => (
        <div key={id}>{children}</div>
      ))}
      <div ref={loaderRef} className="absolute bottom-0 h-10 bg-red-900" />
    </div>
  );
}
