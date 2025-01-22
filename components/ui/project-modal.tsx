"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { Github, Radio, X } from "lucide-react";

import { cn } from "@/lib/utils";

interface ModalProps extends React.HTMLProps<HTMLDivElement> {
  isOpen: boolean;
  close: () => void;
  media: string;
  github?: string;
  live?: string;
  title?: string;
  body?: string;
}

const ProjectModal = ({
  isOpen,
  close,
  media,
  title,
  github,
  live,
  body,
  className,
  ...rest
}: ModalProps) => {
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

    document.addEventListener("click", handleClose);
    document.addEventListener("keydown", handleClose);

    return () => {
      document.removeEventListener("click", handleClose);
      document.removeEventListener("keydown", handleClose);
    };
  }, [close, isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-foreground/50 outline-none backdrop-blur-sm focus:outline-none",
        className,
      )}
      {...rest}
    >
      <div
        ref={modalRef}
        className="relative rounded border border-foreground/50"
      >
        <div className="noscrollbar flex max-h-[45rem] min-w-80 max-w-[50rem] flex-col overflow-scroll rounded bg-background">
          <Image
            src={media}
            alt="*"
            width={800}
            height={800}
            className="rounded-t"
          />

          <div className="my-4 flex w-full flex-col md:flex-row">
            <div className="justify-star flex w-full flex-row items-center gap-2 px-4 py-1 md:w-1/3 md:flex-col">
              <a
                href={github}
                className="inline-flex w-full justify-center gap-4 rounded border border-foreground/60 py-1 hover:bg-foreground/5"
              >
                <Github />
                <button>Github</button>
              </a>
              {live?.length !== 0 && (
                <a
                  href={live}
                  className="inline-flex w-full justify-center gap-4 rounded border border-foreground/60 py-1 hover:bg-foreground/5"
                >
                  <Radio />
                  <button>Preview</button>
                </a>
              )}
            </div>
            <div className="w-full px-4 py-1 md:w-2/3">
              <span className="text-md font-medium md:text-xl">{title}</span>
              <p className="pt-3">{body}</p>
            </div>
          </div>

          <button
            onClick={close}
            className="absolute right-4 top-4 rounded bg-background"
          >
            <X />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;
