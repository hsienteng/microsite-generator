import React, { useState, useEffect } from "react";
import { Card } from "primereact/card";

interface Stat {
  label?: string;
  value?: string | number;
  icon?: string;
  color?: string;
  title?: string;
  [key: string]: any;
}

interface StatsCardProps {
  title?: string;
  stats?: Stat[];
}

// Layout variants for stats cards
const layoutVariants = {
  variant1: {
    containerClass: "py-8 bg-white dark:bg-black",
    titleClass:
      "text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white",
    gridClass: "grid md:grid-cols-2 lg:grid-cols-4 gap-6",
    cardClass:
      "text-center shadow-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800",
    contentClass: "p-6",
    iconClass: "text-3xl mb-4",
    valueClass: "text-3xl font-bold mb-2 text-gray-900 dark:text-white",
    labelClass: "text-gray-600 dark:text-gray-300 font-medium",
  },
  variant2: {
    containerClass: "py-12 bg-white dark:bg-black",
    titleClass:
      "text-4xl font-extrabold mb-10 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent",
    gridClass: "grid md:grid-cols-2 lg:grid-cols-3 gap-8",
    cardClass:
      "text-center shadow-xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:scale-105 transition-all duration-300",
    contentClass: "p-8",
    iconClass: "text-4xl mb-6",
    valueClass: "text-4xl font-black mb-3 text-gray-900 dark:text-white",
    labelClass: "text-gray-700 dark:text-gray-200 font-semibold text-lg",
  },
  variant3: {
    containerClass: "py-10 bg-white dark:bg-black",
    titleClass:
      "text-2xl font-bold mb-8 text-right text-gray-900 dark:text-white border-r-4 border-r-blue-500 pr-4",
    gridClass: "grid md:grid-cols-2 gap-4",
    cardClass:
      "flex items-center shadow-md bg-gray-100 dark:bg-gray-800 border-l-4 border-l-blue-500 rounded-r-lg hover:shadow-lg transition-shadow",
    contentClass: "p-6 flex items-center gap-6 w-full",
    iconClass: "text-2xl",
    valueClass: "text-2xl font-bold text-gray-900 dark:text-white",
    labelClass: "text-gray-600 dark:text-gray-300 font-medium text-sm",
  },
  variant4: {
    containerClass: "py-16 bg-white dark:bg-black",
    titleClass:
      "text-5xl font-black mb-16 text-center text-gray-900 dark:text-white uppercase tracking-wider",
    gridClass: "grid md:grid-cols-4 gap-12",
    cardClass:
      "text-center shadow-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl",
    contentClass: "p-12",
    iconClass: "text-6xl mb-8",
    valueClass: "text-6xl font-black mb-4 text-gray-900 dark:text-white",
    labelClass:
      "text-gray-600 dark:text-gray-400 font-light text-xs uppercase tracking-widest",
  },
};

export const StatsCard: React.FC<StatsCardProps> = ({
  title = "Statistics",
  stats = [],
}) => {
  const [selectedVariant, setSelectedVariant] =
    useState<keyof typeof layoutVariants>("variant1");

  // Select random layout variant on component mount
  useEffect(() => {
    const variants = Object.keys(layoutVariants) as Array<
      keyof typeof layoutVariants
    >;
    const randomVariant = variants[Math.floor(Math.random() * variants.length)];
    setSelectedVariant(randomVariant);
  }, []);

  // Get the current layout styles
  const currentLayout = layoutVariants[selectedVariant];

  // Normalize stats to handle different data structures
  const normalizedStats = stats.map((stat) => ({
    label: stat.label || stat.title || "Statistic",
    value: stat.value || "0",
    icon: stat.icon,
    color: stat.color,
  }));

  return (
    <div className={currentLayout.containerClass}>
      {title && <h3 className={currentLayout.titleClass}>{title}</h3>}
      <div className={currentLayout.gridClass}>
        {normalizedStats.map((stat, index) => (
          <Card key={index} className={currentLayout.cardClass}>
            <div className={currentLayout.contentClass}>
              {selectedVariant === "variant3" ? (
                <>
                  {stat.icon && (
                    <i
                      className={`pi ${stat.icon} ${currentLayout.iconClass} ${
                        stat.color || "text-blue-400"
                      }`}
                    ></i>
                  )}
                  <div className="flex-1">
                    <div
                      className={`${currentLayout.valueClass} ${
                        stat.color || "text-blue-400"
                      }`}
                    >
                      {stat.value}
                    </div>
                    <div className={currentLayout.labelClass}>{stat.label}</div>
                  </div>
                </>
              ) : (
                <>
                  {stat.icon && (
                    <i
                      className={`pi ${stat.icon} ${currentLayout.iconClass} ${
                        stat.color || "text-primary-400"
                      }`}
                    ></i>
                  )}
                  <div
                    className={`${currentLayout.valueClass} ${
                      stat.color || "text-primary-400"
                    }`}
                  >
                    {stat.value}
                  </div>
                  <div className={currentLayout.labelClass}>{stat.label}</div>
                </>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
