"use client";

import { useRef } from "react";
import Image from "next/image";

import { getGIFfromLocal } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useMouseHoverEffect } from "@/hooks/use-mousehover-effect";

interface ProfileictureProps {
  imageSrc: string;
  circles: string[];
}

export function ProfilePicture({ imageSrc, circles }: ProfileictureProps) {
  const ref = useRef(null);
  const { isMobile } = useMediaQuery();

  useMouseHoverEffect(ref, isMobile);

  const gif = useRef(getGIFfromLocal()).current;

  return (
    <div draggable="false" className="block cursor-pointer">
      <div className="mx-auto mb-10 mt-0 sm:float-right sm:mb-5 sm:ml-5 lg:my-5">
        <div
          ref={ref}
          className="relative flex items-center justify-center rounded-full p-[4.7rem]"
        >
          {circles.map((color, index) => (
            <div
              key={index}
              className="profile-pic-circle"
              style={{ backgroundColor: color }}
            ></div>
          ))}
          <div className="profile-pic-circle overflow-hidden">
            <Image
              src={gif}
              alt="PFP"
              style={{ objectFit: "cover" }}
              unoptimized
              priority
              fill
            />
          </div>
        </div>
      </div>
    </div>
  );
}
