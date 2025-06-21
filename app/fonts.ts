import {
  Protest_Guerrilla as FontBroader,
  Corinthia as FontCursive,
  Gamja_Flower as FontInformal,
  JetBrains_Mono as FontMono,
  Onest as FontSans,
  Instrument_Serif as FontSerif,
} from "next/font/google";

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const fontSerif = FontSerif({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: "400",
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

export const fontBroader = FontBroader({
  subsets: ["latin"],
  variable: "--font-broader",
  weight: "400",
});
