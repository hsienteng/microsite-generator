import React from "react";
import { Card } from "primereact/card";
import { ComponentData } from "@/lib/markdownParser";
import {
  FlexibleComponentData,
  normalizePropsWithSchema,
  COMPONENT_SCHEMAS,
} from "@/lib/componentSchema";

import {
  Hero,
  Section,
  InfoCard,
  LeadershipCard,
  ProcessSteps,
  FeatureList,
  Pillars,
  DataTable,
  Quote,
  AwardList,
  StatsCard,
  Timeline,
  Testimonial,
  CTASection,
  TeamGrid,
  Collaboration,
  FAQ,
  FeatureHighlights,
  StatsWithIcons,
  StepsOverview,
  MediaGallery,
} from "./index";
import DynamicContent from "./DynamicContent";

// Functional Component Registry with registration capabilities
const createComponentRegistry = () => {
  let registry: Record<string, React.ComponentType<any>> = {};

  const registerDefaults = () => {
    const defaults = [
      ["hero", Hero],
      ["section", Section],
      ["subsection", Section],
      ["info-card", InfoCard],
      ["leadership-card", LeadershipCard],
      ["process-steps", ProcessSteps],
      ["feature-list", FeatureList],
      ["pillars", Pillars],
      ["table", DataTable],
      ["quote", Quote],
      ["award-list", AwardList],
      ["stats-card", StatsCard],
      ["timeline", Timeline],
      ["testimonial", Testimonial],
      ["cta-section", CTASection],
      ["team-grid", TeamGrid],
      ["collaboration", Collaboration],
      ["dynamic-content", DynamicContent],
      ["faq", FAQ],
      ["feature-highlights", FeatureHighlights],
      ["stats-with-icons", StatsWithIcons],
      ["steps-overview", StepsOverview],
      ["media-gallery", MediaGallery],
    ] as const;

    defaults.forEach(([type, component]) => {
      register(type, component);
    });
  };

  const register = (type: string, component: React.ComponentType<any>) => {
    registry[type] = component;
  };

  const unregister = (type: string) => {
    delete registry[type];
  };

  const get = (type: string): React.ComponentType<any> | undefined => {
    return registry[type];
  };

  const getAll = (): Record<string, React.ComponentType<any>> => {
    return { ...registry };
  };

  const list = (): string[] => {
    return Object.keys(registry);
  };

  const has = (type: string): boolean => {
    return type in registry;
  };

  // Initialize with defaults
  registerDefaults();

  return {
    register,
    unregister,
    get,
    getAll,
    list,
    has,
  };
};

// Global registry instance
const componentRegistry = createComponentRegistry();

// Export functions for external component registration
export const registerComponent = (
  type: string,
  component: React.ComponentType<any>
) => {
  componentRegistry.register(type, component);
};

export const unregisterComponent = (type: string) => {
  componentRegistry.unregister(type);
};

export const listAvailableComponents = () => {
  return componentRegistry.list();
};

export const hasComponent = (type: string) => {
  return componentRegistry.has(type);
};

// Enhanced prop extraction using schema system
const getSafePropsWithSchema = (
  data: ComponentData | FlexibleComponentData
) => {
  // Extract raw props from various locations
  const rawProps =
    data.props || (data as any).data || (data as any).content || {};

  // Handle root-level props
  if (!rawProps || Object.keys(rawProps).length === 0) {
    const rootProps: any = {};
    Object.keys(data).forEach((key) => {
      if (
        key !== "type" &&
        key !== "children" &&
        key !== "props" &&
        key !== "data" &&
        key !== "content" &&
        key !== "metadata"
      ) {
        rootProps[key] = (data as any)[key];
      }
    });
    Object.assign(rawProps, rootProps);
  }

  // Use schema-based normalization
  const { normalizedProps, warnings } = normalizePropsWithSchema(
    data.type,
    rawProps
  );

  // Log warnings for debugging
  if (warnings.length > 0) {
    console.warn(`Component ${data.type} normalization warnings:`, warnings);
  }

  return normalizedProps;
};

// Simple validation check for component schemas
const validateComponent = (
  componentType: string,
  props: any
): { isValid: boolean; warnings: string[] } => {
  const schema = COMPONENT_SCHEMAS[componentType];
  const warnings: string[] = [];

  if (!schema) {
    warnings.push(`No schema found for component type: ${componentType}`);
    return { isValid: true, warnings }; // Allow unknown components
  }

  // Check required props
  const missingRequired = schema.requiredProps.filter(
    (prop) =>
      props[prop] === undefined || props[prop] === null || props[prop] === ""
  );

  if (missingRequired.length > 0) {
    warnings.push(`Missing required props: ${missingRequired.join(", ")}`);
  }

  // For arrays, check they're not empty
  schema.requiredProps.forEach((prop) => {
    if (Array.isArray(props[prop]) && props[prop].length === 0) {
      warnings.push(`Required array prop '${prop}' is empty`);
    }
  });

  return { isValid: true, warnings }; // Allow rendering with warnings
};

// Flexible component renderer with graceful error handling
const renderComponentWithFallback = (
  Component: React.ComponentType<any>,
  props: any,
  componentType: string,
  children?: React.ReactNode
) => {
  try {
    return <Component {...props}>{children}</Component>;
  } catch (error) {
    console.error(`Error rendering component ${componentType}:`, error);

    // Render fallback component
    return (
      <Card className="mb-4 border-yellow-200 dark:border-yellow-600 bg-yellow-50 dark:bg-yellow-900/20">
        <div className="p-4">
          <div className="flex items-center gap-2 text-yellow-700 dark:text-yellow-300 mb-2">
            <i className="pi pi-exclamation-triangle"></i>
            <span className="font-semibold">Component Render Error</span>
          </div>
          <p className="text-sm text-yellow-600 dark:text-yellow-400 mb-2">
            Failed to render {componentType} component
          </p>
          {props.title && (
            <h3 className="font-medium text-gray-800 dark:text-gray-200">
              {props.title}
            </h3>
          )}
          {props.content && (
            <div className="text-gray-600 dark:text-gray-400 mt-2">
              {props.content}
            </div>
          )}
          {children}
        </div>
      </Card>
    );
  }
};

// Enhanced Dynamic Component Renderer
export const DynamicComponent: React.FC<{
  data: ComponentData | FlexibleComponentData;
}> = ({ data }) => {
  const Component = componentRegistry.get(data.type);

  if (!Component) {
    console.warn(`Component type "${data.type}" not found in registry`);
    return (
      <Card className="mb-4 border-red-200 dark:border-red-600 bg-red-50 dark:bg-red-900/20">
        <div className="p-4 text-center text-red-600 dark:text-red-400">
          <i className="pi pi-exclamation-triangle text-2xl mb-2"></i>
          <div className="font-semibold">Unknown Component</div>
          <div className="text-sm mt-1">
            Component type "{data.type}" not found
          </div>
          {data.props && Object.keys(data.props).length > 0 && (
            <details className="mt-2 text-left">
              <summary className="cursor-pointer text-xs">
                Show raw data
              </summary>
              <pre className="text-xs mt-1 bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-auto text-gray-800 dark:text-gray-200">
                {JSON.stringify(data, null, 2)}
              </pre>
            </details>
          )}
        </div>
      </Card>
    );
  }

  // Use schema-based prop normalization
  const normalizedProps = getSafePropsWithSchema(data);

  // Validate component
  const validation = validateComponent(data.type, normalizedProps);
  if (validation.warnings.length > 0) {
    console.warn(
      `Component ${data.type} validation warnings:`,
      validation.warnings
    );
  }

  // Render children
  const childrenElements = data.children?.map((child, index) => (
    <DynamicComponent key={index} data={child} />
  ));

  // Render with fallback error handling
  return renderComponentWithFallback(
    Component,
    normalizedProps,
    data.type,
    childrenElements
  );
};

// Enhanced Page Component with error boundary
export const DynamicPage: React.FC<{
  components: ComponentData[] | FlexibleComponentData[];
  showDebugInfo?: boolean;
}> = ({ components, showDebugInfo = false }) => {
  // Ensure components is an array and handle both old and new formats
  const safeComponents = Array.isArray(components) ? components : [];

  if (safeComponents.length === 0) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <Card className="p-8 text-center bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
          <i className="pi pi-info-circle text-4xl text-blue-500 dark:text-blue-400 mb-4"></i>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
            No Content Available
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            No components were generated from the markdown content.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {showDebugInfo && (
        <div className="bg-blue-100 dark:bg-blue-900/20 border-l-4 border-blue-500 dark:border-blue-400 p-4 mb-4">
          <div className="flex items-center">
            <i className="pi pi-info-circle text-blue-500 dark:text-blue-400 mr-2"></i>
            <div>
              <p className="text-blue-700 dark:text-blue-300 font-medium">
                Debug Info
              </p>
              <p className="text-blue-600 dark:text-blue-400 text-sm">
                Rendering {safeComponents.length} components
              </p>
            </div>
          </div>
        </div>
      )}

      {safeComponents.map((component, index) => (
        <DynamicComponent key={`${component.type}-${index}`} data={component} />
      ))}
    </div>
  );
};
