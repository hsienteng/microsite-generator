import React, { useState, useEffect } from "react";
import { Card } from "primereact/card";
import { Badge } from "primereact/badge";

interface CollaborationProps {
  title?: string;
  content?: string;
  description?: string;
  partners?: string[];
  examples?: (string | { partnership?: string; benefits?: string })[];
  internal_collaboration?: string;
  client_collaboration?: string;
  internalCollaboration?: string;
  clientCollaboration?: string;
}

// Layout variants for collaboration
const layoutVariants = {
  variant1: {
    cardClass:
      "mb-6 shadow-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800",
    containerClass: "p-6",
    titleClass: "text-2xl font-bold mb-4 text-gray-900 dark:text-white",
    contentClass: "mb-6",
    contentTextClass: "text-gray-600 dark:text-gray-300 leading-relaxed",
    sectionClass: "mb-6",
    sectionTitleClass:
      "text-lg font-semibold mb-3 text-gray-900 dark:text-white",
    partnersContainerClass: "flex flex-wrap gap-2",
    badgeClass: "text-sm",
    examplesContainerClass: "space-y-3",
    exampleStringClass:
      "bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-3 rounded-lg",
    exampleObjectClass:
      "bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 rounded-lg",
    exampleTextClass: "text-gray-600 dark:text-gray-300",
    partnershipTitleClass: "font-semibold text-gray-900 dark:text-white mb-2",
    benefitsTextClass: "text-gray-600 dark:text-gray-300 text-sm",
    collaborationGridClass: "grid grid-cols-1 md:grid-cols-2 gap-6",
    collaborationItemClass:
      "bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 rounded-lg",
    collaborationTitleClass: "font-semibold text-gray-900 dark:text-white mb-2",
    collaborationTextClass: "text-gray-600 dark:text-gray-300 text-sm",
  },
  variant2: {
    cardClass:
      "mb-8 shadow-xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl",
    containerClass: "p-8",
    titleClass:
      "text-4xl font-extrabold mb-6 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent",
    contentClass: "mb-8",
    contentTextClass:
      "text-gray-700 dark:text-gray-200 leading-loose text-center text-lg",
    sectionClass: "mb-8",
    sectionTitleClass:
      "text-2xl font-bold mb-4 text-gray-900 dark:text-white text-center",
    partnersContainerClass: "flex flex-wrap gap-3 justify-center",
    badgeClass:
      "text-base px-4 py-2 bg-blue-600 text-white rounded-lg shadow-lg",
    examplesContainerClass: "space-y-6",
    exampleStringClass:
      "bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 border border-gray-300 dark:border-gray-600 p-6 rounded-xl shadow-lg hover:scale-105 transition-all duration-300",
    exampleObjectClass:
      "bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 border border-gray-300 dark:border-gray-600 p-6 rounded-xl shadow-lg hover:scale-105 transition-all duration-300",
    exampleTextClass: "text-gray-800 dark:text-gray-200 text-center",
    partnershipTitleClass:
      "font-bold text-gray-900 dark:text-white mb-3 text-xl text-center",
    benefitsTextClass: "text-gray-700 dark:text-gray-200 text-base text-center",
    collaborationGridClass: "grid grid-cols-1 md:grid-cols-2 gap-8",
    collaborationItemClass:
      "bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 border border-gray-300 dark:border-gray-600 p-6 rounded-xl shadow-lg text-center",
    collaborationTitleClass:
      "font-bold text-gray-900 dark:text-white mb-3 text-xl",
    collaborationTextClass: "text-gray-700 dark:text-gray-200 text-base",
  },
  variant3: {
    cardClass:
      "mb-6 shadow-md bg-gray-100 dark:bg-gray-800 border-l-4 border-l-blue-500 rounded-r-lg",
    containerClass: "p-6",
    titleClass:
      "text-2xl font-bold mb-4 text-right text-gray-900 dark:text-white border-r-4 border-r-blue-500 pr-4",
    contentClass: "mb-6",
    contentTextClass:
      "text-gray-600 dark:text-gray-300 leading-relaxed text-right",
    sectionClass: "mb-6",
    sectionTitleClass:
      "text-lg font-semibold mb-3 text-gray-900 dark:text-white text-right",
    partnersContainerClass: "flex flex-wrap gap-2 justify-end",
    badgeClass: "text-sm bg-blue-600 text-white px-3 py-1 rounded",
    examplesContainerClass: "space-y-4",
    exampleStringClass:
      "bg-gray-50 dark:bg-gray-700 border-r-4 border-r-blue-500 p-4 rounded-l-lg shadow-md hover:shadow-lg transition-shadow",
    exampleObjectClass:
      "bg-gray-50 dark:bg-gray-700 border-r-4 border-r-blue-500 p-4 rounded-l-lg shadow-md hover:shadow-lg transition-shadow",
    exampleTextClass: "text-gray-600 dark:text-gray-300 text-right",
    partnershipTitleClass:
      "font-semibold text-gray-900 dark:text-white mb-2 text-right",
    benefitsTextClass: "text-gray-600 dark:text-gray-300 text-sm text-right",
    collaborationGridClass: "grid grid-cols-1 md:grid-cols-2 gap-4",
    collaborationItemClass:
      "bg-gray-50 dark:bg-gray-700 border-r-4 border-r-blue-500 p-4 rounded-l-lg",
    collaborationTitleClass:
      "font-semibold text-gray-900 dark:text-white mb-2 text-right",
    collaborationTextClass:
      "text-gray-600 dark:text-gray-300 text-sm text-right",
  },
  variant4: {
    cardClass:
      "mb-12 shadow-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl",
    containerClass: "p-12",
    titleClass:
      "text-5xl font-black mb-8 text-center text-gray-900 dark:text-white uppercase tracking-wider",
    contentClass: "mb-12",
    contentTextClass:
      "text-gray-600 dark:text-gray-400 leading-loose text-center text-sm uppercase tracking-widest",
    sectionClass: "mb-12",
    sectionTitleClass:
      "text-3xl font-light mb-6 text-gray-900 dark:text-white text-center uppercase tracking-wide",
    partnersContainerClass: "flex flex-wrap gap-4 justify-center",
    badgeClass:
      "text-xs bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white px-2 py-1 rounded uppercase tracking-widest",
    examplesContainerClass: "space-y-8",
    exampleStringClass:
      "bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-8 rounded-2xl text-center",
    exampleObjectClass:
      "bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-8 rounded-2xl text-center",
    exampleTextClass: "text-gray-600 dark:text-gray-400 text-sm leading-loose",
    partnershipTitleClass:
      "font-light text-gray-900 dark:text-white mb-4 text-2xl uppercase tracking-wide",
    benefitsTextClass: "text-gray-600 dark:text-gray-400 text-xs leading-loose",
    collaborationGridClass: "grid grid-cols-1 md:grid-cols-2 gap-12",
    collaborationItemClass:
      "bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-8 rounded-2xl text-center",
    collaborationTitleClass:
      "font-light text-gray-900 dark:text-white mb-4 text-xl uppercase tracking-wider",
    collaborationTextClass:
      "text-gray-600 dark:text-gray-400 text-xs leading-loose",
  },
};

export const Collaboration: React.FC<CollaborationProps> = ({
  title,
  content,
  description,
  partners = [],
  examples = [],
  internal_collaboration,
  client_collaboration,
  internalCollaboration,
  clientCollaboration,
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

  // Use description as fallback for content
  const displayContent = content || description;
  const displayTitle = title || "Collaboration";

  // Use snake_case versions as fallback
  const displayInternalCollaboration =
    internalCollaboration || internal_collaboration;
  const displayClientCollaboration =
    clientCollaboration || client_collaboration;
  return (
    <Card className={currentLayout.cardClass}>
      <div className={currentLayout.containerClass}>
        <h2 className={currentLayout.titleClass}>{displayTitle}</h2>

        {/* Main content */}
        {displayContent && (
          <div className={currentLayout.contentClass}>
            <p className={currentLayout.contentTextClass}>{displayContent}</p>
          </div>
        )}

        {/* Partners section */}
        {partners.length > 0 && (
          <div className={currentLayout.sectionClass}>
            <h3 className={currentLayout.sectionTitleClass}>Our Partners</h3>
            <div className={currentLayout.partnersContainerClass}>
              {partners.map((partner, index) =>
                selectedVariant === "variant2" ||
                selectedVariant === "variant3" ||
                selectedVariant === "variant4" ? (
                  <div key={index} className={currentLayout.badgeClass}>
                    {partner}
                  </div>
                ) : (
                  <Badge
                    key={index}
                    value={partner}
                    severity="info"
                    className={currentLayout.badgeClass}
                  />
                )
              )}
            </div>
          </div>
        )}

        {/* Examples section */}
        {examples.length > 0 && (
          <div className={currentLayout.sectionClass}>
            <h3 className={currentLayout.sectionTitleClass}>
              Partnership Examples
            </h3>
            <div className={currentLayout.examplesContainerClass}>
              {examples.map((example, index) => {
                if (typeof example === "string") {
                  return (
                    <div
                      key={index}
                      className={currentLayout.exampleStringClass}
                    >
                      <p className={currentLayout.exampleTextClass}>
                        {example}
                      </p>
                    </div>
                  );
                } else if (example && typeof example === "object") {
                  return (
                    <div
                      key={index}
                      className={currentLayout.exampleObjectClass}
                    >
                      {example.partnership && (
                        <h4 className={currentLayout.partnershipTitleClass}>
                          {example.partnership}
                        </h4>
                      )}
                      {example.benefits && (
                        <p className={currentLayout.benefitsTextClass}>
                          {example.benefits}
                        </p>
                      )}
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </div>
        )}

        {/* Collaboration types */}
        <div className={currentLayout.collaborationGridClass}>
          {displayInternalCollaboration && (
            <div className={currentLayout.collaborationItemClass}>
              <h4 className={currentLayout.collaborationTitleClass}>
                Internal Collaboration
              </h4>
              <p className={currentLayout.collaborationTextClass}>
                {displayInternalCollaboration}
              </p>
            </div>
          )}

          {displayClientCollaboration && (
            <div className={currentLayout.collaborationItemClass}>
              <h4 className={currentLayout.collaborationTitleClass}>
                Client Collaboration
              </h4>
              <p className={currentLayout.collaborationTextClass}>
                {displayClientCollaboration}
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
