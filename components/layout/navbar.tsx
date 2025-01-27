import Link from "next/link";

import { metaData } from "@/config/site";

import { ThemeSwitcher } from "./theme-switcher";

const navItems = {
  "/blogs": { name: "Blogs" },
  "/projects": { name: "Projects" },
};

export function Navbar() {
  return (
    <nav className="sticky top-0 z-10 mb-4 bg-background py-5 lg:mb-12">
      <div className="flex flex-col justify-between md:flex-row md:items-center">
        <div className="flex items-center">
          <Link href="/" className="text-3xl font-semibold tracking-tight">
            {metaData.name}
          </Link>
        </div>
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
