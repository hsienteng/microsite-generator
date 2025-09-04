import React, { useState, useEffect } from "react";
import { Panel } from "primereact/panel";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  title?: string;
  description?: string;
  items?: FAQItem[];
}

// Layout variants for FAQ
const layoutVariants = {
  variant1: {
    containerClass: "bg-white dark:bg-black py-12 px-8",
    contentClass: "max-w-6xl mx-auto",
    titleClass: "text-3xl font-bold text-gray-900 dark:text-white mb-4",
    descriptionClass: "text-gray-600 dark:text-gray-300 mb-6",
    itemsClass: "space-y-3",
    panelClass:
      "bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800",
    answerClass: "text-gray-600 dark:text-gray-300",
  },
  variant2: {
    containerClass: "bg-white dark:bg-black py-16 px-8",
    contentClass: "max-w-6xl mx-auto",
    titleClass:
      "text-5xl font-extrabold text-center mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent",
    descriptionClass:
      "text-gray-700 dark:text-gray-200 mb-8 text-center text-lg",
    itemsClass: "space-y-6",
    panelClass:
      "bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300",
    answerClass: "text-gray-700 dark:text-gray-200 leading-relaxed",
  },
  variant3: {
    containerClass: "bg-white dark:bg-black py-10 px-8",
    contentClass: "max-w-6xl mx-auto",
    titleClass:
      "text-3xl font-bold text-right text-gray-900 dark:text-white mb-4 border-r-4 border-r-blue-500 pr-4",
    descriptionClass: "text-gray-600 dark:text-gray-300 mb-6 text-right",
    itemsClass: "space-y-4",
    panelClass:
      "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border-l-4 border-l-blue-500 rounded-r-lg shadow-md hover:shadow-lg transition-shadow",
    answerClass: "text-gray-600 dark:text-gray-300 text-right",
  },
  variant4: {
    containerClass: "bg-white dark:bg-black py-20 px-8",
    contentClass: "max-w-6xl mx-auto",
    titleClass:
      "text-6xl font-black text-center text-gray-900 dark:text-white mb-8 uppercase tracking-wider",
    descriptionClass:
      "text-gray-600 dark:text-gray-400 mb-12 text-center text-sm uppercase tracking-widest",
    itemsClass: "space-y-8",
    panelClass:
      "bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm",
    answerClass: "text-gray-600 dark:text-gray-400 leading-loose text-sm",
  },
};

export const FAQ: React.FC<FAQProps> = ({
  title = "FAQ",
  description,
  items = [],
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

  const safeItems: FAQItem[] = Array.isArray(items)
    ? items.filter((it) => it && (it.question || it.answer))
    : [];

  return (
    <div className={currentLayout.containerClass}>
      <div className={currentLayout.contentClass}>
        {title && <h2 className={currentLayout.titleClass}>{title}</h2>}
        {description && (
          <p className={currentLayout.descriptionClass}>{description}</p>
        )}
        <div className={currentLayout.itemsClass}>
          {safeItems.map((item, idx) => (
            <Panel
              key={idx}
              header={item?.question || `Question ${idx + 1}`}
              toggleable
              className={currentLayout.panelClass}
            >
              <div className={currentLayout.answerClass}>
                {item?.answer || ""}
              </div>
            </Panel>
          ))}
        </div>
      </div>
    </div>
  );
};
