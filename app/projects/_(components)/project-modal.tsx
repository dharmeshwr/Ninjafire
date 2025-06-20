"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { Github, Radio, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { useDraggableEffect } from "@/hooks/use-draggable-effect";
import { Badges } from "@/components/ui/badge";

interface ModalProps extends React.HTMLProps<HTMLDivElement> {
  close: () => void;
  media?: string;
  github?: string;
  live?: string;
  title?: string;
  badges?: string[];
  zIndex?: number;
  offset?: number;
}

const ProjectModal = ({
  close,
  media,
  title,
  github,
  live,
  children,
  zIndex,
  offset,
  badges,
  ...rest
}: ModalProps) => {
  const modalRef = useRef<HTMLDivElement | null>(null);

  useDraggableEffect(modalRef);

  return (
    <div
      ref={modalRef}
      tabIndex={-1}
      className={cn(
        `absolute rounded-xl border border-foreground/20`,
        `transition-all duration-300 ease-out`,
      )}
      style={{
        zIndex: zIndex,
        transform: `translate(${offset}px, ${offset}px)`,
      }}
      {...rest}
    >
      <div className="relative">
        <div className="noscrollbar h-[28rem] w-[50rem] flex-col overflow-scroll rounded-xl bg-background">
          {media && media?.length !== 0 && (
            <Image
              src={media}
              alt={media}
              width={800}
              height={800}
              className="rounded-t border-b border-foreground/40"
            />
          )}

          <div className="my-4 flex w-full select-none flex-col md:flex-row">
            <div className="justify-star flex w-full flex-row items-center gap-2 px-4 py-1 md:w-1/3 md:flex-col">
              {github?.length !== 0 && (
                <a
                  href={github}
                  className="inline-flex w-full justify-center gap-4 rounded border border-foreground/60 py-1 hover:bg-foreground/5"
                  target="_blank"
                >
                  <Github className="not-sr-only" />
                  Github
                </a>
              )}
              {live && live?.length !== 0 && (
                <a
                  href={live}
                  className="inline-flex w-full justify-center gap-4 rounded border border-foreground/60 py-1 hover:bg-foreground/5"
                  target="_blank"
                >
                  <Radio className="not-sr-only" />
                  Preview
                </a>
              )}
              {badges && <Badges data={badges} />}
            </div>
            <div className="w-full px-4 py-1 md:w-2/3">
              <span className="text-md font-medium md:text-xl">{title}</span>
              <p className="pt-3 leading-7">{children}</p>
            </div>
          </div>

          <button
            onClick={close}
            className="absolute right-4 top-4 rounded border border-foreground/40 bg-background"
          >
            <X />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;
