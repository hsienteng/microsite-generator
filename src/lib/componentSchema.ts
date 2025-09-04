// Component Schema and Validation System
// This file defines flexible schemas for components with multiple property mappings

export interface ComponentSchema {
  type: string;
  requiredProps: string[];
  optionalProps: string[];
  propMappings: Record<string, string[]>; // Maps standard prop names to possible variants
  defaultProps: Record<string, any>;
  validation?: (props: any) => { isValid: boolean; errors: string[] };
}

export interface FlexibleComponentData {
  type: string;
  props: Record<string, any>;
  children?: FlexibleComponentData[];
  metadata?: {
    source?: string;
    confidence?: number;
    alternatives?: string[];
  };
}

export interface StructuredApiResponse {
  success: boolean;
  data: {
    components: FlexibleComponentData[];
    metadata: {
      title: string;
      description: string;
      tags: string[];
      processingInfo: {
        strategy: string;
        chunksProcessed?: number;
        fallbackUsed?: boolean;
        warnings: string[];
      };
    };
  };
  errors?: string[];
  warnings?: string[];
}

// Component Schema Definitions
export const COMPONENT_SCHEMAS: Record<string, ComponentSchema> = {
  hero: {
    type: "hero",
    requiredProps: ["title"],
    optionalProps: [
      "subtitle",
      "description",
      "backgroundImage",
      "ctaText",
      "ctaLink",
    ],
    propMappings: {
      title: ["title", "heading", "header", "name"],
      subtitle: ["subtitle", "subheading", "tagline"],
      description: ["description", "content", "text", "body"],
      backgroundImage: ["backgroundImage", "image", "banner"],
      ctaText: ["ctaText", "buttonText", "actionText"],
      ctaLink: ["ctaLink", "buttonLink", "actionLink", "href"],
    },
    defaultProps: {
      title: "Welcome",
      subtitle: "",
      description: "",
    },
  },

  section: {
    type: "section",
    requiredProps: [],
    optionalProps: ["title", "content", "subsections", "items", "collapsible"],
    propMappings: {
      title: ["title", "heading", "header", "name"],
      content: ["content", "text", "body", "description"],
      subsections: ["subsections", "sections", "children"],
      items: ["items", "list", "points"],
      collapsible: ["collapsible", "expandable", "accordion"],
    },
    defaultProps: {
      title: "",
      content: "",
      collapsible: false,
    },
    validation: (props) => {
      const errors: string[] = [];
      // Skip empty sections completely
      const hasContent =
        props.title ||
        props.content ||
        (props.subsections && props.subsections.length > 0) ||
        (props.items && props.items.length > 0);

      if (!hasContent) {
        errors.push("Section is empty and should be filtered out");
      }
      return { isValid: hasContent, errors };
    },
  },

  "feature-list": {
    type: "feature-list",
    requiredProps: ["features"],
    optionalProps: ["title", "description", "layout"],
    propMappings: {
      title: ["title", "heading", "header", "name"],
      description: ["description", "content", "text", "body"],
      features: ["features", "items", "list", "services", "capabilities"],
      layout: ["layout", "style", "format"],
    },
    defaultProps: {
      title: "Features",
      features: [],
    },
    validation: (props) => {
      const errors: string[] = [];
      if (
        !props.features ||
        !Array.isArray(props.features) ||
        props.features.length === 0
      ) {
        errors.push("Features list is required and must not be empty");
      }
      return { isValid: errors.length === 0, errors };
    },
  },

  "team-grid": {
    type: "team-grid",
    requiredProps: [],
    optionalProps: ["title", "description", "layout", "members"],
    propMappings: {
      title: ["title", "heading", "header", "name"],
      description: ["description", "content", "text", "body"],
      members: ["members", "team", "people", "staff", "teamMembers"],
      layout: ["layout", "style", "format", "columns"],
    },
    defaultProps: {
      title: "Our Team",
      members: [],
    },
    validation: (props) => {
      const errors: string[] = [];
      // Allow empty team grids - they can show a placeholder message
      if (props.members && !Array.isArray(props.members)) {
        errors.push("Team members must be an array");
      }
      return { isValid: errors.length === 0, errors };
    },
  },

  "info-card": {
    type: "info-card",
    requiredProps: ["title"],
    optionalProps: ["items", "description", "icon"],
    propMappings: {
      title: ["title", "heading", "header", "name"],
      items: ["items", "content", "data", "details", "info"],
      description: ["description", "text", "body"],
      icon: ["icon", "image", "symbol"],
    },
    defaultProps: {
      title: "Information",
      items: {},
    },
  },

  table: {
    type: "table",
    requiredProps: ["data"],
    optionalProps: ["title", "description", "responsive", "headers"],
    propMappings: {
      title: ["title", "heading", "header", "name", "caption"],
      headers: ["headers", "columns", "fields"],
      data: ["data", "rows", "content", "items"],
      description: ["description", "text", "body"],
      responsive: ["responsive", "mobile", "adaptive"],
    },
    defaultProps: {
      title: "",
      headers: [],
      data: [],
      responsive: true,
    },
    validation: (props) => {
      const errors: string[] = [];
      if (!props.data || !Array.isArray(props.data)) {
        errors.push("Table data must be an array");
      }
      // Auto-generate headers if missing but data exists
      if (
        props.data &&
        props.data.length > 0 &&
        (!props.headers || props.headers.length === 0)
      ) {
        // Use first row as headers if it looks like headers, otherwise generate generic ones
        const firstRow = props.data[0];
        if (Array.isArray(firstRow)) {
          props.headers = firstRow.map((_, index) => `Column ${index + 1}`);
        }
      }
      return { isValid: errors.length === 0, errors };
    },
  },

  "process-steps": {
    type: "process-steps",
    requiredProps: ["steps"],
    optionalProps: ["title", "description", "orientation"],
    propMappings: {
      title: ["title", "heading", "header", "name"],
      description: ["description", "content", "text", "body"],
      steps: ["steps", "items", "process", "workflow"],
      orientation: ["orientation", "direction", "layout"],
    },
    defaultProps: {
      title: "Process",
      steps: [],
      orientation: "vertical",
    },
  },

  "stats-card": {
    type: "stats-card",
    requiredProps: ["stats"],
    optionalProps: ["title", "description"],
    propMappings: {
      title: ["title", "heading", "header", "name"],
      description: ["description", "content", "text", "body"],
      stats: ["stats", "statistics", "metrics", "data", "numbers"],
    },
    defaultProps: {
      title: "Statistics",
      stats: [],
    },
  },

  "leadership-card": {
    type: "leadership-card",
    requiredProps: ["name"],
    optionalProps: ["title", "bio", "image", "email", "social"],
    propMappings: {
      name: ["name", "fullName", "person"],
      title: ["title", "position", "role", "jobTitle"],
      bio: ["bio", "biography", "description", "about"],
      image: ["image", "photo", "avatar", "picture"],
      email: ["email", "contact"],
      social: ["social", "links", "socialLinks"],
    },
    defaultProps: {
      name: "",
      title: "",
      bio: "",
    },
  },

  pillars: {
    type: "pillars",
    requiredProps: ["pillars"],
    optionalProps: ["title", "description"],
    propMappings: {
      title: ["title", "heading", "header", "name"],
      description: ["description", "content", "text", "body"],
      pillars: ["pillars", "items", "principles", "values", "foundations"],
    },
    defaultProps: {
      title: "Our Pillars",
      pillars: [],
    },
  },

  quote: {
    type: "quote",
    requiredProps: ["text"],
    optionalProps: ["author", "role", "company", "image"],
    propMappings: {
      text: ["text", "quote", "content", "message"],
      author: ["author", "name", "speaker"],
      role: ["role", "title", "position"],
      company: ["company", "organization", "firm"],
      image: ["image", "photo", "avatar"],
    },
    defaultProps: {
      text: "",
      author: "",
      role: "",
    },
  },

  testimonial: {
    type: "testimonial",
    requiredProps: ["text", "author"],
    optionalProps: ["role", "company", "image", "rating"],
    propMappings: {
      text: ["text", "testimonial", "content", "message", "review"],
      author: ["author", "name", "client"],
      role: ["role", "title", "position"],
      company: ["company", "organization", "firm"],
      image: ["image", "photo", "avatar"],
      rating: ["rating", "score", "stars"],
    },
    defaultProps: {
      text: "",
      author: "",
      role: "",
    },
  },

  timeline: {
    type: "timeline",
    requiredProps: ["events"],
    optionalProps: ["title", "description", "orientation"],
    propMappings: {
      title: ["title", "heading", "header", "name"],
      description: ["description", "content", "text", "body"],
      events: ["events", "items", "timeline", "milestones"],
      orientation: ["orientation", "direction", "layout"],
    },
    defaultProps: {
      title: "Timeline",
      events: [],
      orientation: "vertical",
    },
  },

  "cta-section": {
    type: "cta-section",
    requiredProps: ["title"],
    optionalProps: ["description", "buttonText", "buttonLink", "style"],
    propMappings: {
      title: ["title", "heading", "header", "callToAction"],
      description: ["description", "content", "text", "body"],
      buttonText: ["buttonText", "ctaText", "actionText", "label"],
      buttonLink: ["buttonLink", "ctaLink", "actionLink", "href"],
      style: ["style", "theme", "variant"],
    },
    defaultProps: {
      title: "Get Started",
      buttonText: "Learn More",
    },
  },

  // Microsite additions
  faq: {
    type: "faq",
    requiredProps: [],
    optionalProps: ["title", "description", "items"],
    propMappings: {
      title: ["title", "heading", "header"],
      description: ["description", "content", "text", "body"],
      items: ["items", "faqs", "questions"],
    },
    defaultProps: {
      title: "FAQ",
      items: [],
    },
  },

  "feature-highlights": {
    type: "feature-highlights",
    requiredProps: ["highlights"],
    optionalProps: ["title", "description"],
    propMappings: {
      title: ["title", "heading", "header"],
      description: ["description", "content", "text", "body"],
      highlights: ["highlights", "features", "items"],
    },
    defaultProps: {
      title: "Highlights",
      highlights: [],
    },
  },

  "stats-with-icons": {
    type: "stats-with-icons",
    requiredProps: ["stats"],
    optionalProps: ["title", "description"],
    propMappings: {
      title: ["title", "heading", "header"],
      description: ["description", "content", "text", "body"],
      stats: ["stats", "statistics", "metrics", "data"],
    },
    defaultProps: {
      title: "Key Stats",
      stats: [],
    },
  },

  "steps-overview": {
    type: "steps-overview",
    requiredProps: ["steps"],
    optionalProps: ["title", "description"],
    propMappings: {
      title: ["title", "heading", "header"],
      description: ["description", "content", "text", "body"],
      steps: ["steps", "items", "process"],
    },
    defaultProps: {
      title: "How it works",
      steps: [],
    },
  },

  "media-gallery": {
    type: "media-gallery",
    requiredProps: ["items"],
    optionalProps: ["title", "description"],
    propMappings: {
      title: ["title", "heading", "header"],
      description: ["description", "content", "text", "body"],
      items: ["items", "media", "images", "gallery"],
    },
    defaultProps: {
      title: "Gallery",
      items: [],
    },
  },

  collaboration: {
    type: "collaboration",
    requiredProps: ["title"],
    optionalProps: ["content", "internalCollaboration", "clientCollaboration"],
    propMappings: {
      title: ["title", "heading", "header", "name"],
      content: ["content", "description", "text", "body"],
      internalCollaboration: [
        "internalCollaboration",
        "internal_collaboration",
        "internal",
      ],
      clientCollaboration: [
        "clientCollaboration",
        "client_collaboration",
        "client",
      ],
    },
    defaultProps: {
      title: "Collaboration",
      content: "",
    },
  },

  "award-list": {
    type: "award-list",
    requiredProps: ["awards"],
    optionalProps: ["title", "description"],
    propMappings: {
      title: ["title", "heading", "header", "name"],
      description: ["description", "content", "text", "body"],
      awards: ["awards", "items", "recognitions", "achievements"],
    },
    defaultProps: {
      title: "Awards & Recognition",
      awards: [],
    },
  },

  // Universal dynamic component for any content type
  "dynamic-content": {
    type: "dynamic-content",
    requiredProps: [],
    optionalProps: [], // Will accept any props
    propMappings: {}, // No specific mappings - accepts everything
    defaultProps: {},
    validation: (props) => {
      // Always valid - can render any content
      return { isValid: true, errors: [] };
    },
  },
};

// Utility function to normalize props based on schema
export function normalizePropsWithSchema(
  componentType: string,
  rawProps: any
): { normalizedProps: any; warnings: string[] } {
  const schema = COMPONENT_SCHEMAS[componentType];
  const warnings: string[] = [];

  if (!schema) {
    warnings.push(`No schema found for component type: ${componentType}`);
    // For unknown components, return raw props as-is
    return { normalizedProps: rawProps, warnings };
  }

  const normalizedProps = { ...schema.defaultProps };

  // For dynamic-content, just pass through all props
  if (componentType === "dynamic-content") {
    return { normalizedProps: { ...rawProps }, warnings };
  }

  // Map properties using the schema
  for (const [standardProp, variants] of Object.entries(schema.propMappings)) {
    for (const variant of variants) {
      if (rawProps[variant] !== undefined) {
        normalizedProps[standardProp] = rawProps[variant];
        break; // Use first matching variant
      }
    }
  }

  // Add any additional props that aren't mapped (for flexibility)
  Object.keys(rawProps).forEach((key) => {
    if (!normalizedProps.hasOwnProperty(key)) {
      // Check if this key maps to any standard prop
      const mappedTo = Object.entries(schema.propMappings).find(
        ([_, variants]) => variants.includes(key)
      );

      if (!mappedTo) {
        // Add unmapped props directly (dynamic behavior)
        normalizedProps[key] = rawProps[key];
      }
    }
  });

  // Handle complex nested structures for sections
  if (componentType === "section" && normalizedProps.subsections) {
    const updatedProps = handleSectionSubsections(normalizedProps, warnings);
    Object.assign(normalizedProps, updatedProps);
  }

  // Handle array transformations for specific prop types
  if (componentType === "feature-list" && normalizedProps.features) {
    normalizedProps.features = normalizeFeatureArray(normalizedProps.features);
  }

  if (componentType === "team-grid" && normalizedProps.members) {
    normalizedProps.members = normalizeTeamArray(normalizedProps.members);
  }

  // Auto-fix table headers
  if (
    componentType === "table" &&
    normalizedProps.data &&
    normalizedProps.data.length > 0
  ) {
    if (!normalizedProps.headers || normalizedProps.headers.length === 0) {
      const firstRow = normalizedProps.data[0];
      if (Array.isArray(firstRow)) {
        normalizedProps.headers = firstRow.map(
          (_: any, index: number) => `Column ${index + 1}`
        );
      }
    }
  }

  // Validate using schema validation function
  if (schema.validation) {
    const validation = schema.validation(normalizedProps);
    if (!validation.isValid) {
      warnings.push(...validation.errors);
    }
  }

  return { normalizedProps, warnings };
}

// Helper function to handle complex section subsections
function handleSectionSubsections(props: any, warnings: string[]): any {
  const normalized = { ...props };

  if (!props.subsections || !Array.isArray(props.subsections)) {
    return normalized;
  }

  // Convert subsections to content if they have complex structures
  let combinedContent = normalized.content || "";

  props.subsections.forEach((subsection: any) => {
    if (subsection.title) {
      combinedContent += `\n\n**${subsection.title}**\n`;
    }

    if (subsection.content) {
      if (typeof subsection.content === "string") {
        combinedContent += subsection.content;
      } else if (typeof subsection.content === "object") {
        // Handle complex objects like the case studies
        if (subsection.content.description) {
          combinedContent += subsection.content.description + "\n";
        }

        if (
          subsection.content.keyOutcomes &&
          Array.isArray(subsection.content.keyOutcomes)
        ) {
          combinedContent += "\n**Key Outcomes:**\n";
          subsection.content.keyOutcomes.forEach((outcome: string) => {
            combinedContent += `• ${outcome}\n`;
          });
        }

        if (
          subsection.content.approach &&
          Array.isArray(subsection.content.approach)
        ) {
          combinedContent += "\n**Approach:**\n";
          subsection.content.approach.forEach((step: string) => {
            combinedContent += `• ${step}\n`;
          });
        }

        // Handle arrays within content
        if (Array.isArray(subsection.content)) {
          subsection.content.forEach((item: string) => {
            combinedContent += `• ${item}\n`;
          });
        }
      }
    }
  });

  normalized.content = combinedContent.trim();
  // Keep subsections for components that can handle them

  return normalized;
}

// Helper functions for array normalization
function normalizeFeatureArray(features: any[]): any[] {
  return features.map((feature) => {
    if (typeof feature === "string") {
      const colonIndex = feature.indexOf(":");
      if (colonIndex > 0) {
        return {
          title: feature.substring(0, colonIndex).trim(),
          description: feature.substring(colonIndex + 1).trim(),
        };
      }
      return { title: feature.trim(), description: "" };
    }
    return {
      title: feature.title || feature.name || "",
      description: feature.description || feature.content || "",
    };
  });
}

function normalizeTeamArray(members: any[]): any[] {
  return members.map((member) => {
    if (typeof member === "string") {
      const dashIndex = member.indexOf(" - ");
      if (dashIndex > 0) {
        return {
          name: member.substring(0, dashIndex).trim(),
          title: member.substring(dashIndex + 3).trim(),
          bio: "",
        };
      }
      return { name: member, title: "", bio: "" };
    }
    return {
      name: member.name || "",
      title: member.title || member.position || member.role || "",
      bio: member.bio || member.description || member.about || "",
      image: member.image || member.photo,
      email: member.email,
    };
  });
}

// Validate entire response structure
export function validateResponseStructure(data: any): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!data) {
    errors.push("Response data is null or undefined");
    return { isValid: false, errors, warnings };
  }

  if (!data.components || !Array.isArray(data.components)) {
    errors.push("Response must contain a components array");
    return { isValid: false, errors, warnings };
  }

  // Validate each component
  data.components.forEach((component: any, index: number) => {
    if (!component.type) {
      warnings.push(`Component at index ${index} missing type property`);
    } else if (!COMPONENT_SCHEMAS[component.type]) {
      warnings.push(
        `Unknown component type: ${component.type} at index ${index}`
      );
    }
  });

  return { isValid: errors.length === 0, errors, warnings };
}
