import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Theme = "light" | "dark";

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: "dark", // Default to dark theme as per user preference
      setTheme: (theme: Theme) => {
        set({ theme });

        // Apply theme to document
        if (typeof document !== "undefined") {
          const root = document.documentElement;
          if (theme === "dark") {
            root.classList.add("dark");
            root.style.colorScheme = "dark";
          } else {
            root.classList.remove("dark");
            root.style.colorScheme = "light";
          }
        }
      },
      toggleTheme: () => {
        const currentTheme = get().theme;
        const newTheme = currentTheme === "light" ? "dark" : "light";
        get().setTheme(newTheme);
      },
    }),
    {
      name: "theme-storage", // unique name for localStorage key
      onRehydrateStorage: () => (state) => {
        // Apply theme to document when hydrating from localStorage
        if (state && typeof document !== "undefined") {
          const root = document.documentElement;
          if (state.theme === "dark") {
            root.classList.add("dark");
            root.style.colorScheme = "dark";
          } else {
            root.classList.remove("dark");
            root.style.colorScheme = "light";
          }
        }
      },
    }
  )
);

// Hook that mimics the old ThemeContext API for easier migration
export const useTheme = () => {
  const { theme, setTheme, toggleTheme } = useThemeStore();

  return {
    theme,
    setTheme,
    toggleTheme,
  };
};
