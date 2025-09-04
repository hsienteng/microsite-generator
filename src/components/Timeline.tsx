import React, { useState, useEffect } from "react";
import { Card } from "primereact/card";
import { Badge } from "primereact/badge";

interface TimelineEvent {
  title: string;
  date: string;
  description: string;
  icon?: string;
}

interface TimelineProps {
  title?: string;
  events: TimelineEvent[];
}

// Layout variants for timeline
const layoutVariants = {
  variant1: {
    cardClass:
      "mb-6 shadow-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800",
    containerClass: "p-6",
    titleClass: "text-2xl font-bold mb-6 text-gray-900 dark:text-white",
    timelineClass: "relative",
    lineClass:
      "absolute left-6 top-0 bottom-0 w-0.5 bg-gray-300 dark:bg-gray-700",
    eventsClass: "space-y-6",
    eventClass: "relative flex items-start",
    dotClass:
      "absolute left-4 w-4 h-4 bg-primary-500 rounded-full border-4 border-white dark:border-gray-900 shadow-lg z-10",
    contentClass: "ml-12 flex-1",
    eventCardClass:
      "bg-gray-50 dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700",
    headerClass: "flex items-center justify-between mb-2",
    eventTitleClass: "text-lg font-semibold text-gray-900 dark:text-white",
    dateClass: "text-sm text-gray-600 dark:text-gray-400",
    iconContainerClass: "mb-2",
    iconClass: "text-primary-600 dark:text-primary-400 text-lg",
    descriptionClass: "text-gray-600 dark:text-gray-300 leading-relaxed",
  },
  variant2: {
    cardClass:
      "mb-8 shadow-xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border border-gray-200 dark:border-gray-700",
    containerClass: "p-8",
    titleClass:
      "text-4xl font-extrabold mb-8 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent",
    timelineClass: "relative",
    lineClass:
      "absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-600 to-purple-600",
    eventsClass: "space-y-8",
    eventClass: "relative flex items-start",
    dotClass:
      "absolute left-6 w-6 h-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full border-4 border-white dark:border-gray-800 shadow-xl z-10",
    contentClass: "ml-16 flex-1",
    eventCardClass:
      "bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-xl p-6 shadow-lg border border-gray-300 dark:border-gray-600 hover:scale-105 transition-all duration-300",
    headerClass: "flex items-center justify-between mb-3",
    eventTitleClass: "text-xl font-bold text-gray-900 dark:text-white",
    dateClass: "text-sm bg-blue-600 text-white px-3 py-1 rounded-lg",
    iconContainerClass: "mb-3",
    iconClass: "text-blue-600 dark:text-blue-400 text-xl",
    descriptionClass: "text-gray-700 dark:text-gray-200 leading-relaxed",
  },
  variant3: {
    cardClass:
      "mb-6 shadow-md bg-gray-100 dark:bg-gray-800 border-l-4 border-l-blue-500",
    containerClass: "p-6",
    titleClass:
      "text-2xl font-bold mb-6 text-right text-gray-900 dark:text-white border-r-4 border-r-blue-500 pr-4",
    timelineClass: "relative",
    lineClass: "absolute right-6 top-0 bottom-0 w-0.5 bg-blue-500",
    eventsClass: "space-y-4",
    eventClass: "relative flex items-start flex-row-reverse",
    dotClass:
      "absolute right-4 w-4 h-4 bg-blue-500 rounded-full border-4 border-white dark:border-gray-800 shadow-lg z-10",
    contentClass: "mr-12 flex-1",
    eventCardClass:
      "bg-gray-200 dark:bg-gray-700 rounded-r-lg p-4 shadow-sm border-l-4 border-l-blue-500 text-right",
    headerClass: "flex items-center justify-between mb-2 flex-row-reverse",
    eventTitleClass: "text-lg font-semibold text-gray-900 dark:text-white",
    dateClass: "text-sm bg-blue-600 text-white px-2 py-1 rounded",
    iconContainerClass: "mb-2 text-right",
    iconClass: "text-blue-600 dark:text-blue-400 text-lg",
    descriptionClass:
      "text-gray-600 dark:text-gray-300 leading-relaxed text-right",
  },
  variant4: {
    cardClass:
      "mb-12 shadow-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl",
    containerClass: "p-12",
    titleClass:
      "text-5xl font-black mb-12 text-center text-gray-900 dark:text-white uppercase tracking-wider",
    timelineClass: "relative",
    lineClass:
      "absolute left-12 top-0 bottom-0 w-2 bg-gray-300 dark:bg-gray-700 rounded-full",
    eventsClass: "space-y-12",
    eventClass: "relative flex items-start",
    dotClass:
      "absolute left-8 w-8 h-8 bg-gray-400 dark:bg-gray-600 rounded-full border-4 border-white dark:border-gray-800 shadow-lg z-10 ring-2 ring-gray-400 dark:ring-gray-600",
    contentClass: "ml-24 flex-1",
    eventCardClass:
      "bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-200 dark:border-gray-700",
    headerClass: "flex flex-col items-start mb-4",
    eventTitleClass:
      "text-2xl font-black text-gray-900 dark:text-white uppercase tracking-wide mb-2",
    dateClass:
      "text-xs bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white px-2 py-1 rounded uppercase tracking-widest",
    iconContainerClass: "mb-4",
    iconClass: "text-gray-500 dark:text-gray-400 text-2xl",
    descriptionClass: "text-gray-600 dark:text-gray-400 leading-loose text-sm",
  },
};

export const Timeline: React.FC<TimelineProps> = ({
  title = "Timeline",
  events = [],
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
        <div className={currentLayout.timelineClass}>
          {/* Timeline line */}
          <div className={currentLayout.lineClass}></div>

          <div className={currentLayout.eventsClass}>
            {events.map((event, index) => (
              <div key={index} className={currentLayout.eventClass}>
                {/* Timeline dot */}
                <div className={currentLayout.dotClass}></div>

                {/* Content */}
                <div className={currentLayout.contentClass}>
                  <div className={currentLayout.eventCardClass}>
                    <div className={currentLayout.headerClass}>
                      <h3 className={currentLayout.eventTitleClass}>
                        {event.title}
                      </h3>
                      {selectedVariant === "variant4" ? (
                        <div className={currentLayout.dateClass}>
                          {event.date}
                        </div>
                      ) : (
                        <Badge
                          value={event.date}
                          severity="info"
                          className={currentLayout.dateClass}
                        />
                      )}
                    </div>
                    {event.icon && (
                      <div className={currentLayout.iconContainerClass}>
                        <i
                          className={`pi ${event.icon} ${currentLayout.iconClass}`}
                        ></i>
                      </div>
                    )}
                    <p className={currentLayout.descriptionClass}>
                      {event.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};
