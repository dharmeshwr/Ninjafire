import {
  Corinthia as FontCursive,
  Gamja_Flower as FontInformal,
  JetBrains_Mono as FontMono,
  Inter as FontSans,
} from "next/font/google";

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const fontMono = FontMono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: "500",
});

export const fontInformal = FontInformal({
  subsets: ["latin"],
  variable: "--font-informal",
  weight: "400",
});

export const fontCursive = FontCursive({
  subsets: ["latin"],
  variable: "--font-cursive",
  weight: "400",
});
