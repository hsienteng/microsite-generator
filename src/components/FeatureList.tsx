import React, { useState, useEffect } from "react";

interface Feature {
  title: string;
  description?: string;
  icon?: string;
}

interface FeatureListProps {
  title?: string;
  features?: Feature[];
}

// Layout variants for feature lists
const layoutVariants = {
  variant1: {
    containerClass: "p-4 bg-white dark:bg-black",
    titleClass: "text-2xl font-bold mb-6 text-gray-900 dark:text-white",
    gridClass: "grid md:grid-cols-2 gap-4",
    itemClass:
      "flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm",
    iconContainerClass: "flex-shrink-0",
    iconClass: "pi text-red-600 dark:text-red-400 text-lg",
    dotClass: "w-3 h-3 bg-red-600 dark:bg-red-400 rounded-full mt-2",
    titleItemClass: "font-semibold text-gray-900 dark:text-white mb-1",
    descriptionClass: "text-gray-600 dark:text-gray-300 text-sm",
  },
  variant2: {
    containerClass: "p-6 bg-white dark:bg-black",
    titleClass:
      "text-3xl font-extrabold mb-8 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent",
    gridClass: "grid md:grid-cols-3 gap-6",
    itemClass:
      "text-center p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105",
    iconContainerClass: "mb-4",
    iconClass: "pi text-blue-600 dark:text-blue-400 text-3xl",
    dotClass: "w-6 h-6 bg-blue-600 dark:bg-blue-400 rounded-full mx-auto",
    titleItemClass: "font-bold text-gray-900 dark:text-white mb-3 text-lg",
    descriptionClass:
      "text-gray-700 dark:text-gray-200 text-sm leading-relaxed",
  },
  variant3: {
    containerClass: "p-8 bg-white dark:bg-black",
    titleClass:
      "text-2xl font-bold mb-6 text-right text-gray-900 dark:text-white border-r-4 border-r-blue-500 pr-4",
    gridClass: "grid md:grid-cols-1 gap-3",
    itemClass:
      "flex items-center space-x-6 p-4 bg-gray-100 dark:bg-gray-800 border-l-4 border-l-blue-500 rounded-r-lg shadow-md hover:shadow-lg transition-shadow",
    iconContainerClass: "flex-shrink-0",
    iconClass: "pi text-blue-600 dark:text-blue-400 text-xl",
    dotClass: "w-4 h-4 bg-blue-600 dark:bg-blue-400 rounded-full",
    titleItemClass: "font-semibold text-gray-900 dark:text-white mb-1",
    descriptionClass: "text-gray-600 dark:text-gray-300 text-sm",
  },
  variant4: {
    containerClass: "p-12 bg-white dark:bg-black",
    titleClass:
      "text-4xl font-black mb-12 text-center text-gray-900 dark:text-white uppercase tracking-wider",
    gridClass: "grid md:grid-cols-2 lg:grid-cols-4 gap-8",
    itemClass:
      "p-8 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm hover:shadow-md transition-all text-center",
    iconContainerClass: "mb-6",
    iconClass: "pi text-gray-500 dark:text-gray-400 text-4xl",
    dotClass: "w-8 h-8 bg-gray-500 dark:bg-gray-400 rounded-full mx-auto",
    titleItemClass:
      "font-light text-gray-900 dark:text-white mb-4 text-xl uppercase tracking-wide",
    descriptionClass: "text-gray-600 dark:text-gray-400 text-xs leading-loose",
  },
};

export const FeatureList: React.FC<FeatureListProps> = ({
  title = "Features",
  features = [],
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

  return (
    <div className={currentLayout.containerClass}>
      <h3 className={currentLayout.titleClass}>{title}</h3>
      <div className={currentLayout.gridClass}>
        {features.map((feature, index) => (
          <div key={index} className={currentLayout.itemClass}>
            <div className={currentLayout.iconContainerClass}>
              {feature.icon ? (
                <i className={`${feature.icon} ${currentLayout.iconClass}`}></i>
              ) : (
                <div className={currentLayout.dotClass}></div>
              )}
            </div>
            <div className={selectedVariant === "variant3" ? "flex-1" : ""}>
              <h5 className={currentLayout.titleItemClass}>{feature.title}</h5>
              {feature.description && (
                <p className={currentLayout.descriptionClass}>
                  {feature.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
