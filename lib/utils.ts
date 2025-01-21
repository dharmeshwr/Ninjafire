import clsx, { type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...classes: ClassValue[]) => {
  return twMerge(clsx(classes));
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
