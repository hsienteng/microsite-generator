import React, { useState, useEffect } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";

interface CTASectionProps {
  title: string;
  description: string;
  buttonText?: string;
  buttonLink?: string;
  contactInfo?: Record<string, string>;
}

// Layout variants for CTA sections
const layoutVariants = {
  variant1: {
    cardClass: "mb-6 shadow-lg bg-primary-600 dark:bg-black text-white",
    containerClass: "p-8 text-center",
    titleClass: "text-3xl font-bold mb-4",
    descriptionClass:
      "text-lg opacity-90 mb-6 max-w-2xl mx-auto leading-relaxed",
    buttonsClass: "flex flex-col sm:flex-row gap-4 justify-center mb-6",
    buttonClass: "p-button-outlined p-button-white",
    contactClass: "border-t border-white/20 pt-6",
    contactTitleClass: "text-lg font-semibold mb-4",
    contactGridClass:
      "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm",
    contactItemClass: "flex items-center justify-center gap-2",
    contactIconClass: "pi pi-info-circle text-primary-200",
  },
  variant2: {
    cardClass:
      "mb-8 shadow-xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700",
    containerClass: "p-12 text-center",
    titleClass:
      "text-5xl font-extrabold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent",
    descriptionClass:
      "text-xl opacity-95 mb-8 max-w-3xl mx-auto leading-loose text-gray-700 dark:text-gray-200",
    buttonsClass: "flex flex-col sm:flex-row gap-6 justify-center mb-8",
    buttonClass:
      "p-button-outlined hover:scale-105 transition-all duration-300 shadow-lg",
    contactClass: "border-t border-gray-300 dark:border-gray-600 pt-8",
    contactTitleClass:
      "text-2xl font-bold mb-6 text-blue-600 dark:text-blue-300",
    contactGridClass: "grid grid-cols-1 sm:grid-cols-2 gap-6",
    contactItemClass:
      "flex items-center justify-center gap-3 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg",
    contactIconClass:
      "pi pi-info-circle text-blue-600 dark:text-blue-400 text-lg",
  },
  variant3: {
    cardClass:
      "mb-6 shadow-md bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border-l-4 border-l-blue-500",
    containerClass: "p-8 text-right",
    titleClass: "text-3xl font-bold mb-4 border-r-4 border-r-blue-500 pr-4",
    descriptionClass:
      "text-lg opacity-90 mb-6 max-w-2xl ml-auto leading-relaxed text-right",
    buttonsClass: "flex flex-col sm:flex-row gap-4 justify-end mb-6",
    buttonClass:
      "p-button-outlined border-blue-500 text-blue-600 dark:text-blue-400 hover:bg-blue-500",
    contactClass: "border-t border-blue-500/20 pt-6",
    contactTitleClass:
      "text-lg font-semibold mb-4 text-right text-blue-600 dark:text-blue-300",
    contactGridClass: "grid grid-cols-1 gap-3 text-sm",
    contactItemClass: "flex items-center justify-end gap-2",
    contactIconClass: "pi pi-info-circle text-blue-600 dark:text-blue-400",
  },
  variant4: {
    cardClass:
      "mb-12 shadow-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-2xl",
    containerClass: "p-16 text-center",
    titleClass: "text-6xl font-black mb-8 uppercase tracking-wider",
    descriptionClass:
      "text-sm opacity-80 mb-12 max-w-lg mx-auto leading-loose text-gray-600 dark:text-gray-400 uppercase tracking-widest",
    buttonsClass: "flex flex-col gap-8 justify-center mb-12",
    buttonClass:
      "p-button-outlined p-button-lg border-gray-400 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700",
    contactClass: "border-t border-gray-300 dark:border-gray-700 pt-12",
    contactTitleClass:
      "text-xl font-light mb-8 uppercase tracking-widest text-gray-600 dark:text-gray-400",
    contactGridClass: "grid grid-cols-1 gap-6",
    contactItemClass:
      "flex flex-col items-center gap-2 p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl",
    contactIconClass: "pi pi-info-circle text-gray-500 text-2xl",
  },
};

export const CTASection: React.FC<CTASectionProps> = ({
  title,
  description,
  buttonText,
  buttonLink,
  contactInfo = {},
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
    <Card className={currentLayout.cardClass}>
      <div className={currentLayout.containerClass}>
        <h2 className={currentLayout.titleClass}>{title}</h2>
        <p className={currentLayout.descriptionClass}>{description}</p>

        {/* Action buttons */}
        <div className={currentLayout.buttonsClass}>
          {buttonText && buttonLink && (
            <Button
              label={buttonText}
              icon="pi pi-external-link"
              className={currentLayout.buttonClass}
              onClick={() => window.open(buttonLink, "_blank")}
            />
          )}
          <Button
            label="Contact Us"
            icon="pi pi-envelope"
            className={currentLayout.buttonClass}
            onClick={() => {
              const email = contactInfo.email || "contact@company.com";
              window.open(`mailto:${email}`, "_blank");
            }}
          />
        </div>

        {/* Contact information */}
        {Object.keys(contactInfo).length > 0 && (
          <div className={currentLayout.contactClass}>
            <h3 className={currentLayout.contactTitleClass}>Get in Touch</h3>
            <div className={currentLayout.contactGridClass}>
              {Object.entries(contactInfo).map(([key, value]) => (
                <div key={key} className={currentLayout.contactItemClass}>
                  <i className={currentLayout.contactIconClass}></i>
                  <span className="capitalize">{key}:</span>
                  <span className="font-medium">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
