import React, { useState, useEffect } from "react";

interface HighlightItem {
  title: string;
  description?: string;
  icon?: string;
}

interface FeatureHighlightsProps {
  title?: string;
  description?: string;
  highlights?: HighlightItem[];
}

// Layout variants for feature highlights
const layoutVariants = {
  variant1: {
    sectionClass: "bg-white dark:bg-black py-12 px-8",
    containerClass: "max-w-6xl mx-auto",
    titleClass: "text-3xl font-bold text-gray-900 dark:text-white mb-3",
    descriptionClass: "text-gray-600 dark:text-gray-300 mb-8",
    gridClass: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
    itemClass:
      "bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6",
    iconClass: "pi text-gray-900 dark:text-white mb-3",
    itemTitleClass: "text-gray-900 dark:text-white font-semibold mb-2",
    itemDescriptionClass: "text-gray-600 dark:text-gray-300",
  },
  variant2: {
    sectionClass: "bg-white dark:bg-black py-16 px-8",
    containerClass: "max-w-6xl mx-auto",
    titleClass:
      "text-5xl font-extrabold text-center text-gray-900 dark:text-white mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent",
    descriptionClass:
      "text-gray-700 dark:text-gray-200 mb-12 text-center text-lg",
    gridClass: "grid grid-cols-1 md:grid-cols-2 gap-8",
    itemClass:
      "bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-8 shadow-lg hover:scale-105 transition-all duration-300",
    iconClass: "pi text-blue-600 dark:text-blue-400 mb-4 text-2xl",
    itemTitleClass: "text-gray-900 dark:text-white font-bold mb-3 text-xl",
    itemDescriptionClass: "text-gray-700 dark:text-gray-200 leading-relaxed",
  },
  variant3: {
    sectionClass: "bg-white dark:bg-black py-10 px-8",
    containerClass: "max-w-6xl mx-auto",
    titleClass:
      "text-3xl font-bold text-right text-gray-900 dark:text-white mb-3 border-r-4 border-r-blue-500 pr-4",
    descriptionClass: "text-gray-600 dark:text-gray-300 mb-8 text-right",
    gridClass: "grid grid-cols-1 gap-4",
    itemClass:
      "bg-gray-100 dark:bg-gray-800 border-l-4 border-l-blue-500 rounded-r-lg p-6 flex items-center gap-4 hover:shadow-lg transition-shadow",
    iconClass: "pi text-blue-600 dark:text-blue-400 text-xl flex-shrink-0",
    itemTitleClass: "text-gray-900 dark:text-white font-semibold mb-1",
    itemDescriptionClass: "text-gray-600 dark:text-gray-300 text-sm",
  },
  variant4: {
    sectionClass: "bg-white dark:bg-black py-20 px-8",
    containerClass: "max-w-6xl mx-auto",
    titleClass:
      "text-6xl font-black text-center text-gray-900 dark:text-white mb-8 uppercase tracking-wider",
    descriptionClass:
      "text-gray-600 dark:text-gray-400 mb-16 text-center text-sm uppercase tracking-widest",
    gridClass: "grid grid-cols-1 md:grid-cols-2 gap-12",
    itemClass:
      "bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-12 text-center",
    iconClass: "pi text-gray-600 dark:text-gray-400 mb-6 text-4xl",
    itemTitleClass:
      "text-gray-900 dark:text-white font-light mb-4 text-2xl uppercase tracking-wide",
    itemDescriptionClass:
      "text-gray-600 dark:text-gray-400 text-xs leading-loose",
  },
};

export const FeatureHighlights: React.FC<FeatureHighlightsProps> = ({
  title = "Highlights",
  description,
  highlights = [],
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

  const safeHighlights: HighlightItem[] = Array.isArray(highlights)
    ? highlights.filter((h) => h && (h.title || h.description))
    : [];
  return (
    <section className={currentLayout.sectionClass}>
      <div className={currentLayout.containerClass}>
        {title && <h2 className={currentLayout.titleClass}>{title}</h2>}
        {description && (
          <p className={currentLayout.descriptionClass}>{description}</p>
        )}
        <div className={currentLayout.gridClass}>
          {safeHighlights.map((h, idx) => (
            <div key={idx} className={currentLayout.itemClass}>
              {h?.icon && (
                <i className={`${h.icon} ${currentLayout.iconClass}`}></i>
              )}
              {selectedVariant === "variant3" ? (
                <div className="flex-1">
                  <h3 className={currentLayout.itemTitleClass}>
                    {h?.title || `Item ${idx + 1}`}
                  </h3>
                  {h?.description && (
                    <p className={currentLayout.itemDescriptionClass}>
                      {h?.description}
                    </p>
                  )}
                </div>
              ) : (
                <>
                  <h3 className={currentLayout.itemTitleClass}>
                    {h?.title || `Item ${idx + 1}`}
                  </h3>
                  {h?.description && (
                    <p className={currentLayout.itemDescriptionClass}>
                      {h?.description}
                    </p>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
