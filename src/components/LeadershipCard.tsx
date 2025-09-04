import React, { useState, useEffect } from "react";
import { Button } from "primereact/button";

interface LeadershipCardProps {
  name?: string;
  title?: string;
  bio?: string;
  image?: string;
  email?: string;
  linkedin?: string;
}

// Layout variants for leadership cards
const layoutVariants = {
  variant1: {
    cardClass:
      "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-800 rounded-lg p-8 shadow-lg h-full mb-6",
    headerClass: "text-center mb-8",
    imageClass:
      "w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-gray-300 dark:border-gray-700",
    placeholderClass:
      "w-32 h-32 rounded-full mx-auto mb-4 bg-gray-200 dark:bg-gray-700 flex items-center justify-center",
    nameClass: "text-xl font-bold text-gray-900 dark:text-white mb-2",
    titleClass:
      "inline-block bg-red-600 text-white px-3 py-1 rounded text-sm font-medium",
    bioClass:
      "text-gray-600 dark:text-gray-300 text-center leading-relaxed mb-6",
    contactClass:
      "flex justify-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-800",
    buttonClass:
      "p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors",
  },
  variant2: {
    cardClass:
      "bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-10 shadow-xl h-full mb-8 hover:scale-105 transition-all duration-300",
    headerClass: "text-center mb-10",
    imageClass:
      "w-40 h-40 rounded-full mx-auto mb-6 object-cover border-4 border-blue-500 shadow-lg",
    placeholderClass:
      "w-40 h-40 rounded-full mx-auto mb-6 bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center",
    nameClass: "text-2xl font-black text-gray-900 dark:text-white mb-3",
    titleClass:
      "inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg text-base font-semibold shadow-lg",
    bioClass:
      "text-gray-700 dark:text-gray-200 text-center leading-loose mb-8 text-lg",
    contactClass:
      "flex justify-center gap-4 pt-6 border-t border-gray-300 dark:border-gray-600",
    buttonClass:
      "p-3 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors hover:scale-110 transform",
  },
  variant3: {
    cardClass:
      "bg-gray-100 dark:bg-gray-800 border-l-4 border-l-blue-500 rounded-r-lg p-8 shadow-md h-full mb-6 hover:shadow-lg transition-shadow",
    headerClass: "text-right mb-8",
    imageClass:
      "w-28 h-28 rounded-full ml-auto mb-4 object-cover border-4 border-blue-500",
    placeholderClass:
      "w-28 h-28 rounded-full ml-auto mb-4 bg-blue-600 flex items-center justify-center",
    nameClass:
      "text-lg font-bold text-gray-900 dark:text-white mb-2 text-right",
    titleClass:
      "inline-block bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium",
    bioClass:
      "text-gray-600 dark:text-gray-300 text-right leading-relaxed mb-6",
    contactClass: "flex justify-end gap-3 pt-4 border-t border-blue-500/20",
    buttonClass:
      "p-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors",
  },
  variant4: {
    cardClass:
      "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-12 shadow-sm h-full mb-12",
    headerClass: "text-center mb-12",
    imageClass:
      "w-36 h-36 rounded-full mx-auto mb-8 object-cover border-4 border-gray-300 dark:border-gray-600 ring-2 ring-gray-300 dark:ring-gray-600",
    placeholderClass:
      "w-36 h-36 rounded-full mx-auto mb-8 bg-gray-200 dark:bg-gray-700 flex items-center justify-center ring-2 ring-gray-300 dark:ring-gray-600",
    nameClass:
      "text-3xl font-black text-gray-900 dark:text-white mb-4 uppercase tracking-wide",
    titleClass:
      "inline-block bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white px-2 py-1 rounded text-xs font-light uppercase tracking-widest",
    bioClass:
      "text-gray-600 dark:text-gray-400 text-center leading-loose mb-8 text-sm",
    contactClass:
      "flex justify-center gap-6 pt-8 border-t border-gray-200 dark:border-gray-700",
    buttonClass:
      "p-3 text-gray-500 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors",
  },
};

export const LeadershipCard: React.FC<LeadershipCardProps> = ({
  name = "Leadership Member",
  title = "Position",
  bio = "No bio available",
  image,
  email,
  linkedin,
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
    <div className={currentLayout.cardClass}>
      <div className={currentLayout.headerClass}>
        {image ? (
          <img src={image} alt={name} className={currentLayout.imageClass} />
        ) : (
          <div className={currentLayout.placeholderClass}>
            <i className="pi pi-user text-4xl text-gray-600 dark:text-gray-400"></i>
          </div>
        )}
        <h3 className={currentLayout.nameClass}>{name}</h3>
        <div className={currentLayout.titleClass}>{title}</div>
      </div>

      <div className={currentLayout.bioClass}>
        <div dangerouslySetInnerHTML={{ __html: bio }} />
      </div>

      {(email || linkedin) && (
        <div className={currentLayout.contactClass}>
          {email && (
            <Button
              onClick={() => window.open(`mailto:${email}`)}
              className={currentLayout.buttonClass}
            >
              <i className="pi pi-envelope text-lg"></i>
            </Button>
          )}
          {linkedin && (
            <Button
              onClick={() => window.open(linkedin, "_blank")}
              className={currentLayout.buttonClass}
            >
              <i className="pi pi-linkedin text-lg"></i>
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
