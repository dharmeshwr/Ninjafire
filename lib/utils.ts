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
      const { metadata } = await import(
        `@/app/blogs/(content)/${blogDir}/page.mdx`
      );
      return { ...metadata, href: `/blogs/${blogDir}` };
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
  let age = "";
  Object.entries(duration).forEach(([key, value]) => {
    age += `${value} ${key} `;
  });
  return age;
};
