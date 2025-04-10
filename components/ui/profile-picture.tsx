"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { getGIF } from "@/actions/gif-action";

import { useMediaQuery } from "@/hooks/use-media-query";
import { useMouseHoverEffect } from "@/hooks/use-mousehover-effect";

interface ProfileictureProps {
  imageSrc: string;
  circles: string[];
}

export function ProfilePicture({ imageSrc, circles }: ProfileictureProps) {
  const ref = useRef(null);
  const { isMobile } = useMediaQuery();
  const { isHovering } = useMouseHoverEffect(ref, isMobile);

  const [gif, setGif] = useState("/loading.gif");

  useEffect(() => {
    getGIF()
      .then((data) => {
        setGif(data.gif);
      })
      .catch((error) => console.error(error));
  }, []);

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
              src={isHovering ? imageSrc : gif}
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
