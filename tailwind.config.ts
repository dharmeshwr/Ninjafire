import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ["var(--font-serif)", ...fontFamily.serif],
        mono: ["var(--font-mono)", ...fontFamily.mono],
        slab: ["var(--font-slab)", "serif"],
        oldEnglish: ["var(--font-old-english)", "cursive"],
        schwachsinn: ["var(--font-schwachsinn)", "cursive"],
        yorktown: ["var(--font-yorktown)", "sans-serif"],
        gloucester: ["var(--font-gloucester)", "sans-serif"],
        gothic: ["var(--font-gothic-extras)", "sans-serif"],
      },
      typography: {
        quoteless: {
          css: {
            "blockquote p:first-of-type::before": { content: "none" },
            "blockquote p:first-of-type::after": { content: "none" },
          },
        },
      },
      colors: {
        background: "hsl(var(--background), <alpha-value>)",
        backgroundAlt: "hsl(var(--background-alt), <alpha-value>)",
        foreground: "hsl(var(--foreground), <alpha-value>)",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
