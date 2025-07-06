"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { ageAtom } from "@/store";
import { useAtomValue } from "jotai";

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
  const string = "|".repeat(60);
  const age = useAtomValue(ageAtom);
  const [degree, setDegree] = useState(0);

  useMouseHoverEffect(ref, isMobile);

  useEffect(() => {
    setDegree(age.seconds * Number((360 / string.length).toFixed(2)));
  }, [age]);

  useLayoutEffect(() => {
    setImage(getGIFfromLocal());
  }, []);

  return (
    <div
      draggable="false"
      className="relative block cursor-pointer select-none"
    >
      <div className="mx-auto mb-10 mt-7 sm:float-right sm:mb-5 sm:ml-5 lg:my-5">
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
          <div className="rotater pointer-events-none absolute -z-50 origin-center p-[4.7rem] transition-all ease-in-out">
            <div className="absolute top-[-1.9rem] origin-center">
              {string.split("").map((letter, i) => (
                <span
                  key={i}
                  className={cn(
                    `absolute origin-[0px_105px] font-broader text-xl font-bold opacity-10`,
                    i == 0 && "opacity-20",
                  )}
                  style={{
                    transform: `rotate(${i * Number((360 / string.length).toFixed(2))}deg)`,
                  }}
                >
                  {letter}
                </span>
              ))}
              <span
                className={`absolute origin-[0px_105px] font-broader text-xl text-red-800 opacity-100 dark:text-red-600`}
                style={{
                  transform: `rotate(${degree}deg)`,
                }}
              >
                {string[0]}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
