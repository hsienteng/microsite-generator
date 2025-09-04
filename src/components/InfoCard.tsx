import React, { useState, useEffect } from "react";
import { Card } from "primereact/card";
import { Badge } from "primereact/badge";

interface InfoCardProps {
  title?: string;
  description?: string;
  items?: Record<string, string> | string[] | string;
  icon?: string;
}

// Layout variants for info cards
const layoutVariants = {
  variant1: {
    containerClass: "bg-white dark:bg-black py-12 px-8",
    contentClass: "max-w-6xl mx-auto",
    headerClass: "flex items-center gap-3 mb-6",
    titleClass: "text-2xl font-bold text-gray-900 dark:text-white",
    iconClass: "text-gray-900 dark:text-white",
    descriptionClass:
      "bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-lg text-gray-900 dark:text-white",
    gridClass: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6",
    itemClass:
      "bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-4 rounded-lg text-gray-900 dark:text-white",
    keyClass:
      "text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2",
    valueClass: "text-gray-900 dark:text-white font-medium",
  },
  variant2: {
    containerClass: "bg-white dark:bg-black py-16 px-8",
    contentClass: "max-w-6xl mx-auto",
    headerClass: "flex items-center gap-4 mb-8 justify-center",
    titleClass:
      "text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent",
    iconClass: "text-blue-600 dark:text-blue-400 text-2xl",
    descriptionClass:
      "bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border border-gray-200 dark:border-gray-700 p-8 rounded-xl text-gray-900 dark:text-white shadow-lg",
    gridClass: "grid grid-cols-1 md:grid-cols-2 gap-8 mt-8",
    itemClass:
      "bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border border-gray-200 dark:border-gray-700 p-6 rounded-xl text-gray-900 dark:text-white shadow-lg hover:scale-105 transition-all duration-300",
    keyClass:
      "text-sm font-semibold text-blue-600 dark:text-blue-300 uppercase tracking-wider mb-3",
    valueClass: "text-gray-900 dark:text-white font-bold text-lg",
  },
  variant3: {
    containerClass: "bg-white dark:bg-black py-10 px-8",
    contentClass: "max-w-6xl mx-auto",
    headerClass: "flex items-center gap-3 mb-6 justify-end",
    titleClass:
      "text-2xl font-bold text-gray-900 dark:text-white border-r-4 border-r-blue-500 pr-4",
    iconClass: "text-blue-600 dark:text-blue-400",
    descriptionClass:
      "bg-gray-100 dark:bg-gray-800 border-l-4 border-l-blue-500 p-6 rounded-r-lg text-gray-900 dark:text-white",
    gridClass: "grid grid-cols-1 gap-4 mt-6",
    itemClass:
      "bg-gray-100 dark:bg-gray-800 border-l-4 border-l-blue-500 p-4 rounded-r-lg text-gray-900 dark:text-white flex items-center gap-6",
    keyClass:
      "text-sm font-medium text-blue-700 dark:text-blue-200 uppercase tracking-wider min-w-32",
    valueClass: "text-gray-900 dark:text-white font-medium flex-1",
  },
  variant4: {
    containerClass: "bg-white dark:bg-black py-20 px-8",
    contentClass: "max-w-6xl mx-auto",
    headerClass: "flex flex-col items-center gap-4 mb-12",
    titleClass:
      "text-5xl font-black text-gray-900 dark:text-white uppercase tracking-wider text-center",
    iconClass: "text-gray-500 dark:text-gray-400 text-4xl",
    descriptionClass:
      "bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-12 rounded-2xl text-gray-900 dark:text-white text-center",
    gridClass: "grid grid-cols-1 md:grid-cols-2 gap-12 mt-12",
    itemClass:
      "bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-8 rounded-2xl text-gray-900 dark:text-white text-center",
    keyClass:
      "text-xs font-light text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-4",
    valueClass:
      "text-gray-900 dark:text-white font-black text-2xl uppercase tracking-wide",
  },
};

export const InfoCard: React.FC<InfoCardProps> = ({
  title = "Information",
  description,
  items = {},
  icon,
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

  // Normalize items: if a string is provided, treat it as description
  let normalizedDescription = description || "";
  let normalizedItems: Record<string, string> | string[] = {};

  if (typeof items === "string") {
    normalizedDescription = normalizedDescription || items;
    normalizedItems = {};
  } else {
    normalizedItems = (items as any) || {};
  }

  return (
    <div className={currentLayout.containerClass}>
      <div className={currentLayout.contentClass}>
        <div className={currentLayout.headerClass}>
          {icon && <i className={`pi ${icon} ${currentLayout.iconClass}`}></i>}
          <h2 className={currentLayout.titleClass}>{title}</h2>
        </div>
        {normalizedDescription && normalizedDescription.length > 0 && (
          <div className={currentLayout.descriptionClass}>
            {normalizedDescription}
          </div>
        )}
        {normalizedItems &&
          Array.isArray(normalizedItems) &&
          normalizedItems.length > 0 && (
            <div className={currentLayout.gridClass}>
              {normalizedItems.map((value, idx) => (
                <div key={idx} className={currentLayout.itemClass}>
                  {value}
                </div>
              ))}
            </div>
          )}
        {normalizedItems &&
          !Array.isArray(normalizedItems) &&
          Object.keys(normalizedItems).length > 0 && (
            <div className={currentLayout.gridClass}>
              {Object.entries(normalizedItems as Record<string, string>).map(
                ([key, value]) => (
                  <div key={key} className={currentLayout.itemClass}>
                    <div className={currentLayout.keyClass}>{key}</div>
                    <div className={currentLayout.valueClass}>{value}</div>
                  </div>
                )
              )}
            </div>
          )}
      </div>
    </div>
  );
};
