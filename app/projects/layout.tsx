import { Suspense } from "react";

import { metaData } from "@/config/site";

export const metadata = {
  title: "Projects | Ninjafire",
  description: "Some of my projects I made",
  metadataBase: new URL(metaData.baseUrl),
  openGraph: {
    images: "/og?title=Projects",
  },
};

export default function Layout({ children }: React.PropsWithChildren) {
  return <Suspense>{children}</Suspense>;
}
