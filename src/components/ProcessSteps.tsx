import React, { useState, useEffect } from "react";
import { Card } from "primereact/card";

interface ProcessStep {
  title: string;
  description: string;
  icon?: string;
}

interface ProcessStepsProps {
  title?: string;
  steps?: ProcessStep[];
}

// Layout variants for process steps
const layoutVariants = {
  variant1: {
    containerClass: "bg-white dark:bg-black py-12 px-8",
    contentClass: "max-w-6xl mx-auto",
    titleClass:
      "text-2xl font-bold mb-8 text-center text-gray-900 dark:text-white",
    gridClass: "grid md:grid-cols-2 lg:grid-cols-4 gap-6",
    stepClass:
      "text-center bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6 shadow-lg h-full",
    numberClass:
      "w-16 h-16 bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4 border border-gray-300 dark:border-gray-700",
    stepTitleClass: "font-semibold mb-3 text-gray-900 dark:text-white",
    descriptionClass:
      "text-gray-600 dark:text-gray-300 text-sm leading-relaxed",
  },
  variant2: {
    containerClass: "bg-white dark:bg-black py-16 px-8",
    contentClass: "max-w-6xl mx-auto",
    titleClass:
      "text-4xl font-extrabold mb-12 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent",
    gridClass: "grid md:grid-cols-2 lg:grid-cols-3 gap-8",
    stepClass:
      "text-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-8 shadow-xl hover:scale-105 transition-all duration-300 h-full",
    numberClass:
      "w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full flex items-center justify-center font-black text-2xl mx-auto mb-6 shadow-lg",
    stepTitleClass: "font-bold mb-4 text-gray-900 dark:text-white text-lg",
    descriptionClass:
      "text-gray-700 dark:text-gray-200 text-sm leading-relaxed",
  },
  variant3: {
    containerClass: "bg-white dark:bg-black py-10 px-8",
    contentClass: "max-w-6xl mx-auto",
    titleClass:
      "text-2xl font-bold mb-8 text-right text-gray-900 dark:text-white border-r-4 border-r-blue-500 pr-4",
    gridClass: "grid md:grid-cols-1 gap-4",
    stepClass:
      "flex items-center bg-gray-100 dark:bg-gray-800 border-l-4 border-l-blue-500 rounded-r-lg p-6 shadow-md hover:shadow-lg transition-shadow",
    numberClass:
      "w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg mr-6 flex-shrink-0",
    stepTitleClass: "font-semibold mb-2 text-gray-900 dark:text-white",
    descriptionClass:
      "text-gray-600 dark:text-gray-300 text-sm leading-relaxed",
  },
  variant4: {
    containerClass: "bg-white dark:bg-black py-20 px-8",
    contentClass: "max-w-6xl mx-auto",
    titleClass:
      "text-5xl font-black mb-16 text-center text-gray-900 dark:text-white uppercase tracking-wider",
    gridClass: "grid md:grid-cols-2 gap-12",
    stepClass:
      "text-center bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-12 shadow-sm h-full",
    numberClass:
      "w-24 h-24 bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white rounded-full flex items-center justify-center font-black text-3xl mx-auto mb-8 ring-2 ring-gray-400 dark:ring-gray-600",
    stepTitleClass:
      "font-light mb-6 text-gray-900 dark:text-white text-2xl uppercase tracking-wide",
    descriptionClass: "text-gray-600 dark:text-gray-400 text-xs leading-loose",
  },
};

export const ProcessSteps: React.FC<ProcessStepsProps> = ({
  title = "Process Steps",
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

  return (
    <div className={currentLayout.containerClass}>
      <div className={currentLayout.contentClass}>
        <h3 className={currentLayout.titleClass}>{title}</h3>
        <div className={currentLayout.gridClass}>
          {steps.map((step, index) => (
            <div key={index} className={currentLayout.stepClass}>
              <div className={currentLayout.numberClass}>
                {step.icon ? <i className={`pi ${step.icon}`}></i> : index + 1}
              </div>
              {selectedVariant === "variant3" ? (
                <div className="flex-1">
                  <h4 className={currentLayout.stepTitleClass}>{step.title}</h4>
                  <p className={currentLayout.descriptionClass}>
                    {step.description}
                  </p>
                </div>
              ) : (
                <>
                  <h4 className={currentLayout.stepTitleClass}>{step.title}</h4>
                  <p className={currentLayout.descriptionClass}>
                    {step.description}
                  </p>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
