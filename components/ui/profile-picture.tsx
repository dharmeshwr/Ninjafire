"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

import { useMediaQuery } from "@/hooks/use-media-query";

const handleMouseMove = (event: MouseEvent) => {
  const mouseX = event.clientX;
  const mouseY = event.clientY;

  const target = event.target as HTMLElement;
  const innerDivs = target.querySelectorAll("div");

  if (!innerDivs) return;

  innerDivs.forEach((div: HTMLDivElement, index) => {
    const { left, right, bottom, top } = div.getBoundingClientRect();
    const offsetLeft = mouseX - left;
    const offsetRight = mouseX - right;
    const offsetBottom = mouseY - bottom;
    const offsetTop = mouseY - top;

    const offsetX = Math.max(Math.abs(offsetRight), Math.abs(offsetLeft));
    const offsetY = Math.max(Math.abs(offsetTop), Math.abs(offsetBottom));

    div.style.transform = `translate(${(offsetX * 15 * (index + 1)) / div.offsetWidth}px, ${(offsetY * 15 * (index + 1)) / div.offsetHeight}px)`;
  });
};

const handleMouseLeave = (event: MouseEvent) => {
  const container = event.target as HTMLElement;
  container.querySelectorAll("div").forEach((div) => {
    div.style.transform = `translate(0,0)`;
  });
};

export function ProfilePicture() {
  const ref = useRef<HTMLDivElement>(null);
  const { isMobile } = useMediaQuery();

  useEffect(() => {
    if (isMobile) return;

    const outerContainer: HTMLDivElement | null = ref.current;
    if (!outerContainer) return;

    outerContainer.addEventListener("mousemove", handleMouseMove);
    outerContainer.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      outerContainer.removeEventListener("mousemove", handleMouseMove);
      outerContainer.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isMobile]);

  return (
    <div draggable="false" className="block">
      <div
        draggable="false"
        className="mx-auto mb-10 mt-0 sm:float-right sm:mb-5 sm:ml-5 lg:mb-5 lg:mt-5"
      >
        <div
          draggable="false"
          ref={ref}
          className="relative flex items-center justify-center p-16"
        >
          <div className="profile-pic-circle bg-[#f5bb00]"></div>
          <div className="profile-pic-circle bg-[#ec9f05]"></div>
          <div className="profile-pic-circle bg-[#d76a03]"></div>
          <div className="profile-pic-circle bg-[#bf3100]"></div>
          <div className="profile-pic-circle">
            <Image
              src="/profile.png"
              alt="Profile photo"
              className="rounded-full"
              unoptimized
              width={160}
              height={160}
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}
