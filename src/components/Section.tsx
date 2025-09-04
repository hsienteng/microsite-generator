import React, { useState, useEffect } from "react";
import { Panel } from "primereact/panel";

interface SectionProps {
  title?: string;
  content?: string;
  children?: React.ReactNode;
  collapsible?: boolean;
  subsections?: Array<{
    title?: string;
    content?: string | object | any[];
  }>;
  items?: any[];
  [key: string]: any; // Accept any additional props
}

// Layout variants for sections
const layoutVariants = {
  variant1: {
    containerClass: "py-12 px-8 bg-white dark:bg-black",
    contentClass: "max-w-6xl mx-auto",
    titleClass: "text-3xl font-bold text-gray-900 dark:text-white mb-6",
    proseClass:
      "prose prose-lg mb-8 text-gray-600 dark:text-gray-300 prose-gray dark:prose-invert",
    subsectionsClass: "space-y-6 mt-8",
    subsectionClass: "border-l-4 border-gray-300 dark:border-gray-600 pl-6",
    subsectionTitleClass:
      "text-xl font-semibold text-gray-900 dark:text-white mb-3",
    subsectionContentClass: "text-gray-600 dark:text-gray-300 leading-relaxed",
    codeClass:
      "whitespace-pre-wrap text-sm bg-gray-100 dark:bg-gray-800 p-3 rounded text-gray-900 dark:text-gray-300",
    itemsClass:
      "list-disc list-inside space-y-2 mt-6 text-gray-600 dark:text-gray-300",
    itemClass: "leading-relaxed",
    otherPropsClass: "mt-6 space-y-4",
    propContainerClass: "bg-gray-50 dark:bg-gray-800 p-4 rounded",
    propTitleClass: "font-medium text-gray-900 dark:text-white mb-2 capitalize",
    propContentClass: "text-gray-600 dark:text-gray-300 text-sm",
    propCodeClass: "whitespace-pre-wrap",
  },
  variant2: {
    containerClass: "py-16 px-8 bg-white dark:bg-black",
    contentClass: "max-w-6xl mx-auto",
    titleClass:
      "text-5xl font-extrabold text-center text-gray-900 dark:text-white mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent",
    proseClass:
      "prose prose-xl mb-12 text-gray-700 dark:text-gray-200 prose-gray dark:prose-invert text-center",
    subsectionsClass: "space-y-10 mt-12",
    subsectionClass:
      "border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-xl p-8 shadow-lg hover:scale-105 transition-all duration-300",
    subsectionTitleClass:
      "text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center",
    subsectionContentClass:
      "text-gray-700 dark:text-gray-200 leading-loose text-center",
    codeClass:
      "whitespace-pre-wrap text-sm bg-gray-200 dark:bg-gray-700 p-4 rounded-lg text-gray-900 dark:text-gray-200 shadow-inner",
    itemsClass: "grid md:grid-cols-2 gap-4 mt-8",
    itemClass:
      "bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-gray-800 dark:text-gray-200 leading-relaxed border border-gray-200 dark:border-gray-700",
    otherPropsClass: "mt-12 grid md:grid-cols-2 gap-8",
    propContainerClass:
      "bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-600",
    propTitleClass:
      "font-bold text-gray-900 dark:text-white mb-3 text-lg capitalize",
    propContentClass: "text-gray-700 dark:text-gray-200 text-base",
    propCodeClass: "whitespace-pre-wrap leading-loose",
  },
  variant3: {
    containerClass: "py-10 px-8 bg-white dark:bg-black",
    contentClass: "max-w-6xl mx-auto",
    titleClass:
      "text-3xl font-bold text-right text-gray-900 dark:text-white mb-6 border-r-4 border-r-blue-500 pr-4",
    proseClass:
      "prose prose-lg mb-8 text-gray-600 dark:text-gray-300 prose-gray dark:prose-invert text-right",
    subsectionsClass: "space-y-6 mt-8",
    subsectionClass:
      "border-r-4 border-r-blue-500 pr-6 bg-gray-100 dark:bg-gray-800 p-6 rounded-l-lg shadow-md hover:shadow-lg transition-shadow",
    subsectionTitleClass:
      "text-xl font-semibold text-gray-900 dark:text-white mb-3 text-right",
    subsectionContentClass:
      "text-gray-600 dark:text-gray-300 leading-relaxed text-right",
    codeClass:
      "whitespace-pre-wrap text-sm bg-gray-200 dark:bg-gray-700 p-3 rounded text-gray-900 dark:text-gray-300 text-right",
    itemsClass: "space-y-3 mt-6",
    itemClass:
      "bg-gray-100 dark:bg-gray-800 p-3 rounded-r-lg border-l-4 border-l-blue-500 text-gray-600 dark:text-gray-300 leading-relaxed text-right",
    otherPropsClass: "mt-6 space-y-4",
    propContainerClass:
      "bg-gray-100 dark:bg-gray-800 p-4 rounded-r-lg border-l-4 border-l-blue-500",
    propTitleClass:
      "font-medium text-gray-900 dark:text-white mb-2 capitalize text-right",
    propContentClass: "text-gray-600 dark:text-gray-300 text-sm text-right",
    propCodeClass: "whitespace-pre-wrap text-right",
  },
  variant4: {
    containerClass: "py-20 px-8 bg-white dark:bg-black",
    contentClass: "max-w-6xl mx-auto",
    titleClass:
      "text-6xl font-black text-center text-gray-900 dark:text-white mb-12 uppercase tracking-wider",
    proseClass:
      "prose prose-sm mb-16 text-gray-600 dark:text-gray-400 prose-gray dark:prose-invert text-center uppercase tracking-widest leading-loose",
    subsectionsClass: "space-y-12 mt-16",
    subsectionClass:
      "bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-12 text-center",
    subsectionTitleClass:
      "text-3xl font-light text-gray-900 dark:text-white mb-6 uppercase tracking-wide",
    subsectionContentClass:
      "text-gray-600 dark:text-gray-400 leading-loose text-center text-sm",
    codeClass:
      "whitespace-pre-wrap text-xs bg-gray-200 dark:bg-gray-800 p-6 rounded-2xl text-gray-900 dark:text-gray-400 leading-loose",
    itemsClass: "grid md:grid-cols-1 gap-6 mt-12",
    itemClass:
      "bg-gray-100 dark:bg-gray-800 p-6 rounded-2xl text-gray-600 dark:text-gray-400 leading-loose text-center text-sm",
    otherPropsClass: "mt-16 space-y-8",
    propContainerClass:
      "bg-gray-50 dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-700",
    propTitleClass:
      "font-light text-gray-900 dark:text-white mb-4 text-xl uppercase tracking-wider text-center",
    propContentClass: "text-gray-600 dark:text-gray-400 text-xs text-center",
    propCodeClass: "whitespace-pre-wrap leading-loose text-center",
  },
};

export const Section: React.FC<SectionProps> = ({
  title,
  content,
  children,
  collapsible = false,
  subsections,
  items,
  ...otherProps
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
  // Render subsections if they exist
  const renderSubsections = () => {
    if (!subsections || subsections.length === 0) return null;

    return (
      <div className={currentLayout.subsectionsClass}>
        {subsections.map((subsection, index) => (
          <div key={index} className={currentLayout.subsectionClass}>
            {subsection.title && (
              <h3 className={currentLayout.subsectionTitleClass}>
                {subsection.title}
              </h3>
            )}
            {subsection.content && (
              <div className={currentLayout.subsectionContentClass}>
                {typeof subsection.content === "string" ? (
                  <div
                    dangerouslySetInnerHTML={{ __html: subsection.content }}
                  />
                ) : (
                  <pre className={currentLayout.codeClass}>
                    {JSON.stringify(subsection.content, null, 2)}
                  </pre>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  // Render items if they exist
  const renderItems = () => {
    if (!items || items.length === 0) return null;

    return selectedVariant === "variant2" || selectedVariant === "variant4" ? (
      <div className={currentLayout.itemsClass}>
        {items.map((item, index) => (
          <div key={index} className={currentLayout.itemClass}>
            {typeof item === "string" ? item : JSON.stringify(item)}
          </div>
        ))}
      </div>
    ) : (
      <ul className={currentLayout.itemsClass}>
        {items.map((item, index) => (
          <li key={index} className={currentLayout.itemClass}>
            {typeof item === "string" ? item : JSON.stringify(item)}
          </li>
        ))}
      </ul>
    );
  };

  // Render any other dynamic props
  const renderOtherProps = () => {
    const filteredProps = Object.entries(otherProps).filter(
      ([key, value]) =>
        key !== "title" &&
        key !== "content" &&
        key !== "children" &&
        key !== "collapsible" &&
        key !== "subsections" &&
        key !== "items" &&
        value !== null &&
        value !== undefined &&
        value !== ""
    );

    if (filteredProps.length === 0) return null;

    return (
      <div className={currentLayout.otherPropsClass}>
        {filteredProps.map(([key, value]) => (
          <div key={key} className={currentLayout.propContainerClass}>
            <h4 className={currentLayout.propTitleClass}>
              {key.replace(/([A-Z])/g, " $1")}
            </h4>
            <div className={currentLayout.propContentClass}>
              {typeof value === "string" ? (
                <div dangerouslySetInnerHTML={{ __html: value }} />
              ) : (
                <pre className={currentLayout.propCodeClass}>
                  {JSON.stringify(value, null, 2)}
                </pre>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };
  const sectionContent = (
    <div className={currentLayout.containerClass}>
      <div className={currentLayout.contentClass}>
        {title && <h2 className={currentLayout.titleClass}>{title}</h2>}
        {content && (
          <div
            className={currentLayout.proseClass}
            dangerouslySetInnerHTML={{ __html: content }}
          />
        )}
        {renderSubsections()}
        {renderItems()}
        {renderOtherProps()}
        {children}
      </div>
    </div>
  );

  if (collapsible) {
    return (
      <Panel
        header={title || "Collapsible Section"}
        toggleable
        className="mb-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700"
      >
        <div className="py-4">
          {content && (
            <div
              className="prose prose-lg mb-8 text-gray-600 dark:text-gray-300 prose-gray dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          )}
          {renderSubsections()}
          {renderItems()}
          {renderOtherProps()}
          {children}
        </div>
      </Panel>
    );
  }

  return sectionContent;
};
