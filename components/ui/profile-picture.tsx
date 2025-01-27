"use client";

import { useRef } from "react";
import Image from "next/image";

import { useMediaQuery } from "@/hooks/use-media-query";
import { useMouseHoverEffect } from "@/hooks/use-mousehover-effect";

export function ProfilePicture({
  imageSrc,
  circles,
}: {
  imageSrc: string;
  circles: string[];
}) {
  const ref = useRef(null);
  const { isMobile } = useMediaQuery();

  useMouseHoverEffect(ref, isMobile);

  return (
    <div draggable="false" className="block">
      <div
        draggable="false"
        className="mx-auto mb-10 mt-0 sm:float-right sm:mb-5 sm:ml-5 lg:my-5"
      >
        <div
          draggable="false"
          ref={ref}
          className="relative flex items-center justify-center p-16"
        >
          {circles.map((color, index) => (
            <div
              key={index}
              className={`profile-pic-circle`}
              style={{ backgroundColor: color }}
            ></div>
          ))}
          <div className="profile-pic-circle">
            <Image
              src={imageSrc}
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
