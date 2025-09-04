import { useTheme } from "../store/themeStore";

export const themeVariables = {
  light: {
    "--primary-bg": "#ffffff",
    "--secondary-bg": "#f8fafc",
    "--primary-text": "#1f2937",
    "--secondary-text": "#6b7280",
    "--border-color": "#e5e7eb",
    "--accent-color": "#3b82f6",
  },
  dark: {
    "--primary-bg": "#111827",
    "--secondary-bg": "#1f2937",
    "--primary-text": "#f9fafb",
    "--secondary-text": "#d1d5db",
    "--border-color": "#374151",
    "--accent-color": "#60a5fa",
  },
} as const;

export const applyThemeVariables = (theme: "light" | "dark") => {
  if (typeof document === "undefined") return;

  const variables = themeVariables[theme];
  const root = document.documentElement;

  Object.entries(variables).forEach(([property, value]) => {
    root.style.setProperty(property, value);
  });
};
