import React, { useState, useEffect } from "react";

interface StepItem {
  title: string;
  description?: string;
  icon?: string;
}

interface StepsOverviewProps {
  title?: string;
  description?: string;
  steps?: StepItem[];
}

// Layout variants for steps overview
const layoutVariants = {
  variant1: {
    sectionClass: "bg-white dark:bg-black py-12 px-8",
    containerClass: "max-w-6xl mx-auto",
    titleClass: "text-3xl font-bold text-gray-900 dark:text-white mb-3",
    descriptionClass: "text-gray-600 dark:text-gray-300 mb-8",
    listClass: "grid grid-cols-1 md:grid-cols-3 gap-6 list-decimal list-inside",
    itemClass:
      "bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6",
    headerClass: "flex items-center gap-2 mb-2",
    iconClass: "pi text-gray-900 dark:text-white",
    stepTitleClass: "text-gray-900 dark:text-white font-semibold",
    stepDescriptionClass: "text-gray-600 dark:text-gray-300",
  },
  variant2: {
    sectionClass: "bg-white dark:bg-black py-16 px-8",
    containerClass: "max-w-6xl mx-auto",
    titleClass:
      "text-5xl font-extrabold text-center text-gray-900 dark:text-white mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent",
    descriptionClass:
      "text-gray-700 dark:text-gray-200 mb-12 text-center text-lg",
    listClass: "grid grid-cols-1 md:grid-cols-2 gap-8 list-decimal list-inside",
    itemClass:
      "bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-8 shadow-lg hover:scale-105 transition-all duration-300 text-center",
    headerClass: "flex flex-col items-center gap-3 mb-4",
    iconClass: "pi text-blue-600 dark:text-blue-400 text-2xl",
    stepTitleClass: "text-gray-900 dark:text-white font-bold text-xl",
    stepDescriptionClass: "text-gray-700 dark:text-gray-200 leading-relaxed",
  },
  variant3: {
    sectionClass: "bg-white dark:bg-black py-10 px-8",
    containerClass: "max-w-6xl mx-auto",
    titleClass:
      "text-3xl font-bold text-right text-gray-900 dark:text-white mb-3 border-r-4 border-r-blue-500 pr-4",
    descriptionClass: "text-gray-600 dark:text-gray-300 mb-8 text-right",
    listClass: "grid grid-cols-1 gap-4 list-decimal list-inside",
    itemClass:
      "bg-gray-100 dark:bg-gray-800 border-l-4 border-l-blue-500 rounded-r-lg p-6 shadow-md hover:shadow-lg transition-shadow flex items-center gap-4",
    headerClass: "flex items-center gap-2 flex-shrink-0",
    iconClass: "pi text-blue-600 dark:text-blue-400",
    stepTitleClass: "text-gray-900 dark:text-white font-semibold text-right",
    stepDescriptionClass: "text-gray-600 dark:text-gray-300 text-right text-sm",
  },
  variant4: {
    sectionClass: "bg-white dark:bg-black py-20 px-8",
    containerClass: "max-w-6xl mx-auto",
    titleClass:
      "text-6xl font-black text-center text-gray-900 dark:text-white mb-8 uppercase tracking-wider",
    descriptionClass:
      "text-gray-600 dark:text-gray-400 mb-16 text-center text-sm uppercase tracking-widest",
    listClass:
      "grid grid-cols-1 md:grid-cols-3 gap-12 list-decimal list-inside",
    itemClass:
      "bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-12 text-center",
    headerClass: "flex flex-col items-center gap-4 mb-6",
    iconClass: "pi text-gray-600 dark:text-gray-400 text-4xl",
    stepTitleClass:
      "text-gray-900 dark:text-white font-light text-2xl uppercase tracking-wide",
    stepDescriptionClass:
      "text-gray-600 dark:text-gray-400 text-xs leading-loose",
  },
};

export const StepsOverview: React.FC<StepsOverviewProps> = ({
  title = "How it works",
  description,
  steps = [],
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

  const safeSteps: StepItem[] = Array.isArray(steps)
    ? steps.filter((s) => s && (s.title || s.description))
    : [];
  return (
    <section className={currentLayout.sectionClass}>
      <div className={currentLayout.containerClass}>
        {title && <h2 className={currentLayout.titleClass}>{title}</h2>}
        {description && (
          <p className={currentLayout.descriptionClass}>{description}</p>
        )}
        <ol className={currentLayout.listClass}>
          {safeSteps.map((step, idx) => (
            <li key={idx} className={currentLayout.itemClass}>
              <div className={currentLayout.headerClass}>
                {step?.icon && (
                  <i className={`${step.icon} ${currentLayout.iconClass}`}></i>
                )}
                <h3 className={currentLayout.stepTitleClass}>
                  {step?.title || `Step ${idx + 1}`}
                </h3>
              </div>
              {step?.description && selectedVariant === "variant3" ? (
                <div className="flex-1">
                  <p className={currentLayout.stepDescriptionClass}>
                    {step?.description}
                  </p>
                </div>
              ) : (
                step?.description && (
                  <p className={currentLayout.stepDescriptionClass}>
                    {step?.description}
                  </p>
                )
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};
