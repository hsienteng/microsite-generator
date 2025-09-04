import { NextRequest, NextResponse } from "next/server";
import {
  parseMarkdownToComponents,
  parseMarkdownRobust,
  parseMarkdownByChunksRobust,
  parseMarkdownFallback,
  FILTERING_PRESETS,
  FilteringOptions,
} from "@/lib/markdownParser";
import {
  StructuredApiResponse,
  FlexibleComponentData,
  validateResponseStructure,
  normalizePropsWithSchema,
} from "@/lib/componentSchema";

// ----------------------------
// Hybrid ordering (rules + AI)
// ----------------------------
const MICROSITE_TYPE_PRIORITY: Record<string, number> = {
  hero: 10,
  pillars: 20,
  "feature-list": 30,
  "feature-highlights": 35,
  "stats-with-icons": 36,
  "process-steps": 40,
  "steps-overview": 41,
  timeline: 42,
  collaboration: 50,
  section: 60,
  table: 70,
  "stats-card": 71,
  "info-card": 72,
  "media-gallery": 73,
  "dynamic-content": 75,
  "team-grid": 80,
  "leadership-card": 81,
  testimonial: 85,
  quote: 86,
  "award-list": 90,
  "cta-section": 100,
};

function getRulesPriority(type: string): number {
  return MICROSITE_TYPE_PRIORITY[type] ?? 65;
}

// Rules-based ordering
function orderComponentsForMicrosite(
  components: FlexibleComponentData[]
): FlexibleComponentData[] {
  return components
    .map((component, originalIndex) => ({ component, originalIndex }))
    .sort((a, b) => {
      const pA = getRulesPriority(a.component.type);
      const pB = getRulesPriority(b.component.type);
      if (pA !== pB) return pA - pB;
      return a.originalIndex - b.originalIndex;
    })
    .map(({ component }) => component);
}

type OrderingMode = "rules" | "ai" | "hybrid";

type LayoutSlot =
  | "hero"
  | "mission"
  | "services"
  | "process"
  | "collaboration"
  | "sections"
  | "content"
  | "people"
  | "social-proof"
  | "awards"
  | "cta";

interface InferredHint {
  slot: LayoutSlot;
  priority: number; // lower = earlier
  confidence: number; // 0..1
}

const SLOT_BASE_PRIORITY: Record<LayoutSlot, number> = {
  hero: 10,
  mission: 20,
  services: 30,
  process: 40,
  collaboration: 50,
  sections: 60,
  content: 70,
  people: 80,
  "social-proof": 86,
  awards: 90,
  cta: 100,
};

function inferLayoutHints(
  components: FlexibleComponentData[]
): Map<number, InferredHint> {
  const hints = new Map<number, InferredHint>();

  const normalize = (v?: string) =>
    typeof v === "string" ? v.toLowerCase() : "";

  components.forEach((c, idx) => {
    const title = normalize(c.props?.title);
    const description = normalize(c.props?.description || c.props?.content);

    let slot: LayoutSlot;
    let baseConfidence = 0.6;

    switch (c.type) {
      case "hero":
        slot = "hero";
        baseConfidence = 0.95;
        break;
      case "pillars":
        slot = "mission";
        break;
      case "feature-list":
      case "feature-highlights":
      case "stats-with-icons":
        slot = "services";
        break;
      case "process-steps":
      case "steps-overview":
      case "timeline":
        slot = "process";
        break;
      case "collaboration":
        slot = "collaboration";
        break;
      case "team-grid":
      case "leadership-card":
        slot = "people";
        break;
      case "testimonial":
      case "quote":
        slot = "social-proof";
        break;
      case "award-list":
        slot = "awards";
        break;
      case "cta-section":
        slot = "cta";
        baseConfidence = 0.9;
        break;
      case "section":
        slot = "sections";
        baseConfidence = 0.5;
        break;
      default:
        slot = "content";
        baseConfidence = 0.5;
    }

    // Keyword adjustments
    const boostIf = (cond: boolean, inc = 0.15) => {
      if (cond) baseConfidence = Math.min(1, baseConfidence + inc);
    };

    boostIf(/mission|vision|purpose/.test(title));
    boostIf(/service|capabilit|offering|product/.test(title));
    boostIf(/process|how we work|how it works/.test(title));
    boostIf(/about|overview|introduction/.test(title));
    boostIf(
      /contact|get in touch|talk to|reach out/.test(title) ||
        /contact/.test(description)
    );

    const priority = SLOT_BASE_PRIORITY[slot];
    hints.set(idx, { slot, priority, confidence: baseConfidence });
  });

  return hints;
}

function findLastIndex<T>(arr: T[], predicate: (item: T) => boolean): number {
  for (let i = arr.length - 1; i >= 0; i--) {
    if (predicate(arr[i])) return i;
  }
  return -1;
}

function orderWithMode(
  components: FlexibleComponentData[],
  mode: OrderingMode
): FlexibleComponentData[] {
  if (mode === "rules") {
    return orderComponentsForMicrosite(components);
  }

  const hints = inferLayoutHints(components);

  const computeAiPriority = (index: number, type: string): number => {
    const hint = hints.get(index);
    const rules = getRulesPriority(type);
    if (!hint) return rules;

    const aiBase = hint.priority;

    if (mode === "ai") {
      return hint.confidence >= 0.6 ? aiBase : rules;
    }

    // hybrid: prefer AI if high confidence, otherwise nudge toward AI
    if (hint.confidence >= 0.75) return aiBase;
    if (hint.confidence >= 0.5) return Math.round((rules * 2 + aiBase) / 3);
    return rules;
  };

  const sorted = components
    .map((component, originalIndex) => ({ component, originalIndex }))
    .sort((a, b) => {
      const pA = computeAiPriority(a.originalIndex, a.component.type);
      const pB = computeAiPriority(b.originalIndex, b.component.type);
      if (pA !== pB) return pA - pB;
      return a.originalIndex - b.originalIndex;
    })
    .map(({ component }) => component);

  // Guardrails: hero first (single)
  const firstHeroIdx = sorted.findIndex((c) => c.type === "hero");
  if (firstHeroIdx > 0) {
    const [hero] = sorted.splice(firstHeroIdx, 1);
    for (let i = sorted.length - 1; i >= 0; i--) {
      if (sorted[i].type === "hero") sorted.splice(i, 1);
    }
    sorted.unshift(hero);
  }

  // Guardrails: CTA last (single)
  const lastCtaIdx = findLastIndex(sorted, (c) => c.type === "cta-section");
  if (lastCtaIdx >= 0 && lastCtaIdx !== sorted.length - 1) {
    const [cta] = sorted.splice(lastCtaIdx, 1);
    for (let i = sorted.length - 1; i >= 0; i--) {
      if (sorted[i].type === "cta-section") sorted.splice(i, 1);
    }
    sorted.push(cta);
  }

  return sorted;
}

// Enhanced data transformation using flexible schema system
function transformToStructuredResponse(
  data: any,
  strategy: string,
  orderingMode: OrderingMode
): StructuredApiResponse {
  const warnings: string[] = [];
  const errors: string[] = [];

  // Validate basic response structure
  const validation = validateResponseStructure(data);
  if (!validation.isValid) {
    return {
      success: false,
      data: {
        components: [],
        metadata: {
          title: "Error",
          description: "Failed to parse content",
          tags: [],
          processingInfo: {
            strategy,
            fallbackUsed: true,
            warnings: validation.warnings,
          },
        },
      },
      errors: validation.errors,
      warnings: validation.warnings,
    };
  }

  warnings.push(...validation.warnings);

  // Transform components using schema-based normalization and filter empty ones
  const transformedComponents: FlexibleComponentData[] = data.components
    .map((component: any, index: number) => {
      // Extract props from various possible locations
      const rawProps =
        component.props || component.content || component.data || {};

      // Handle components where props are at root level
      if (!rawProps || Object.keys(rawProps).length === 0) {
        const rootProps: any = {};
        Object.keys(component).forEach((key) => {
          if (
            key !== "type" &&
            key !== "children" &&
            key !== "props" &&
            key !== "content" &&
            key !== "data"
          ) {
            rootProps[key] = component[key];
          }
        });
        Object.assign(rawProps, rootProps);
      }

      // Normalize props using schema
      const { normalizedProps, warnings: propWarnings } =
        normalizePropsWithSchema(component.type, rawProps);

      // Filter out warnings about empty sections since we'll remove them
      const filteredWarnings = propWarnings.filter(
        (w) =>
          !w.includes("Section is empty") &&
          !w.includes("should be filtered out")
      );

      warnings.push(
        ...filteredWarnings.map(
          (w) => `Component ${index} (${component.type}): ${w}`
        )
      );

      return {
        type: component.type,
        props: normalizedProps,
        children: component.children || [],
        metadata: {
          source: "ai-parsed",
          confidence: component.confidence || 0.8,
          alternatives: component.alternatives || [],
        },
        _shouldFilter: propWarnings.some((w) =>
          w.includes("should be filtered out")
        ),
      };
    })
    .filter((component: any) => {
      // Remove components marked for filtering (empty sections)
      if (component._shouldFilter) {
        return false;
      }

      // Additional filtering for truly empty components
      if (component.type === "section") {
        const props = component.props;
        const hasContent =
          props.title ||
          props.content ||
          (props.subsections && props.subsections.length > 0) ||
          (props.items && props.items.length > 0);
        return hasContent;
      }

      return true;
    })
    .map((component: any) => {
      // Remove the temporary filter flag
      delete component._shouldFilter;
      return component;
    });

  // Order components per requested mode
  const orderedComponents = orderWithMode(transformedComponents, orderingMode);

  // Ensure metadata with proper defaults
  const metadata = {
    title: data.metadata?.title || "Generated Site",
    description:
      data.metadata?.description ||
      "AI-generated microsite from markdown content",
    tags: Array.isArray(data.metadata?.tags) ? data.metadata.tags : [],
    processingInfo: {
      strategy,
      chunksProcessed: data.chunksProcessed,
      fallbackUsed: false,
      orderingMode,
      warnings,
    },
  };

  return {
    success: true,
    data: {
      components: orderedComponents,
      metadata,
    },
    warnings: warnings.length > 0 ? warnings : undefined,
  };
}

// Create fallback response for errors
function createFallbackResponse(
  error: string,
  strategy: string
): StructuredApiResponse {
  return {
    success: false,
    data: {
      components: [],
      metadata: {
        title: "Error",
        description: "Failed to parse markdown content",
        tags: [],
        processingInfo: {
          strategy,
          fallbackUsed: true,
          warnings: [error],
        },
      },
    },
    errors: [error],
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      markdownContent,
      useChunking = false,
      useIntelligentSelection = true,
      filteringStrictness = "moderate",
      customFilteringOptions,
      compact = true,
      maxComponents,
      ordering = "hybrid",
    } = body;

    if (!markdownContent) {
      const errorResponse = createFallbackResponse(
        "Markdown content is required",
        "none"
      );
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Determine filtering options
    const baseFilteringOptions: FilteringOptions =
      customFilteringOptions ||
      FILTERING_PRESETS[
        filteringStrictness as keyof typeof FILTERING_PRESETS
      ] ||
      FILTERING_PRESETS.moderate;

    // Allow request to override maxComponents to keep payload small
    const filteringOptions: FilteringOptions = {
      ...baseFilteringOptions,
      maxComponents: Math.max(
        4,
        Math.min(
          baseFilteringOptions.maxComponents,
          maxComponents || baseFilteringOptions.maxComponents
        )
      ),
    };

    let parsedData;
    let strategy = "basic";

    try {
      if (useIntelligentSelection) {
        strategy = "intelligent";
        parsedData = await parseMarkdownRobust(
          markdownContent,
          filteringOptions
        );
      } else if (useChunking) {
        strategy = "chunked";
        parsedData = await parseMarkdownByChunksRobust(
          markdownContent,
          filteringOptions
        );
      } else {
        strategy = "basic";
        parsedData = await parseMarkdownToComponents(
          markdownContent,
          filteringOptions
        );
      }
    } catch (aiError) {
      console.warn("AI parsing failed, using fallback parser:", aiError);
      strategy = "fallback";
      parsedData = parseMarkdownFallback(markdownContent);
    }

    // Normalize ordering mode
    const normalizedOrdering: OrderingMode =
      ordering === "ai" || ordering === "rules" || ordering === "hybrid"
        ? ordering
        : "hybrid";

    // Transform using new structured approach
    const structuredResponse = transformToStructuredResponse(
      parsedData,
      strategy,
      normalizedOrdering
    );

    // If transformation failed completely, try fallback
    if (!structuredResponse.success && strategy !== "fallback") {
      console.warn("Structured transformation failed, using fallback parser");
      const fallbackData = parseMarkdownFallback(markdownContent);
      const fallbackResponse = transformToStructuredResponse(
        fallbackData,
        "fallback",
        normalizedOrdering
      );
      return NextResponse.json(fallbackResponse);
    }

    // Optionally trim metadata/noise for latency and payload
    if (compact && structuredResponse.success) {
      const compactResponse = {
        success: true,
        data: {
          components: structuredResponse.data.components,
          metadata: {
            title: structuredResponse.data.metadata.title,
            description: structuredResponse.data.metadata.description,
            tags: structuredResponse.data.metadata.tags,
            processingInfo: {
              strategy:
                structuredResponse.data.metadata.processingInfo.strategy,
              fallbackUsed:
                structuredResponse.data.metadata.processingInfo.fallbackUsed,
              orderingMode: normalizedOrdering,
            },
          },
        },
      };
      return NextResponse.json(compactResponse);
    }

    return NextResponse.json(structuredResponse);
  } catch (error) {
    console.error("Error in parse-markdown API:", error);
    const errorResponse = createFallbackResponse(
      error instanceof Error ? error.message : "Unknown error occurred",
      "error"
    );
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
