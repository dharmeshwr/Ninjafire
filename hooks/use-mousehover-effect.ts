import { useCallback, useEffect } from "react";

export const useMouseHoverEffect = (
  ref: React.RefObject<HTMLDivElement | null>,
  isDisabled: boolean,
) => {
  const handleMouseMove = useCallback((event: MouseEvent) => {
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    const target = event.target as HTMLElement;
    const innerDivs = target.querySelectorAll("div");

    if (!innerDivs) return;

    innerDivs.forEach((div, index) => {
      const { left, right, bottom, top } = div.getBoundingClientRect();
      const offsetLeft = mouseX - left;
      const offsetRight = mouseX - right;
      const offsetBottom = mouseY - bottom;
      const offsetTop = mouseY - top;

      const offsetX = Math.max(Math.abs(offsetRight), Math.abs(offsetLeft));
      const offsetY = Math.max(Math.abs(offsetTop), Math.abs(offsetBottom));

      div.style.transform = `translate(${(offsetX * 15 * (index + 1)) / div.offsetWidth}px, ${(offsetY * 15 * (index + 1)) / div.offsetHeight}px)`;
    });
  }, []);

  const handleMouseLeave = useCallback((event: MouseEvent) => {
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
};
