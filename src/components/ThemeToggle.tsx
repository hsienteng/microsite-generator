"use client";

import React from "react";
import { Button } from "primereact/button";
import { useTheme } from "@/store/themeStore";

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className = "",
  showLabel = true,
}) => {
  const { theme, toggleTheme } = useTheme();

  // Get the appropriate icon and label based on current theme
  const getThemeIcon = () => {
    return theme === "dark" ? "pi pi-moon" : "pi pi-sun";
  };

  const getThemeLabel = () => {
    if (!showLabel) return undefined;
    return theme === "dark" ? "Dark Mode" : "Light Mode";
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {showLabel && (
        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
          Theme:
        </span>
      )}
      <Button
        onClick={toggleTheme}
        icon={getThemeIcon()}
        label={getThemeLabel()}
        className={`
            transition-all duration-200 
            ${
              theme === "dark"
                ? "hover:bg-yellow-400 border-yellow-500 text-white"
                : "hover:bg-gray-700 border-gray-800 text-gray-900"
            }
          `}
        size="small"
        outlined={false}
        tooltip={`Current: ${theme}`}
        tooltipOptions={{ position: "bottom" }}
      />
    </div>
  );
};
