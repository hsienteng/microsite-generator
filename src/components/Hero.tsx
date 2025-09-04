import React, { useState, useEffect } from "react";
import { Badge } from "primereact/badge";

interface HeroProps {
  title?: string;
  subtitle?: string;
  description?: string;
  backgroundImage?: string;
}

// Layout variants for hero sections
const layoutVariants = {
  variant1: {
    containerClass: "relative py-16 px-8",
    contentClass: "max-w-6xl mx-auto text-center",
    titleClass: "text-4xl md:text-6xl font-bold mb-4",
    subtitleClass:
      "inline-block text-lg mb-6 bg-red-600 text-white px-4 py-2 rounded font-medium",
    descriptionClass: "text-lg opacity-90 max-w-3xl mx-auto leading-relaxed",
  },
  variant2: {
    containerClass: "relative py-20 px-8",
    contentClass: "max-w-6xl mx-auto text-left",
    titleClass:
      "text-5xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent",
    subtitleClass:
      "inline-block text-xl mb-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold shadow-lg",
    descriptionClass:
      "text-xl opacity-95 max-w-4xl leading-loose text-gray-300",
  },
  variant3: {
    containerClass: "relative py-24 px-8",
    contentClass: "max-w-6xl mx-auto text-right",
    titleClass:
      "text-3xl md:text-5xl font-bold mb-6 border-r-4 border-r-blue-500 pr-6",
    subtitleClass:
      "inline-block text-base mb-6 bg-blue-600 text-white px-3 py-2 rounded-sm font-medium uppercase tracking-wider",
    descriptionClass: "text-base opacity-85 max-w-2xl ml-auto leading-relaxed",
  },
  variant4: {
    containerClass: "relative py-32 px-8",
    contentClass:
      "max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-8",
    titleClass: "text-6xl md:text-8xl font-black mb-4 text-center md:text-left",
    subtitleClass:
      "inline-block text-sm mb-4 bg-gray-800 text-white px-2 py-1 rounded font-light uppercase tracking-widest",
    descriptionClass:
      "text-lg opacity-80 max-w-lg leading-normal text-center md:text-left",
  },
};

export const Hero: React.FC<HeroProps> = ({
  title = "Default Title",
  subtitle,
  description,
  backgroundImage,
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
        !backgroundImage
          ? "bg-white dark:bg-black text-gray-900 dark:text-white"
          : "bg-white text-black"
      }`}
      style={
        backgroundImage
          ? {
              backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${backgroundImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : {}
      }
    >
      <div className={currentLayout.contentClass}>
        {selectedVariant === "variant4" ? (
          <>
            <div className="flex-1">
              <h1 className={currentLayout.titleClass}>{title}</h1>
              {subtitle && (
                <div className={currentLayout.subtitleClass}>{subtitle}</div>
              )}
            </div>
            {description && (
              <div className="flex-1">
                <p className={currentLayout.descriptionClass}>{description}</p>
              </div>
            )}
          </>
        ) : (
          <>
            <h1 className={currentLayout.titleClass}>{title}</h1>
            {subtitle && (
              <div className={currentLayout.subtitleClass}>{subtitle}</div>
            )}
            {description && (
              <p className={currentLayout.descriptionClass}>{description}</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};
