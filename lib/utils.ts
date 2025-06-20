import fs from "fs";
import path from "path";
import clsx, { type ClassValue } from "clsx";
import { intervalToDuration } from "date-fns";
import { twMerge } from "tailwind-merge";

import { metaData } from "@/config/site";

export const cn = (...classes: ClassValue[]) => {
  return twMerge(clsx(classes));
};

export const getAllBlogsMetadata = async () => {
  const CONTENT_PATH = path.join(process.cwd(), "app/blogs/(content)");
  const content = fs.readdirSync(CONTENT_PATH);

  const dirs = content.filter((item) => {
    const blogPath = path.join(CONTENT_PATH, item);
    return fs.statSync(blogPath).isDirectory();
  });

  return Promise.all(
    dirs.map(async (blogDir) => {
      const { data } = await import(
        `@/app/blogs/(content)/${blogDir}/page.mdx`
      );
      return { ...data, href: `/blogs/${blogDir}` };
    }),
  );
};

export const createQueryString = (
  name: string,
  value: string,
  existingSearchParams: any,
) => {
  const params = new URLSearchParams(existingSearchParams.toString());
  params.set(name, value);
  return params.toString();
};

export const getBaseURL = () => {
  return metaData.baseUrl.endsWith("/")
    ? metaData.baseUrl
    : `${metaData.baseUrl}/`;
};

export const capatilize = (string: string) => {
  return string[0].toUpperCase() + string.slice(1);
};

export const formatDate = (input: string | number): string => {
  const date = new Date(input);
  return date.toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

export const getFocusableElements = (ref: any) => {
  return ref.current?.querySelectorAll("button, [href]");
};

export const getMyAge = () => {
  const today = new Date();
  const dob = new Date("10-31-2003");
  const duration = intervalToDuration({
    start: dob,
    end: today,
  });

  const units = ["years", "months", "days", "hours", "minutes", "seconds"];

  const formatted = units
    .filter((unit) => {
      if (unit === "seconds") {
        return process.env.NODE_ENV === "production";
      }
      return true;
    })
    .map((unit) => `${duration[unit] ?? 0} ${unit}`)
    .join(" ");

  return formatted;
};

type SomeFunction = (...args: unknown[]) => void;

export const throttle = <Func extends SomeFunction>(
  fn: Func,
  delay: number,
) => {
  let inThrottle = false;

  return (...args: unknown[]) => {
    if (inThrottle == false) {
      fn.call(this, ...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), delay);
    }
  };
};

export const debounce = <Func extends SomeFunction>(
  fn: Func,
  delay: number,
) => {
  let timeoutId: NodeJS.Timeout;

  return (...args: unknown[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      fn.call(this, ...args);
    }, delay);
  };
};

export const getGIFfromLocal = (): string => {
  const random = Math.floor(Math.random() * 84);
  return `/gifs/${random}.gif`;
};
