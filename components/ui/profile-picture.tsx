"use client";

import { useLayoutEffect, useRef, useState } from "react";
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
  const string = "||||||||||||||||||||||||||||||||||||||||||";

  useMouseHoverEffect(ref, isMobile);

  useLayoutEffect(() => {
    setImage(getGIFfromLocal());
  }, []);

  return (
    <div draggable="false" className="relative block cursor-pointer">
      <div className="mx-auto mb-10 mt-0 sm:float-right sm:mb-5 sm:ml-5 lg:my-5">
        <div
          ref={ref}
          className="group relative flex items-center justify-center rounded-full p-[4.7rem]"
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
          <div className="rotater pointer-events-none absolute -z-50 origin-center p-[4.7rem] opacity-10 transition-opacity ease-in-out group-hover:opacity-15">
            <div className="absolute top-[-1.9rem] origin-center">
              {string.split("").map((letter, i) => (
                <span
                  key={i}
                  className={`absolute origin-[0px_105px] font-broader text-xl font-bold`}
                  style={{
                    transform: `rotate(${i * Number((360 / string.length).toFixed(2))}deg)`,
                  }}
                >
                  {letter}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
