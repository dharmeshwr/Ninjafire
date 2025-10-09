import { JetBrains_Mono as FontMono } from "next/font/google";
import localFont from "next/font/local";

export const fontSerif = localFont({
  src: [
    {
      path: "../public/fonts/baskerville.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/baskerville-italic.ttf",
      weight: "400",
      style: "italic",
    },
  ],
  variable: "--font-serif",
});

export const fontMono = FontMono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: "500",
});

export const fontSlab = localFont({
  src: [
    {
      path: "../public/fonts/slab.ttf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-slab",
});

export const fontGloucester = localFont({
  src: [
    {
      path: "../public/fonts/Gloucester-Font.ttf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-gloucester",
});

export const fontOldEnglish = localFont({
  src: [
    {
      path: "../public/fonts/piston.ttf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-old-english",
});

export const fontSchwachsinn = localFont({
  src: [
    {
      path: "../public/fonts/Schwachsinn3D.ttf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-schwachsinn",
});

export const fontYorktown = localFont({
  src: [
    {
      path: "../public/fonts/Yorktown.ttf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-yorktown",
});

export const fontGothicExtras = localFont({
  src: [
    {
      path: "../public/fonts/GothicExtras_A.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/GothicExtras_B.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/GothicExtras_C.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonts/GothicExtras_D.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/GothicExtras_E.otf",
      weight: "800",
      style: "normal",
    },
  ],
  variable: "--font-gothic-extras",
});
