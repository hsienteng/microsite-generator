import React, { useState, useEffect } from "react";
import { Card } from "primereact/card";

interface DynamicContentProps {
  [key: string]: any; // Accept any props
}

// Layout variants for dynamic content
const layoutVariants = {
  variant1: {
    cardClass: "mb-6 shadow-sm bg-gray-900 border border-gray-800",
    containerClass: "p-6",
    titleClass:
      "text-2xl font-bold text-white mb-4 border-b border-gray-700 pb-2",
    contentClass: "space-y-4",
    sectionClass: "space-y-2",
    sectionTitleClass: "text-lg font-semibold text-white capitalize",
    proseClass: "prose prose-sm max-w-none",
    textClass: "text-gray-300 leading-relaxed",
    listClass: "list-disc list-inside space-y-1 text-gray-300",
    listItemClass: "leading-relaxed",
    objectContainerClass: "space-y-4",
    objectItemClass: "border-l-2 border-gray-700 pl-4",
    objectKeyClass: "font-medium text-white capitalize mb-2",
    objectValueClass: "ml-2",
  },
  variant2: {
    cardClass:
      "mb-8 shadow-xl bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-xl",
    containerClass: "p-8",
    titleClass:
      "text-4xl font-extrabold text-center text-white mb-6 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent border-b-2 border-b-blue-500 pb-4",
    contentClass: "space-y-6",
    sectionClass: "space-y-3",
    sectionTitleClass: "text-xl font-bold text-white capitalize text-center",
    proseClass: "prose prose-lg max-w-none text-center",
    textClass: "text-gray-200 leading-loose text-center",
    listClass: "list-none space-y-2 text-gray-200 text-center",
    listItemClass: "leading-loose bg-gray-800 p-2 rounded",
    objectContainerClass: "space-y-6",
    objectItemClass:
      "bg-gradient-to-r from-gray-800 to-gray-700 border border-gray-600 p-4 rounded-xl",
    objectKeyClass: "font-bold text-white capitalize mb-3 text-center text-lg",
    objectValueClass: "text-center",
  },
  variant3: {
    cardClass:
      "mb-6 shadow-md bg-gray-800 border-l-4 border-l-blue-500 rounded-r-lg",
    containerClass: "p-6",
    titleClass:
      "text-2xl font-bold text-right text-white mb-4 border-r-4 border-r-blue-500 pr-4 pb-2",
    contentClass: "space-y-4",
    sectionClass: "space-y-2",
    sectionTitleClass: "text-lg font-semibold text-white capitalize text-right",
    proseClass: "prose prose-sm max-w-none text-right",
    textClass: "text-gray-300 leading-relaxed text-right",
    listClass: "list-none space-y-1 text-gray-300 text-right",
    listItemClass: "leading-relaxed",
    objectContainerClass: "space-y-4",
    objectItemClass: "border-r-2 border-blue-500 pr-4 text-right",
    objectKeyClass: "font-medium text-white capitalize mb-2 text-right",
    objectValueClass: "mr-2 text-right",
  },
  variant4: {
    cardClass: "mb-12 shadow-sm bg-gray-900 border border-gray-700 rounded-2xl",
    containerClass: "p-12",
    titleClass:
      "text-5xl font-black text-center text-white mb-8 uppercase tracking-wider border-b border-gray-600 pb-6",
    contentClass: "space-y-8",
    sectionClass: "space-y-4",
    sectionTitleClass:
      "text-2xl font-light text-white capitalize text-center uppercase tracking-wide",
    proseClass: "prose prose-xs max-w-none text-center",
    textClass: "text-gray-400 leading-loose text-center text-sm",
    listClass: "list-none space-y-3 text-gray-400 text-center",
    listItemClass: "leading-loose bg-gray-800 p-4 rounded-lg text-xs",
    objectContainerClass: "space-y-8",
    objectItemClass:
      "bg-gray-800 border border-gray-700 p-6 rounded-2xl text-center",
    objectKeyClass:
      "font-light text-white capitalize mb-4 text-center text-xl uppercase tracking-wide",
    objectValueClass: "text-center",
  },
};

export const DynamicContent: React.FC<DynamicContentProps> = (props) => {
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

  // Handle different content structures dynamically
  const renderContent = (data: any, level: number = 0): React.ReactNode => {
    if (data === null || data === undefined) {
      return null;
    }

    if (typeof data === "string") {
      // Handle markdown-style formatting
      if (data.includes("**") || data.includes("•")) {
        return (
          <div
            className={currentLayout.proseClass}
            dangerouslySetInnerHTML={{
              __html: data
                .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                .replace(/\n/g, "<br/>")
                .replace(/^• (.+)$/gm, "<ul><li>$1</li></ul>")
                .replace(/<\/ul><br\/><ul>/g, ""), // Merge consecutive lists
            }}
          />
        );
      }
      return <p className={currentLayout.textClass}>{data}</p>;
    }

    if (typeof data === "number" || typeof data === "boolean") {
      return <span className={currentLayout.textClass}>{String(data)}</span>;
    }

    if (Array.isArray(data)) {
      return (
        <ul className={currentLayout.listClass}>
          {data.map((item, index) => (
            <li key={index} className={currentLayout.listItemClass}>
              {renderContent(item, level + 1)}
            </li>
          ))}
        </ul>
      );
    }

    if (typeof data === "object") {
      return (
        <div className={currentLayout.objectContainerClass}>
          {Object.entries(data).map(([key, value]) => (
            <div key={key} className={currentLayout.objectItemClass}>
              <h4 className={currentLayout.objectKeyClass}>
                {key
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase())}
              </h4>
              <div className={currentLayout.objectValueClass}>
                {renderContent(value, level + 1)}
              </div>
            </div>
          ))}
        </div>
      );
    }

    return null;
  };

  const { title, ...otherProps } = props;

  // If there's only a title and no other content, don't render
  if (Object.keys(otherProps).length === 0 && !title) {
    return null;
  }

  return (
    <Card className={currentLayout.cardClass}>
      <div className={currentLayout.containerClass}>
        {title && <h2 className={currentLayout.titleClass}>{title}</h2>}

        <div className={currentLayout.contentClass}>
          {Object.entries(otherProps).map(([key, value]) => {
            // Skip empty values
            if (
              value === null ||
              value === undefined ||
              (typeof value === "string" && value.trim() === "") ||
              (Array.isArray(value) && value.length === 0) ||
              (typeof value === "object" && Object.keys(value).length === 0)
            ) {
              return null;
            }

            return (
              <div key={key} className={currentLayout.sectionClass}>
                {key !== "content" && key !== "description" && (
                  <h3 className={currentLayout.sectionTitleClass}>
                    {key
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (str) => str.toUpperCase())}
                  </h3>
                )}
                {renderContent(value)}
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
};

export default DynamicContent;
