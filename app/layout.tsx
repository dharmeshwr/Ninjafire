import "../styles/globals.css";

import { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Provider } from "jotai";
import { ThemeProvider } from "next-themes";

import { metaData } from "@/config/site";
import { cn } from "@/lib/utils";
import { GetRating } from "@/components/ui/get-rating";
import { ShowRating } from "@/components/ui/show-rating";
import { Navbar } from "@/components/layout/navbar";

import {
  fontBroader,
  fontCursive,
  fontInformal,
  fontMono,
  fontSans,
  fontSerif,
} from "./fonts";

export const metadata: Metadata = {
  metadataBase: new URL(metaData.baseUrl),
  title: {
    default: metaData.title,
    template: `%s | Ninjafire`,
  },
  description: metaData.description,
  openGraph: {
    images: "/og?title=Dharmesh&font=train",
    title: metaData.title,
    description: metaData.description,
    url: metaData.baseUrl,
    siteName: metaData.name,
    locale: "en_US",
    type: "website",
  },
  keywords: ["Nextjs", "Portfolio"],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  twitter: {
    title: "@Dharmeshwr",
    card: "summary_large_image",
  },
  icons: {
    icon: "/favicon.ico",
  },
  manifest: `${metaData.baseUrl}/site.webmanifest`,
};

export default function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        fontSans.variable,
        fontMono.variable,
        fontSerif.variable,
        fontInformal.variable,
        fontCursive.variable,
        fontBroader.variable,
      )}
    >
      <head>
        <link
          rel="alternate"
          type="application/rss+xml"
          href="/rss.xml"
          title="RSS Feed"
        />
        <link
          rel="alternate"
          type="application/atom+xml"
          href="/atom.xml"
          title="Atom Feed"
        />
        <link
          rel="alternate"
          type="application/feed+json"
          href="/feed.json"
          title="JSON Feed"
        />
      </head>
      <body className="relative mx-auto mb-1 flex flex-col items-center justify-center overflow-x-hidden bg-background text-foreground antialiased md:py-10 lg:mb-0">
        <Provider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Navbar />
            <main className="flex w-full min-w-0 max-w-screen-sm flex-1 flex-col px-6 sm:px-4 md:px-0">
              {children}
              <Analytics />
              <SpeedInsights />
            </main>
            {process.env.NODE_ENV === "production" && <GetRating />}
            <ShowRating />
          </ThemeProvider>
        </Provider>
      </body>
    </html>
  );
}
