"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { Github, Radio, X } from "lucide-react";

import { cn, getFocusableElements } from "@/lib/utils";
import { useDraggableEffect } from "@/hooks/use-draggable-effect";
import { Badges } from "@/components/ui/badge";

interface DesktopModalProps extends React.HTMLProps<HTMLDivElement> {
  close: () => void;
  media?: string;
  github?: string;
  live?: string;
  title?: string;
  badges?: string[];
  zIndex?: number;
  offset?: number;
}

export const ProjectModalDesktop = ({
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
}: DesktopModalProps) => {
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
        <div className="noscrollbar relative h-[28rem] w-[50rem] flex-col overflow-scroll rounded-xl bg-background">
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
          <span className="absolute bottom-0 inline-flex w-full select-none justify-center pb-1 text-xs text-foreground/40">
            Drag me
          </span>
        </div>
      </div>
    </div>
  );
};

interface MobileModalProps extends React.HTMLProps<HTMLDivElement> {
  isOpen: boolean;
  close: () => void;
  media?: string;
  github?: string;
  live?: string;
  title?: string;
}

export const ProjectModalMobile = ({
  isOpen,
  close,
  media,
  title,
  github,
  live,
  className,
  children,
  ...rest
}: MobileModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClose = (event: MouseEvent | KeyboardEvent) => {
      if (
        (event instanceof MouseEvent &&
          modalRef.current &&
          !modalRef.current.contains(event.target as Node)) ||
        (event instanceof KeyboardEvent && event.key === "Escape")
      ) {
        close();
      }
    };

    const handleTabs = (event: KeyboardEvent) => {
      const focusableElement = getFocusableElements(modalRef);

      if (!focusableElement) return;

      const firstElement = focusableElement[0] as HTMLElement;
      const lastElement = focusableElement[
        focusableElement?.length - 1
      ] as HTMLElement;

      if (event.key === "Tab") {
        if (event.shiftKey && document.activeElement == firstElement) {
          event.preventDefault();
          lastElement.focus();
        } else if (!event.shiftKey && document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    };

    if (isOpen) {
      modalRef.current?.focus();
      document.addEventListener("click", handleClose);
      document.addEventListener("keydown", handleClose);
      document.addEventListener("keydown", handleTabs);

      return () => {
        document.removeEventListener("click", handleClose);
        document.removeEventListener("keydown", handleClose);
        document.removeEventListener("keydown", handleTabs);
      };
    }
  }, [close, isOpen]);

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-neutral-900/70 outline-none backdrop-blur-sm focus:outline-none",
        isOpen ? "opacity-100" : "pointer-events-none opacity-0",
        className,
      )}
      {...rest}
    >
      <div
        ref={modalRef}
        tabIndex={-1}
        className={cn(
          `relative rounded-xl border border-foreground/20`,
          "transition-all duration-300 ease-out",
          isOpen ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0",
        )}
      >
        <div className="noscrollbar flex max-h-[45rem] min-w-[17rem] max-w-[50rem] flex-col overflow-scroll rounded-xl bg-background">
          {media && media?.length !== 0 && (
            <Image
              src={media}
              alt={media}
              width={800}
              height={800}
              className="rounded-t border-b border-foreground/40"
            />
          )}

          <div className="my-4 flex w-full flex-col md:flex-row">
            <span className="text-md px-4 py-1 font-medium md:text-xl">
              {title}
            </span>
            <div className="justify-star flex w-full flex-col items-center gap-2 px-4 py-1 md:w-1/3">
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
              {live?.length !== 0 && (
                <a
                  href={live}
                  className="inline-flex w-full justify-center gap-4 rounded border border-foreground/60 py-1 hover:bg-foreground/5"
                  target="_blank"
                >
                  <Radio className="not-sr-only" />
                  Preview
                </a>
              )}
            </div>
            <div className="w-full px-4 py-1 md:w-2/3">
              <p className="pt-3">{children}</p>
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
