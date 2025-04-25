"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function Layout({ children }: React.PropsWithChildren) {
  return (
    <div className="relative">
      <div className="sticky top-0 z-10">
        <div className="absolute left-[-90px] top-0">
          <Link href={"/blogs"}>
            <button className="hidden items-center py-3 underline-offset-2 hover:underline md:inline-flex">
              <ChevronLeft size={20} />
              <span>Back</span>
            </button>
          </Link>
        </div>
      </div>
      <div>{children}</div>
    </div>
  );
}
