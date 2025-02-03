import Link from "next/link";

import { Name } from "../ui/name";
import { ThemeSwitcher } from "./theme-switcher";

const navItems = {
  "/blogs": { name: "Blogs" },
  "/projects": { name: "Projects" },
};

export function Navbar() {
  return (
    <nav className="sticky top-0 z-30 mb-4 bg-background py-5 lg:mb-12">
      <div className="flex flex-col justify-between md:flex-row md:items-center">
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
