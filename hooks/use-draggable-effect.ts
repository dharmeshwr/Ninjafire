import { RefObject, useEffect } from "react";
import { globalZIndexAtom } from "@/store";
import { useSetAtom } from "jotai";

export const useDraggableEffect = (ref: RefObject<HTMLElement | null>) => {
  const setGlobalZIndex = useSetAtom(globalZIndexAtom);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    let isDragging = false;
    let currentX = element.offsetLeft;
    let currentY = element.offsetTop;
    let initialX = 0;
    let initialY = 0;

    function startDragging(e: MouseEvent) {
      if (!element) return;
      initialX = e.clientX - currentX;
      initialY = e.clientY - currentY;

      setGlobalZIndex((prev) => {
        element.style.zIndex = `${prev + 1}`;
        return prev + 1;
      });

      isDragging = true;
    }

    function drag(e: MouseEvent) {
      if (!element) return;
      if (isDragging) {
        e.preventDefault();
        currentX = e.clientX - initialX;
        currentY = e.clientY - initialY;
        element.style.left = `${currentX}px`;
        element.style.top = `${currentY}px`;
      }
    }

    function stopDragging() {
      isDragging = false;
    }

    element.addEventListener("mousedown", startDragging);
    window.addEventListener("mousemove", drag);
    window.addEventListener("mouseup", stopDragging);

    return () => {
      element.removeEventListener("mousedown", startDragging);
      window.removeEventListener("mousemove", drag);
      window.removeEventListener("mouseup", stopDragging);
    };
  }, [ref]);
};
