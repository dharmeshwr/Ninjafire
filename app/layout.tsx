import "../styles/globals.css";

import { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ThemeProvider } from "next-themes";

import { metaData } from "@/config/site";
import { cn } from "@/lib/utils";
import { GetRating } from "@/components/ui/get-rating";
import { ShowRating } from "@/components/ui/show-rating";
import Footer from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";

import { fontMono, fontSans } from "./fonts";

export const metadata: Metadata = {
  metadataBase: new URL(metaData.baseUrl),
  title: {
    default: metaData.title,
    template: `%s | Dharmesh`,
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
    title: "@Dharmesh177208",
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
      className={cn(fontSans.variable, fontMono.variable)}
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
      <body className="relative mx-auto mb-10 flex flex-col items-center justify-center bg-background text-foreground antialiased md:py-10 lg:mb-0">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="flex w-full min-w-0 max-w-screen-sm flex-1 flex-col px-6 sm:px-4 md:px-0 lg:pt-12">
            <Navbar />
            {children}
            <Footer />
            <Analytics />
            <SpeedInsights />
          </main>
          <GetRating />
          <ShowRating />
        </ThemeProvider>
      </body>
    </html>
  );
}
