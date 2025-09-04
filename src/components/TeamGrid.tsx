import React, { useState, useEffect } from "react";
import { Card } from "primereact/card";
import { Avatar } from "primereact/avatar";

interface TeamMember {
  name: string;
  title: string;
  bio: string;
  image?: string;
  email?: string;
  linkedin?: string;
}

interface TeamGridProps {
  title?: string;
  members: TeamMember[];
}

// Layout variants for team member cards
const layoutVariants = {
  variant1: {
    cardClass:
      "bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow",
    avatarSection: "text-center mb-4",
    avatarClass:
      "bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 mb-3",
    nameClass: "text-lg font-semibold text-gray-900 dark:text-white mb-1",
    titleClass: "text-gray-600 dark:text-gray-300 font-medium mb-3",
    bioClass: "text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4",
    contactClass: "flex justify-center gap-3",
  },
  variant2: {
    cardClass:
      "bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105",
    avatarSection: "flex items-center mb-4",
    avatarClass:
      "bg-gradient-to-r from-blue-600 to-purple-600 text-white border-2 border-gray-300 dark:border-gray-600 mr-4",
    nameClass: "text-xl font-bold text-gray-900 dark:text-white mb-1",
    titleClass: "text-blue-600 dark:text-blue-300 font-semibold mb-2",
    bioClass: "text-gray-700 dark:text-gray-200 text-sm leading-relaxed mb-4",
    contactClass: "flex justify-start gap-3",
  },
  variant3: {
    cardClass:
      "bg-gray-100 dark:bg-gray-800 border-l-4 border-l-blue-500 rounded-r-lg p-6 shadow-md hover:shadow-lg transition-shadow hover:border-l-blue-400",
    avatarSection: "text-right mb-4",
    avatarClass: "bg-blue-600 text-white border border-blue-500 mb-3",
    nameClass:
      "text-lg font-semibold text-gray-900 dark:text-white mb-1 text-right",
    titleClass: "text-blue-700 dark:text-blue-200 font-medium mb-3 text-right",
    bioClass:
      "text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4 text-justify",
    contactClass: "flex justify-end gap-3",
  },
  variant4: {
    cardClass:
      "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-8 shadow-sm hover:shadow-md transition-all",
    avatarSection: "text-center mb-6",
    avatarClass:
      "bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white border-2 border-gray-400 dark:border-gray-600 mb-4 ring-2 ring-gray-400 dark:ring-gray-600",
    nameClass: "text-2xl font-bold text-gray-900 dark:text-white mb-2",
    titleClass:
      "text-gray-600 dark:text-gray-400 font-light mb-4 uppercase tracking-wide text-xs",
    bioClass: "text-gray-600 dark:text-gray-300 text-sm leading-loose mb-6",
    contactClass: "flex justify-center gap-4",
  },
};

export const TeamGrid: React.FC<TeamGridProps> = ({
  title = "Our Team",
  members = [],
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

  // If no members and no meaningful title, don't render
  if (members.length === 0 && (!title || title === "Our Team")) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-black py-12 px-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white text-center">
          {title}
        </h2>

        {members.length === 0 ? (
          <div className="text-center py-8 text-gray-600 dark:text-gray-400">
            <i className="pi pi-users text-4xl mb-4"></i>
            <p className="text-lg">No team members to display at this time.</p>
            <p className="text-sm">Check back later for updates!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {members.map((member, index) => (
              <div key={index} className={currentLayout.cardClass}>
                {/* Member photo and info */}
                <div className={currentLayout.avatarSection}>
                  <Avatar
                    image={member.image}
                    label={member.name.charAt(0).toUpperCase()}
                    size="xlarge"
                    className={currentLayout.avatarClass}
                  />
                  {selectedVariant !== "variant2" && (
                    <>
                      <h3 className={currentLayout.nameClass}>{member.name}</h3>
                      <p className={currentLayout.titleClass}>{member.title}</p>
                    </>
                  )}
                  {selectedVariant === "variant2" && (
                    <div className="flex-1">
                      <h3 className={currentLayout.nameClass}>{member.name}</h3>
                      <p className={currentLayout.titleClass}>{member.title}</p>
                    </div>
                  )}
                </div>

                {/* Bio */}
                <p className={currentLayout.bioClass}>{member.bio}</p>

                {/* Contact links */}
                <div className={currentLayout.contactClass}>
                  {member.email && (
                    <a
                      href={`mailto:${member.email}`}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                      title="Email"
                    >
                      <i className="pi pi-envelope text-lg"></i>
                    </a>
                  )}
                  {member.linkedin && (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                      title="LinkedIn"
                    >
                      <i className="pi pi-linkedin text-lg"></i>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
