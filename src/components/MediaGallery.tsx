import React, { useState, useEffect } from "react";

interface MediaItem {
  src: string;
  alt?: string;
  caption?: string;
}

interface MediaGalleryProps {
  title?: string;
  description?: string;
  items?: MediaItem[];
}

// Layout variants for media gallery
const layoutVariants = {
  variant1: {
    sectionClass: "bg-white dark:bg-black py-12 px-8",
    containerClass: "max-w-6xl mx-auto",
    titleClass: "text-3xl font-bold text-gray-900 dark:text-white mb-3",
    descriptionClass: "text-gray-600 dark:text-gray-300 mb-8",
    gridClass: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4",
    figureClass:
      "bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded overflow-hidden",
    imageClass: "w-full h-40 object-cover",
    captionClass: "text-xs text-gray-600 dark:text-gray-400 p-2",
  },
  variant2: {
    sectionClass: "bg-white dark:bg-black py-16 px-8",
    containerClass: "max-w-6xl mx-auto",
    titleClass:
      "text-5xl font-extrabold text-center text-gray-900 dark:text-white mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent",
    descriptionClass:
      "text-gray-700 dark:text-gray-200 mb-12 text-center text-lg",
    gridClass: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8",
    figureClass:
      "bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-lg hover:scale-105 transition-all duration-300",
    imageClass: "w-full h-48 object-cover",
    captionClass: "text-sm text-gray-700 dark:text-gray-200 p-4",
  },
  variant3: {
    sectionClass: "bg-white dark:bg-black py-10 px-8",
    containerClass: "max-w-6xl mx-auto",
    titleClass:
      "text-3xl font-bold text-right text-gray-900 dark:text-white mb-3 border-r-4 border-r-blue-500 pr-4",
    descriptionClass: "text-gray-600 dark:text-gray-300 mb-8 text-right",
    gridClass: "grid grid-cols-1 md:grid-cols-2 gap-6",
    figureClass:
      "bg-gray-100 dark:bg-gray-800 border-l-4 border-l-blue-500 rounded-r-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow",
    imageClass: "w-full h-44 object-cover",
    captionClass: "text-xs text-gray-600 dark:text-gray-300 p-3 text-right",
  },
  variant4: {
    sectionClass: "bg-white dark:bg-black py-20 px-8",
    containerClass: "max-w-6xl mx-auto",
    titleClass:
      "text-6xl font-black text-center text-gray-900 dark:text-white mb-8 uppercase tracking-wider",
    descriptionClass:
      "text-gray-600 dark:text-gray-400 mb-16 text-center text-sm uppercase tracking-widest",
    gridClass: "grid grid-cols-1 md:grid-cols-2 gap-12",
    figureClass:
      "bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden shadow-sm",
    imageClass: "w-full h-64 object-cover",
    captionClass: "text-xs text-gray-600 dark:text-gray-400 p-6 leading-loose",
  },
};

export const MediaGallery: React.FC<MediaGalleryProps> = ({
  title = "Gallery",
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

  const safeItems: MediaItem[] = Array.isArray(items)
    ? items.filter((m) => m && m.src)
    : [];
  return (
    <section className={currentLayout.sectionClass}>
      <div className={currentLayout.containerClass}>
        {title && <h2 className={currentLayout.titleClass}>{title}</h2>}
        {description && (
          <p className={currentLayout.descriptionClass}>{description}</p>
        )}
        <div className={currentLayout.gridClass}>
          {safeItems.map((m, idx) => (
            <figure key={idx} className={currentLayout.figureClass}>
              <img
                src={m?.src}
                alt={m?.alt || ""}
                className={currentLayout.imageClass}
              />
              {m?.caption && (
                <figcaption className={currentLayout.captionClass}>
                  {m?.caption}
                </figcaption>
              )}
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};
