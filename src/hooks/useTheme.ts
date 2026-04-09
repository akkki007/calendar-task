"use client";

import { useState, useCallback, useEffect } from "react";
import { Theme } from "@/lib/types";

const STORAGE_KEY = "wall-calendar-theme";

export function useTheme() {
  // Keep the initial render deterministic across server and client to avoid hydration mismatch.
  const [theme, setTheme] = useState<Theme>("light");
  const [hasLoadedPreference, setHasLoadedPreference] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "dark" || saved === "light") {
        setTheme(saved);
      }
    } catch {
      // ignore
    } finally {
      setHasLoadedPreference(true);
    }
  }, []);

  useEffect(() => {
    if (!hasLoadedPreference) return;

    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // ignore
    }
  }, [theme, hasLoadedPreference]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }, []);

  return { theme, toggleTheme };
}
