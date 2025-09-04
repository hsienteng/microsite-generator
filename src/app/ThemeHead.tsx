"use client";

import { useEffect } from "react";
import { useThemeStore } from "@/store/themeStore";
import { applyThemeVariables } from "@/lib/themeUtils";

function ThemeHead() {
  const { theme } = useThemeStore();

  useEffect(() => {
    const applyTheme = (currentTheme: string) => {
      const root = document.documentElement;

      if (currentTheme === "dark") {
        root.classList.add("dark");
        root.style.colorScheme = "dark";
        applyThemeVariables("dark");
      } else {
        root.classList.remove("dark");
        root.style.colorScheme = "light";
        applyThemeVariables("light");
      }
    };

    applyTheme(theme);
  }, [theme]);

  return null;
}

export default ThemeHead;
