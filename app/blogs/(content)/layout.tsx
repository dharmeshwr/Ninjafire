"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function Layout({ children }: React.PropsWithChildren) {
  return (
    <div className="relative">
      <div className="sticky top-5 z-10">
        <div className="absolute left-[-90] top-0">
          <Link href={"/blogs"}>
            <button className="hidden items-center underline-offset-2 hover:underline md:inline-flex">
              <ChevronLeft size={20} />
              <span>Back</span>
            </button>
          </Link>
        </div>
      </div>
      {children}
    </div>
  );
}
