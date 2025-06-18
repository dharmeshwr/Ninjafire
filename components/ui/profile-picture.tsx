"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

import { cn, getGIFfromLocal } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useMouseHoverEffect } from "@/hooks/use-mousehover-effect";

interface ProfileictureProps {
  circles: string[];
}

export function ProfilePicture({ circles }: ProfileictureProps) {
  const ref = useRef(null);
  const [image, setImage] = useState("");
  const { isMobile } = useMediaQuery();

  useMouseHoverEffect(ref, isMobile);

  useEffect(() => {
    setImage(getGIFfromLocal());
  }, []);

  return (
    <div draggable="false" className="relative block cursor-pointer">
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
          <div
            className={cn(
              "profile-pic-circle overflow-hidden",
              image.length === 0 && "animate-pulse bg-black/30 duration-500",
            )}
          >
            {image.length > 0 && (
              <Image
                suppressHydrationWarning
                src={image}
                alt="PFP"
                style={{ objectFit: "cover" }}
                unoptimized
                priority
                fill
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
