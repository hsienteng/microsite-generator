import React, { useState, useEffect } from "react";
import { Card } from "primereact/card";
import { Avatar } from "primereact/avatar";

interface TestimonialProps {
  text: string;
  author: string;
  company?: string;
  role?: string;
  image?: string;
}

// Layout variants for testimonials
const layoutVariants = {
  variant1: {
    cardClass:
      "mb-6 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 border border-gray-200 dark:border-gray-700",
    containerClass: "p-6",
    quoteIconClass:
      "pi pi-quote-right text-4xl text-primary-600 dark:text-primary-400 opacity-30",
    quoteClass:
      "text-lg text-gray-700 dark:text-gray-300 italic mb-6 leading-relaxed",
    authorContainerClass: "flex items-center gap-4",
    avatarClass: "bg-primary-600 text-white",
    nameClass: "font-semibold text-gray-800 dark:text-gray-200",
    roleClass: "text-sm text-gray-600 dark:text-gray-400",
    companyClass: "text-sm text-primary-600 dark:text-primary-400 font-medium",
  },
  variant2: {
    cardClass:
      "mb-8 shadow-xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border border-gray-200 dark:border-gray-700",
    containerClass: "p-8",
    quoteIconClass:
      "pi pi-quote-left text-5xl text-blue-600 dark:text-blue-400 opacity-40",
    quoteClass:
      "text-xl text-gray-900 dark:text-white font-light mb-8 leading-loose",
    authorContainerClass: "flex items-center gap-6",
    avatarClass:
      "bg-gradient-to-r from-blue-600 to-purple-600 text-white border-2 border-gray-300 dark:border-gray-600",
    nameClass: "font-bold text-gray-900 dark:text-white text-lg",
    roleClass: "text-sm text-blue-600 dark:text-blue-300",
    companyClass: "text-sm text-purple-600 dark:text-purple-400 font-semibold",
  },
  variant3: {
    cardClass:
      "mb-6 shadow-md bg-gray-100 dark:bg-gray-800 border-l-4 border-l-blue-500",
    containerClass: "p-6",
    quoteIconClass:
      "pi pi-quote-right text-3xl text-blue-600 dark:text-blue-400 opacity-50",
    quoteClass:
      "text-base text-gray-700 dark:text-gray-300 mb-4 leading-normal text-right",
    authorContainerClass: "flex items-center gap-3 justify-end",
    avatarClass: "bg-blue-600 text-white border border-blue-500",
    nameClass: "font-semibold text-gray-900 dark:text-white text-right",
    roleClass: "text-xs text-blue-700 dark:text-blue-200 text-right",
    companyClass:
      "text-xs text-blue-600 dark:text-blue-400 font-medium text-right",
  },
  variant4: {
    cardClass:
      "mb-12 shadow-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl",
    containerClass: "p-12 text-center",
    quoteIconClass: "pi pi-quote-left text-2xl text-gray-600 opacity-60",
    quoteClass:
      "text-2xl text-gray-900 dark:text-white font-black mb-8 leading-tight uppercase tracking-wide",
    authorContainerClass: "flex flex-col items-center gap-4",
    avatarClass:
      "bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white border-2 border-gray-400 dark:border-gray-600 ring-2 ring-gray-400 dark:ring-gray-600",
    nameClass:
      "font-light text-gray-900 dark:text-white text-xl uppercase tracking-wider",
    roleClass:
      "text-xs text-gray-600 dark:text-gray-400 uppercase tracking-widest",
    companyClass: "text-xs text-gray-500 font-light uppercase tracking-widest",
  },
};

export const Testimonial: React.FC<TestimonialProps> = ({
  text,
  author,
  company,
  role,
  image,
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
        {/* Quote icon */}
        <div className="mb-4">
          <i className={currentLayout.quoteIconClass}></i>
        </div>

        {/* Testimonial text */}
        <blockquote className={currentLayout.quoteClass}>"{text}"</blockquote>

        {/* Author information */}
        <div className={currentLayout.authorContainerClass}>
          <Avatar
            image={image}
            label={author.charAt(0).toUpperCase()}
            size="large"
            className={currentLayout.avatarClass}
          />
          <div className={selectedVariant === "variant4" ? "mt-2" : ""}>
            <div className={currentLayout.nameClass}>{author}</div>
            {role && <div className={currentLayout.roleClass}>{role}</div>}
            {company && (
              <div className={currentLayout.companyClass}>{company}</div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};
