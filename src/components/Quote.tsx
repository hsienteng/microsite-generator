import React, { useState, useEffect } from "react";
import { Card } from "primereact/card";
import { Badge } from "primereact/badge";

interface QuoteProps {
  text?: string;
  author?: string;
  highlighted?: boolean;
}

// Layout variants for quotes
const layoutVariants = {
  variant1: {
    containerClass: "my-8 bg-white dark:bg-black py-12 px-8",
    contentClass: "max-w-4xl mx-auto",
    quoteClass:
      "text-xl italic text-gray-900 dark:text-white mb-6 leading-relaxed text-center",
    leftIconClass: "pi pi-quote-left text-red-600 mr-3 text-2xl",
    rightIconClass: "pi pi-quote-right text-red-600 ml-3 text-2xl",
    authorContainerClass: "flex items-center justify-center",
    authorClass: "bg-red-600 text-white px-4 py-2 rounded font-medium",
  },
  variant2: {
    containerClass: "my-12 bg-white dark:bg-black py-16 px-8",
    contentClass: "max-w-6xl mx-auto text-left",
    quoteClass:
      "text-3xl font-light text-gray-900 dark:text-white mb-8 leading-loose bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent",
    leftIconClass:
      "pi pi-quote-left text-blue-600 dark:text-blue-400 mr-4 text-4xl",
    rightIconClass: "",
    authorContainerClass: "flex items-center justify-start",
    authorClass:
      "bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold shadow-lg",
  },
  variant3: {
    containerClass: "my-8 bg-white dark:bg-black py-10 px-8",
    contentClass: "max-w-5xl mx-auto text-right",
    quoteClass:
      "text-lg text-gray-900 dark:text-white mb-4 leading-normal border-r-4 border-r-blue-500 pr-6",
    leftIconClass: "",
    rightIconClass:
      "pi pi-quote-right text-blue-600 dark:text-blue-400 ml-2 text-xl",
    authorContainerClass: "flex items-center justify-end",
    authorClass:
      "bg-blue-600 text-white px-3 py-2 rounded-sm font-medium uppercase tracking-wider text-sm",
  },
  variant4: {
    containerClass: "my-16 bg-white dark:bg-black py-20 px-8",
    contentClass: "max-w-3xl mx-auto text-center",
    quoteClass:
      "text-4xl font-black text-gray-900 dark:text-white mb-8 leading-tight uppercase tracking-wide",
    leftIconClass: "pi pi-quote-left text-gray-600 mr-2 text-lg",
    rightIconClass: "pi pi-quote-right text-gray-600 ml-2 text-lg",
    authorContainerClass: "flex items-center justify-center",
    authorClass:
      "bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white px-2 py-1 rounded font-light uppercase tracking-widest text-xs",
  },
};

export const Quote: React.FC<QuoteProps> = ({
  text = "No quote provided.",
  author,
  highlighted = false,
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
    <div
      className={`${currentLayout.containerClass} ${
        highlighted ? "border-l-4 border-red-600" : ""
      }`}
    >
      <div className={currentLayout.contentClass}>
        <blockquote className={currentLayout.quoteClass}>
          {currentLayout.leftIconClass && (
            <i className={currentLayout.leftIconClass}></i>
          )}
          {text}
          {currentLayout.rightIconClass && (
            <i className={currentLayout.rightIconClass}></i>
          )}
        </blockquote>
        {author && (
          <div className={currentLayout.authorContainerClass}>
            <span className={currentLayout.authorClass}>— {author}</span>
          </div>
        )}
      </div>
    </div>
  );
};
