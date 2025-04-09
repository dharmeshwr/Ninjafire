import { useCallback, useEffect, useState } from "react";

export const useMouseHoverEffect = (
  ref: React.RefObject<HTMLDivElement | null>,
  isDisabled: boolean,
) => {
  const [isHovering, setHovering] = useState(false);

  const handleMouseMove = useCallback((event: MouseEvent) => {
    setHovering(true);

    const mouseX = event.clientX;
    const mouseY = event.clientY;

    const target = event.target as HTMLElement;
    const { left, right, bottom, top } = target?.getBoundingClientRect();
    const originX = left + (right - left) / 2,
      originY = top + (bottom - top) / 2;
    const innerDivs = target.querySelectorAll("div");

    if (!innerDivs) return;

    innerDivs.forEach((div, index) => {
      const offsetX = originX - mouseX;
      const offsetY = originY - mouseY;

      const multiplier = 45;

      div.style.transform = `translate(${(offsetX * multiplier * (index + 1)) / div.offsetWidth}px, ${(offsetY * multiplier * (index + 1)) / div.offsetHeight}px)`;
    });
  }, []);

  const handleMouseLeave = useCallback((event: MouseEvent) => {
    setHovering(false);
    const container = event.target as HTMLElement;
    container.querySelectorAll("div").forEach((div) => {
      div.style.transform = `translate(0,0)`;
    });
  }, []);

  useEffect(() => {
    if (isDisabled) return;

    const container = ref.current;
    if (!container) return;

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [ref, isDisabled]);

  return { isHovering };
};
