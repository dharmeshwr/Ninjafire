import "../styles/globals.css";
import "../styles/background.css";

import { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Provider } from "jotai";
import { ThemeProvider } from "next-themes";

import { metaData } from "@/config/site";
import { cn } from "@/lib/utils";
import DevToolsDetector from "@/components/ui/devtools-ascii";
import LoaderWrapper from "@/components/layout/loader";
import ScreenDetector from "@/components/shared/screen-detector";

import {
  fontGloucester,
  fontGothicExtras,
  fontMono,
  fontOldEnglish,
  fontSchwachsinn,
  fontSerif,
  fontSlab,
  fontYorktown,
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
        fontMono.variable,
        fontSerif.variable,
        fontGothicExtras.variable,
        fontSchwachsinn.variable,
        fontSlab.variable,
        fontOldEnglish.variable,
        fontYorktown.variable,
        fontGloucester.variable,
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
      <body>
        <Provider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <LoaderWrapper>
              <main>
                {children}
                <Analytics />
                <SpeedInsights />
                <DevToolsDetector />
                <ScreenDetector />
              </main>
            </LoaderWrapper>
          </ThemeProvider>
        </Provider>
      </body>
    </html>
  );
}
