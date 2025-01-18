"use client";

import { useCallback, useEffect } from "react";
import { MoonStar, SunMedium } from "lucide-react";
import { useTheme } from "next-themes";

import { cn } from "@/lib/utils";

import { ClientOnly } from "../shared/client-only";

enum Theme {
  LIGHT = "light",
  DARK = "dark",
}

const STORAGE_KEY = "theme";

const useSystemThemePreference = () => {
  const isClient = typeof window !== "undefined";

  const getSystemThemePreferences = (): Theme => {
    if (!isClient) return Theme.LIGHT;

    const storedPreference = localStorage.getItem(STORAGE_KEY);
    if (storedPreference) {
      return storedPreference as Theme;
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? Theme.DARK
      : Theme.LIGHT;
  };

  const setSystemThemePreference = (theme: Theme) => {
    if (isClient) {
      localStorage.setItem(STORAGE_KEY, theme);
    }
  };

  return { getSystemThemePreferences, setSystemThemePreference };
};

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const { getSystemThemePreferences, setSystemThemePreference } =
    useSystemThemePreference();

  const updateTheme = useCallback(
    (theme: Theme) => {
      setTheme(theme);
      setSystemThemePreference(theme);
    },
    [setTheme, setSystemThemePreference],
  );

  const toggleTheme = () => {
    const newTheme = theme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT;
    updateTheme(newTheme);
  };

  useEffect(() => {
    updateTheme(getSystemThemePreferences());

    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      )
        return;

      if (event.key === "M" || event.key === "m") {
        event.preventDefault();
        const newTheme = document.documentElement.classList.contains("dark")
          ? Theme.LIGHT
          : Theme.DARK;
        updateTheme(newTheme);
      }
    };

    const handleSystemThemeChange = (event: MediaQueryListEvent) => {
      const newTheme = event.matches ? Theme.DARK : Theme.LIGHT;
      updateTheme(newTheme);
    };

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", handleSystemThemeChange);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [getSystemThemePreferences, updateTheme]);

  const Skeleton = () => {
    return <span className="size-5 rounded bg-neutral-400/20"></span>;
  };

  return (
    <ClientOnly fallback={<Skeleton />}>
      <button
        aria-label={`${theme} mode`}
        onClick={toggleTheme}
        className="relative flex items-center justify-center outline-none"
      >
        {/*TODO: make the icons transition smoothly*/}
        <SunMedium
          className={cn(
            "size-5 transition-all duration-300 ease-in-out",
            theme === Theme.LIGHT ? "scale-100" : "scale-0",
          )}
        />
        <MoonStar
          className={cn(
            "absolute size-5 transition-all duration-300 ease-in-out",
            theme === Theme.LIGHT ? "scale-0" : "scale-100",
          )}
        />
        <span className="sr-only">Toggle Theme</span>
      </button>
    </ClientOnly>
  );
}
