"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MoonStar, SunMedium } from "lucide-react";
import { useTheme } from "next-themes";

import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";

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
  const [showToolTip, setShowTooltip] = useState(false);
  const { theme, setTheme } = useTheme();
  const { isMobile } = useMediaQuery();
  const buttonRef = useRef<HTMLButtonElement>(null);

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
    const button = buttonRef.current;
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

    const handleTooltip = () => setShowTooltip((prev) => !prev);

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", handleSystemThemeChange);
    document.addEventListener("keydown", handleKeyDown);
    if (button) {
      button.addEventListener("mouseover", handleTooltip);
      button.addEventListener("mouseout", handleTooltip);
    }

    return () => {
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
      document.removeEventListener("keydown", handleKeyDown);
      if (button) {
        button.removeEventListener("mouseout", handleTooltip);
        button.removeEventListener("mouseover", handleTooltip);
      }
    };
  }, [getSystemThemePreferences, updateTheme]);

  return (
    <ClientOnly fallback={<Skeleton />}>
      <button
        onClick={toggleTheme}
        className="relative flex items-center justify-center outline-none"
        ref={buttonRef}
      >
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
        {!isMobile && <Tooltip show={showToolTip} />}
      </button>
    </ClientOnly>
  );
}

const Tooltip = ({ show }: { show: boolean }) => {
  return (
    <span
      className={cn(
        "pointer-events-none absolute bottom-[-38] inline-flex w-24 items-center justify-center rounded border border-foreground/40 bg-foreground/5 p-1 text-sm",
        "transition-all duration-200 ease-in-out",
        show ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0",
      )}
    >
      <span className="mr-1 inline-flex items-center justify-center rounded border border-foreground/40 bg-foreground/5 px-1 shadow-sm shadow-gray-800">
        M
      </span>
      to Toggle
    </span>
  );
};

const Skeleton = () => {
  return <span className="size-5 rounded bg-neutral-400/20"></span>;
};
