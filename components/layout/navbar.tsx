"use client";

import Link from "next/link";

import { cn } from "@/lib/utils";

import { Name } from "../ui/name";
import { ThemeSwitcher } from "./theme-switcher";

const navItems = {
  "/arts": { name: "Arts" },
  "/blogs": { name: "Blogs" },
  "/projects": { name: "Projects" },
};

export function Navbar() {
  return (
    <nav
      className={cn(
        `sticky top-0 z-50 mb-4 flex w-full justify-center bg-background py-3 pt-6 sm:py-5 md:pt-3 lg:mb-12`,
        "md:z-50",
      )}
    >
      <div className="flex w-full max-w-screen-sm flex-col justify-between md:flex-row md:items-center">
        <Link href="/">
          <div className="relative">
            <Name />
          </div>
        </Link>
        <div className="mt-6 flex flex-row items-center gap-4 md:ml-auto md:mt-0">
          {Object.entries(navItems).map(([path, { name }]) => (
            <Link
              key={path}
              href={path}
              className="relative flex align-middle transition-all"
            >
              {name}
            </Link>
          ))}
          <ThemeSwitcher />
        </div>
      </div>
    </nav>
  );
}
