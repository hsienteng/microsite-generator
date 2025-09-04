import React, { useState, useEffect } from "react";
import { Card } from "primereact/card";
import { Badge } from "primereact/badge";

interface Award {
  name?: string;
  title?: string;
  organization?: string;
  year?: string;
  description?: string;
  // Handle string awards as well
  [key: string]: any;
}

interface AwardListProps {
  title?: string;
  awards?: Award[] | string[];
}

// Layout variants for award lists
const layoutVariants = {
  variant1: {
    containerClass: "py-8 bg-white dark:bg-black",
    titleClass: "text-2xl font-bold mb-6 text-gray-900 dark:text-white",
    gridClass: "grid md:grid-cols-2 lg:grid-cols-3 gap-6",
    cardClass:
      "shadow-lg h-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800",
    contentClass: "p-6 text-center",
    iconClass: "pi pi-star text-4xl text-yellow-500 dark:text-yellow-400 mb-4",
    nameClass: "font-bold text-lg mb-2 text-gray-900 dark:text-white",
    badgeClass: "mb-2",
    yearClass: "text-gray-600 dark:text-gray-300 text-sm mb-2",
    descriptionClass: "text-gray-600 dark:text-gray-300 text-sm",
  },
  variant2: {
    containerClass: "py-12 bg-white dark:bg-black",
    titleClass:
      "text-4xl font-extrabold mb-10 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent",
    gridClass: "grid md:grid-cols-2 gap-8",
    cardClass:
      "shadow-xl h-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:scale-105 transition-all duration-300",
    contentClass: "p-8 text-center",
    iconClass: "pi pi-star text-5xl text-yellow-500 dark:text-yellow-300 mb-6",
    nameClass: "font-black text-xl mb-3 text-gray-900 dark:text-white",
    badgeClass: "mb-3 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm",
    yearClass: "text-gray-700 dark:text-gray-200 text-base mb-3",
    descriptionClass:
      "text-gray-700 dark:text-gray-200 text-sm leading-relaxed",
  },
  variant3: {
    containerClass: "py-10 bg-white dark:bg-black",
    titleClass:
      "text-2xl font-bold mb-8 text-right text-gray-900 dark:text-white border-r-4 border-r-blue-500 pr-4",
    gridClass: "grid md:grid-cols-1 gap-4",
    cardClass:
      "shadow-md h-full bg-gray-100 dark:bg-gray-800 border-l-4 border-l-blue-500 rounded-r-lg hover:shadow-lg transition-shadow",
    contentClass: "p-6 flex items-center gap-6",
    iconClass:
      "pi pi-star text-3xl text-yellow-500 dark:text-yellow-400 flex-shrink-0",
    nameClass: "font-bold text-lg text-gray-900 dark:text-white",
    badgeClass: "bg-blue-600 text-white px-3 py-1 rounded text-xs",
    yearClass: "text-gray-600 dark:text-gray-300 text-sm",
    descriptionClass: "text-gray-600 dark:text-gray-300 text-sm mt-2",
  },
  variant4: {
    containerClass: "py-16 bg-white dark:bg-black",
    titleClass:
      "text-5xl font-black mb-16 text-center text-gray-900 dark:text-white uppercase tracking-wider",
    gridClass: "grid md:grid-cols-4 gap-12",
    cardClass:
      "shadow-sm h-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl",
    contentClass: "p-12 text-center",
    iconClass: "pi pi-star text-6xl text-yellow-500 mb-8",
    nameClass:
      "font-light text-xl mb-4 text-gray-900 dark:text-white uppercase tracking-wide",
    badgeClass:
      "bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white px-2 py-1 rounded text-xs uppercase tracking-widest",
    yearClass:
      "text-gray-600 dark:text-gray-400 text-xs mb-4 uppercase tracking-widest",
    descriptionClass: "text-gray-600 dark:text-gray-400 text-xs leading-loose",
  },
};

export const AwardList: React.FC<AwardListProps> = ({
  title = "Awards & Recognition",
  awards = [],
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

  // Normalize awards to handle both object and string formats
  const normalizedAwards = awards.map((award) => {
    if (typeof award === "string") {
      return { name: award, organization: "Award" };
    }
    return {
      name: award.name || award.title || "Award",
      organization: award.organization || "Organization",
      year: award.year,
      description: award.description,
    };
  });

  return (
    <div className={currentLayout.containerClass}>
      <h3 className={currentLayout.titleClass}>{title}</h3>
      <div className={currentLayout.gridClass}>
        {normalizedAwards.map((award, index) => (
          <Card key={index} className={currentLayout.cardClass}>
            <div className={currentLayout.contentClass}>
              <i className={currentLayout.iconClass}></i>
              {selectedVariant === "variant3" ? (
                <div className="flex-1">
                  <h4 className={currentLayout.nameClass}>{award.name}</h4>
                  <div className={currentLayout.badgeClass}>
                    {award.organization}
                  </div>
                  {award.year && (
                    <div className={currentLayout.yearClass}>{award.year}</div>
                  )}
                  {award.description && (
                    <p className={currentLayout.descriptionClass}>
                      {award.description}
                    </p>
                  )}
                </div>
              ) : (
                <>
                  <h4 className={currentLayout.nameClass}>{award.name}</h4>
                  {selectedVariant === "variant2" ? (
                    <div className={currentLayout.badgeClass}>
                      {award.organization}
                    </div>
                  ) : (
                    <Badge
                      value={award.organization}
                      severity="info"
                      className={currentLayout.badgeClass}
                    />
                  )}
                  {award.year && (
                    <div className={currentLayout.yearClass}>{award.year}</div>
                  )}
                  {award.description && (
                    <p className={currentLayout.descriptionClass}>
                      {award.description}
                    </p>
                  )}
                </>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
