import OpenAI from "openai";

// Simple in-memory cache with TTL to avoid re-parsing identical content
type CacheEntry<T> = { data: T; expiresAt: number };
const parserCache: Map<string, CacheEntry<any>> = new Map();
const DEFAULT_TTL_MS = 60_000; // 60s

function getCache<T>(key: string): T | null {
  const entry = parserCache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    parserCache.delete(key);
    return null;
  }
  return entry.data as T;
}

function setCache<T>(key: string, data: T, ttlMs: number = DEFAULT_TTL_MS) {
  parserCache.set(key, { data, expiresAt: Date.now() + ttlMs });
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface ComponentData {
  type: string;
  props: Record<string, any>;
  children?: ComponentData[];
  relevanceScore?: number;
  contentType?: string;
}

/**
 * Configuration options for intelligent content filtering
 *
 * @interface FilteringOptions
 * @property {string} strictness - Overall filtering strictness level
 * @property {number} minRelevanceScore - Minimum relevance score (0-100) for inclusion
 * @property {number} maxComponents - Maximum number of components to include
 * @property {string[]} prioritizeContentTypes - Content types to prioritize in ranking
 * @property {string[]} excludeContentTypes - Content types to completely exclude
 */
export interface FilteringOptions {
  strictness: "strict" | "moderate" | "lenient";
  minRelevanceScore: number;
  maxComponents: number;
  prioritizeContentTypes: string[];
  excludeContentTypes: string[];
}

export interface ParsedContent {
  components: ComponentData[];
  metadata: {
    title: string;
    description: string;
    tags: string[];
  };
}

const COMPONENT_MAPPING_PROMPT = `
You are an intelligent markdown parser that converts markdown content into structured component data for a Next.js application. Your job is to analyze each section of content and determine the MOST APPROPRIATE atomic component to represent that content.

CRITICAL FILTERING GUIDELINES:
- ONLY include content that is ESSENTIAL for understanding the organization, product, or service
- PRIORITIZE: company overview, key leadership, core services, unique value propositions, contact information
- EXCLUDE: lengthy background information, detailed history, internal processes, redundant content, metadata/tags
- FOCUS on content that would be valuable to potential clients, partners, or stakeholders
- Skip content that is purely informational or supplementary

MICROSITE COMPOSITION AND DIVERSITY RULES:
- Prefer specialized components over the generic "section". Use "section" ONLY when no other component fits.
- Do NOT include more than 2 "section" components in total.
- Aim for a visually diverse microsite: include at least 5 different component types if the content allows (e.g., hero, feature-list, pillars, leadership-card or team-grid, quote or testimonial, cta-section, timeline, stats-card, process-steps, award-list, info-card).
- Absolutely do NOT include more than 1 "hero" component in total.
- If multiple hero-like introductions exist, choose only the strongest one and map the rest to other appropriate components or omit them.
- Map common patterns to specialized components:
  - Vision/Mission/Values → "pillars" (each item as a pillar) or two "info-card" items
  - Capabilities/Offerings/Services lists → "feature-list"
  - Multiple people (3+) → "team-grid"; Single/few named people → "leadership-card"
  - Calls to action → "cta-section"
  - Chronology/milestones → "timeline"
  - Quotations/highlights → "quote" or "testimonial"

CONTENT RELEVANCE SCORING:
- HIGH PRIORITY (always include): Hero sections, key leadership, main services, contact details, core differentiators
- MEDIUM PRIORITY (include if space allows): awards, client testimonials, process overviews, team members
- LOW PRIORITY (generally exclude): detailed company history, internal processes, redundant descriptions, meta-information

CRITICAL: Return ONLY valid JSON. Do not include any explanatory text, markdown formatting, or code blocks. Use the EXACT JSON structures provided below.

AVAILABLE COMPONENTS WITH EXACT JSON STRUCTURES:

1. HERO - For main titles, introductions, and primary messaging:
{
  "type": "hero",
  "props": {
    "title": "string (required)",
    "subtitle": "string (optional)",
    "description": "string (optional)",
    "backgroundImage": "string (optional)",
    "ctaText": "string (optional)",
    "ctaLink": "string (optional)"
  }
}

2. SECTION - For major content sections with titles:
{
  "type": "section",
  "props": {
    "title": "string (optional)",
    "content": "string (optional)",
    "subsections": [
      {
        "title": "string",
        "content": "string"
      }
    ],
    "items": ["array of items (optional)"],
    "collapsible": false
  }
}

3. INFO-CARD - For structured information display:
{
  "type": "info-card",
  "props": {
    "title": "string (required)",
    "content": "string (optional)",
    "items": ["array of strings (optional)"],
    "icon": "string (optional)",
    "variant": "default"
  }
}

4. LEADERSHIP-CARD - For individual person profiles:
{
  "type": "leadership-card",
  "props": {
    "name": "string (required)",
    "title": "string (optional)",
    "bio": "string (optional)",
    "image": "string (optional)",
    "email": "string (optional)",
    "social": {}
  }
}

5. PROCESS-STEPS - For sequential processes or methodologies:
{
  "type": "process-steps",
  "props": {
    "title": "string (optional)",
    "description": "string (optional)",
    "steps": [
      {
        "title": "string",
        "description": "string",
        "icon": "string (optional)"
      }
    ],
    "orientation": "vertical"
  }
}

6. FEATURE-LIST - For lists of features, services, or capabilities:
{
  "type": "feature-list",
  "props": {
    "title": "string (optional)",
    "description": "string (optional)",
    "features": [
      {
        "title": "string",
        "description": "string",
        "icon": "string (optional)"
      }
    ]
  }
}

7. PILLARS - For core principles or foundational elements:
{
  "type": "pillars",
  "props": {
    "title": "string (optional)",
    "description": "string (optional)",
    "pillars": [
      {
        "title": "string",
        "description": "string",
        "icon": "string (optional)"
      }
    ]
  }
}

8. TABLE - For structured tabular data:
{
  "type": "table",
  "props": {
    "title": "string (optional)",
    "headers": ["array of strings"],
    "rows": [["array of arrays"]]
  }
}

9. QUOTE - For highlighted quotes or important statements:
{
  "type": "quote",
  "props": {
    "text": "string (required)",
    "author": "string (optional)",
    "role": "string (optional)",
    "company": "string (optional)",
    "image": "string (optional)"
  }
}

10. AWARD-LIST - For awards and recognitions:
{
  "type": "award-list",
  "props": {
    "title": "string (optional)",
    "description": "string (optional)",
    "awards": [
      {
        "title": "string",
        "year": "string (optional)",
        "description": "string (optional)",
        "organization": "string (optional)"
      }
    ]
  }
}

11. STATS-CARD - For statistics and metrics:
{
  "type": "stats-card",
  "props": {
    "title": "string (optional)",
    "description": "string (optional)",
    "stats": [
      {
        "label": "string",
        "value": "string",
        "unit": "string (optional)",
        "description": "string (optional)"
      }
    ]
  }
}

12. TEAM-GRID - For multiple team member displays (USE THIS for team sections with 3+ members):
{
  "type": "team-grid",
  "props": {
    "title": "string (optional)",
    "description": "string (optional)",
    "members": [
      {
        "name": "string (required)",
        "title": "string (required - person's role/position)",
        "bio": "string (optional)",
        "image": "string (optional)",
        "email": "string (optional)"
      }
    ]
  }
}

13. COLLABORATION - For partnership and collaboration information:
{
  "type": "collaboration",
  "props": {
    "title": "string (required)",
    "content": "string (optional)",
    "internalCollaboration": ["array (optional)"],
    "clientCollaboration": ["array (optional)"]
  }
}

  14. TIMELINE - For chronological events or milestones:
{
  "type": "timeline",
  "props": {
    "title": "string (optional)",
    "description": "string (optional)",
    "events": [
      {
        "date": "string",
        "title": "string",
        "description": "string",
        "milestone": true
      }
    ],
    "orientation": "vertical"
  }
}

  15. TESTIMONIAL - For customer or client testimonials:
{
  "type": "testimonial",
  "props": {
    "text": "string (required)",
    "author": "string (required)",
    "role": "string (optional)",
    "company": "string (optional)",
    "image": "string (optional)",
    "rating": 5
  }
}

  16. CTA-SECTION - For call-to-action sections:
{
  "type": "cta-section",
  "props": {
    "title": "string (required)",
    "description": "string (optional)",
    "buttonText": "string (optional)",
    "buttonLink": "string (optional)",
    "style": "default"
  }
}

  17. FAQ - For common questions and answers:
  {
    "type": "faq",
    "props": {
      "title": "string (optional)",
      "description": "string (optional)",
      "items": [
        { "question": "string", "answer": "string" }
      ]
    }
  }

  18. FEATURE-HIGHLIGHTS - For concise highlight cards:
  {
    "type": "feature-highlights",
    "props": {
      "title": "string (optional)",
      "description": "string (optional)",
      "highlights": [
        { "title": "string", "description": "string (optional)", "icon": "string (optional)" }
      ]
    }
  }

  19. STATS-WITH-ICONS - For compact stats with icons:
  {
    "type": "stats-with-icons",
    "props": {
      "title": "string (optional)",
      "description": "string (optional)",
      "stats": [
        { "label": "string", "value": "string", "icon": "string (optional)" }
      ]
    }
  }

  20. STEPS-OVERVIEW - For simple step-by-step overviews:
  {
    "type": "steps-overview",
    "props": {
      "title": "string (optional)",
      "description": "string (optional)",
      "steps": [
        { "title": "string", "description": "string (optional)", "icon": "string (optional)" }
      ]
    }
  }

  21. MEDIA-GALLERY - For image/media grids:
  {
    "type": "media-gallery",
    "props": {
      "title": "string (optional)",
      "description": "string (optional)",
      "items": [
        { "src": "string", "alt": "string (optional)", "caption": "string (optional)" }
      ]
    }
  }

RESPONSE FORMAT:
Return a JSON object with this EXACT structure:
{
  "components": [
    // Array of component objects using the structures above
  ],
  "metadata": {
    "title": "string - main title of the content",
    "description": "string - brief description of the content",
    "tags": ["array", "of", "relevant", "tags"]
  }
}

IMPORTANT RULES:
1. Use the EXACT prop names as shown above
2. Don't add extra properties not listed in the schemas
3. Mark required props must always be included
4. Optional props can be omitted if no relevant content exists
5. Arrays should contain objects with the exact structure shown
6. Return ONLY the JSON object, no explanations or markdown
7. ALWAYS include a "relevanceScore" property (0-100) in each component based on importance
8. ALWAYS include a "contentType" property indicating content category
9. Prefer diversity of component types; avoid repeating the same type when another suitable type exists.
10. Do NOT repeat information: if two sections/components contain overlapping or identical information, keep only ONE instance represented by the most suitable component type.
11. Avoid creating multiple components that express the same headline or description. Choose the best fit and omit duplicates.

COMPONENT SELECTION GUIDANCE:
- For individual person profiles: Use "leadership-card" type
- For multiple team members: Use "team-grid" type
- For team sections with mixed content: Use "section" with proper subsections structure
- For subsections: Always use "title" and "content" properties, NEVER "name" and "bio"
- Empty sections should be omitted entirely
- Assign relevanceScore: 90-100 (critical), 70-89 (important), 50-69 (useful), 30-49 (supplementary), 0-29 (skip)

ENHANCED RESPONSE FORMAT:
Return a JSON object with this EXACT structure:
{
  "components": [
    {
      "type": "component-type",
      "props": { /* component props */ },
      "relevanceScore": 85,
      "contentType": "core-business|leadership|services|contact|awards|background|process|other"
    }
  ],
  "metadata": {
    "title": "string - main title of the content",
    "description": "string - brief description of the content", 
    "tags": ["array", "of", "relevant", "tags"],
    "priorityLevel": "high|medium|low - overall content priority for microsite"
  }
}
`;

// Preprocess markdown to clean problematic content
function preprocessMarkdown(content: string): string {
  return (
    content
      // Remove or replace special characters that cause issues
      .replace(/■/g, "")
      .replace(/©/g, "(c)")
      // Clean up image references that point to non-existent files
      .replace(/!\[([^\]]*)\]\([^)]*\)/g, "")
      // Fix table formatting issues
      .replace(/\|\s*\|\s*\|\s*\|\s*\|\s*\|/g, "| | | | | |")
      // Remove multiple consecutive empty lines
      .replace(/\n\n\n+/g, "\n\n")
      // Trim whitespace
      .trim()
  );
}

// Default filtering configurations
export const FILTERING_PRESETS: Record<string, FilteringOptions> = {
  strict: {
    strictness: "strict",
    minRelevanceScore: 75,
    maxComponents: 8,
    prioritizeContentTypes: [
      "core-business",
      "leadership",
      "services",
      "contact",
    ],
    excludeContentTypes: ["background", "process", "other"],
  },
  moderate: {
    strictness: "moderate",
    minRelevanceScore: 60,
    maxComponents: 12,
    prioritizeContentTypes: [
      "core-business",
      "leadership",
      "services",
      "contact",
      "awards",
    ],
    excludeContentTypes: ["background"],
  },
  lenient: {
    strictness: "lenient",
    minRelevanceScore: 40,
    maxComponents: 20,
    prioritizeContentTypes: [],
    excludeContentTypes: [],
  },
};

// Build a normalized content signature to detect duplicates across components
function normalizeContentSignature(value: any): string {
  try {
    const raw = typeof value === "string" ? value : JSON.stringify(value);
    return raw
      .toLowerCase()
      .replace(/\\n/g, " ")
      .replace(/\s+/g, " ")
      .replace(/[^a-z0-9\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  } catch {
    return "";
  }
}

function extractTextualContent(value: any): string {
  if (value == null) return "";
  if (typeof value === "string") return value;
  if (Array.isArray(value)) {
    return value.map((v) => extractTextualContent(v)).join(" ");
  }
  if (typeof value === "object") {
    return Object.values(value)
      .map((v) => extractTextualContent(v))
      .join(" ");
  }
  return String(value);
}

function computeComponentSignature(component: ComponentData): string {
  // Use only textual content from props to detect duplicate information across types
  const props = component?.props || {};
  const text = extractTextualContent(props);
  return normalizeContentSignature(text);
}

// Intelligent content filtering based on relevance and importance
export function filterComponents(
  components: ComponentData[],
  options: FilteringOptions
): ComponentData[] {
  let filtered = components.filter((component) => {
    // Remove components with low relevance scores
    if (
      component.relevanceScore &&
      component.relevanceScore < options.minRelevanceScore
    ) {
      return false;
    }

    // Remove excluded content types
    if (
      component.contentType &&
      options.excludeContentTypes.includes(component.contentType)
    ) {
      return false;
    }

    return true;
  });

  // Sort by relevance score and content type priority
  filtered.sort((a, b) => {
    const aScore = a.relevanceScore || 0;
    const bScore = b.relevanceScore || 0;
    const aPriority =
      a.contentType && options.prioritizeContentTypes.includes(a.contentType)
        ? 10
        : 0;
    const bPriority =
      b.contentType && options.prioritizeContentTypes.includes(b.contentType)
        ? 10
        : 0;

    return bScore + bPriority - (aScore + aPriority);
  });

  // Encourage component diversity and prevent duplicates
  const TYPE_CAPS: Record<string, number> = {
    hero: 1,
    section: 2,
    quote: 2,
    testimonial: 2,
  };

  const kept: ComponentData[] = [];
  const typeCounts: Record<string, number> = {};
  const seenTypes = new Set<string>();
  const contentSignatures = new Set<string>();

  // Phase 1: prioritize diversity by taking at most one per type initially
  for (const comp of filtered) {
    const cap = TYPE_CAPS[comp.type] ?? Infinity;
    const currentCount = typeCounts[comp.type] || 0;
    if (currentCount >= cap) continue;

    if (seenTypes.has(comp.type)) continue; // one per type in phase 1

    const signature = computeComponentSignature(comp);
    if (signature && contentSignatures.has(signature)) continue;

    kept.push(comp);
    typeCounts[comp.type] = currentCount + 1;
    seenTypes.add(comp.type);
    if (signature) contentSignatures.add(signature);
    if (kept.length >= options.maxComponents) break;
  }

  // Phase 2: fill remaining slots respecting caps and dedup
  if (kept.length < options.maxComponents) {
    for (const comp of filtered) {
      if (kept.includes(comp)) continue;
      const cap = TYPE_CAPS[comp.type] ?? Infinity;
      const currentCount = typeCounts[comp.type] || 0;
      if (currentCount >= cap) continue;
      const signature = computeComponentSignature(comp);
      if (signature && contentSignatures.has(signature)) continue;

      kept.push(comp);
      typeCounts[comp.type] = currentCount + 1;
      if (signature) contentSignatures.add(signature);
      if (kept.length >= options.maxComponents) break;
    }
  }

  return kept;
}

// Split content into smaller, manageable chunks
function splitIntoSmartChunks(
  content: string,
  maxSize: number = 2500
): string[] {
  const sections = content.split(/\n(?=#{1,3}\s)/); // Split on major headers
  const chunks: string[] = [];
  let currentChunk = "";

  for (const section of sections) {
    if (
      currentChunk.length + section.length > maxSize &&
      currentChunk.length > 0
    ) {
      chunks.push(currentChunk.trim());
      currentChunk = section;
    } else {
      currentChunk += (currentChunk ? "\n\n" : "") + section;
    }
  }

  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}

// Enhanced error handling and JSON parsing
function parseAIResponse(content: string): any {
  if (!content) {
    throw new Error("Empty response from AI");
  }

  let jsonContent = content.trim();

  // Remove various markdown code block formats
  jsonContent = jsonContent
    .replace(/^```json\s*/, "")
    .replace(/^```\s*/, "")
    .replace(/\s*```$/, "")
    .replace(/^`\s*/, "")
    .replace(/\s*`$/, "");

  try {
    return JSON.parse(jsonContent);
  } catch (parseError) {
    // Try to extract JSON from mixed content
    const jsonMatch = jsonContent.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch (e) {
        console.error("Failed to parse extracted JSON:", e);
      }
    }

    console.error("Original content:", content);
    console.error("Cleaned content:", jsonContent);
    throw new Error(
      `Invalid JSON response from AI: ${
        parseError instanceof Error ? parseError.message : "Unknown error"
      }`
    );
  }
}

// Main parsing function - intelligent selection between single and chunked processing
export async function parseMarkdownRobust(
  markdownContent: string,
  filteringOptions: FilteringOptions = FILTERING_PRESETS.moderate
): Promise<ParsedContent> {
  try {
    // Preprocess the markdown to handle problematic content
    const cleanedContent = preprocessMarkdown(markdownContent);

    // Check if content is too large and needs chunking
    if (cleanedContent.length > 3000) {
      return await parseMarkdownByChunksRobust(
        cleanedContent,
        filteringOptions
      );
    }

    // Cache key for robust path
    const cacheKey = `robust:${cleanedContent.length}:${filteringOptions.strictness}:${filteringOptions.maxComponents}:${cleanedContent}`;
    const cached = getCache<ParsedContent>(cacheKey);
    if (cached) {
      return cached;
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // mini for lower latency
      messages: [
        {
          role: "system",
          content: COMPONENT_MAPPING_PROMPT,
        },
        {
          role: "user",
          content: cleanedContent,
        },
      ],
      temperature: 0,
      max_tokens: 1800,
    });

    const aiContent = response.choices[0]?.message?.content;
    if (!aiContent) {
      throw new Error("No response from OpenAI");
    }

    const parsed = parseAIResponse(aiContent);

    // Apply intelligent filtering
    const filteredComponents = filterComponents(
      parsed.components,
      filteringOptions
    );

    const result: ParsedContent = {
      ...parsed,
      components: filteredComponents,
    };
    setCache(cacheKey, result);
    return result;
  } catch (error) {
    console.error("Error in parseMarkdownRobust:", error);
    throw new Error(
      `Failed to parse markdown content: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

// Basic parsing function using GPT-4o for better quality
export async function parseMarkdownToComponents(
  markdownContent: string,
  filteringOptions: FilteringOptions = FILTERING_PRESETS.moderate
): Promise<ParsedContent> {
  try {
    // Cache key for basic path
    const cacheKey = `basic:${markdownContent.length}:${filteringOptions.strictness}:${filteringOptions.maxComponents}:${markdownContent}`;
    const cached = getCache<ParsedContent>(cacheKey);
    if (cached) {
      return cached;
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: COMPONENT_MAPPING_PROMPT,
        },
        {
          role: "user",
          content: markdownContent,
        },
      ],
      temperature: 0,
      max_tokens: 2000,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No response from OpenAI");
    }

    const parsed = parseAIResponse(content);

    // Apply intelligent filtering
    const filteredComponents = filterComponents(
      parsed.components,
      filteringOptions
    );

    const result: ParsedContent = {
      ...parsed,
      components: filteredComponents,
    };
    setCache(cacheKey, result);
    return result;
  } catch (error) {
    console.error("Error parsing markdown:", error);
    throw new Error("Failed to parse markdown content");
  }
}

// Chunked parsing for large content
export async function parseMarkdownByChunksRobust(
  markdownContent: string,
  filteringOptions: FilteringOptions = FILTERING_PRESETS.moderate
): Promise<ParsedContent> {
  const cleanedContent = preprocessMarkdown(markdownContent);
  const chunks = splitIntoSmartChunks(cleanedContent, 2500);
  const allComponents: ComponentData[] = [];
  let metadata = { title: "", description: "", tags: [] as string[] };

  // Parallel processing with basic concurrency control
  const CONCURRENCY = 3;
  let index = 0;

  async function processNext() {
    const i = index++;
    if (i >= chunks.length) return;
    const chunk = chunks[i];

    const chunkPrompt = `
    Parse this markdown chunk (${i + 1}/${chunks.length}) into components.
    ${
      i === 0
        ? "Extract title and description for metadata from this first chunk."
        : ""
    }

    CRITICAL: Return ONLY valid JSON. No explanations or markdown formatting.

    ${COMPONENT_MAPPING_PROMPT}
    `;

    try {
      const cacheKey = `chunk:${i}:${chunk.length}:${filteringOptions.strictness}:${filteringOptions.maxComponents}:${chunk}`;
      const cached = getCache<ParsedContent>(cacheKey);
      let parsed: any | null = null;
      if (cached) {
        parsed = cached;
      } else {
        const response = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: chunkPrompt },
            { role: "user", content: chunk },
          ],
          temperature: 0,
          max_tokens: 1500,
        });
        const aiContent = response.choices[0]?.message?.content;
        if (aiContent) {
          parsed = parseAIResponse(aiContent);
          setCache(cacheKey, parsed);
        }
      }

      if (parsed) {
        if (parsed.components && Array.isArray(parsed.components)) {
          allComponents.push(...parsed.components);
        }
        if (i === 0 && parsed.metadata) {
          metadata = {
            title: parsed.metadata.title || "Temus CxD Introduction",
            description:
              parsed.metadata.description ||
              "Comprehensive guide to Temus Consulting x Design services and capabilities",
            tags: parsed.metadata.tags || [
              "consulting",
              "design",
              "digital transformation",
            ],
          };
        }
      }
    } catch (error) {
      console.error(`Error parsing chunk ${i + 1}:`, error);
    }

    await processNext();
  }

  const workers: Promise<void>[] = [];
  for (let w = 0; w < Math.min(CONCURRENCY, chunks.length); w++) {
    workers.push(processNext());
  }
  await Promise.all(workers);

  // Apply intelligent filtering to all collected components
  const filteredComponents = filterComponents(allComponents, filteringOptions);

  return {
    components: filteredComponents,
    metadata,
  };
}

// Fallback parser for when AI fails
export function parseMarkdownFallback(markdownContent: string): ParsedContent {
  const lines = markdownContent.split("\n");
  const components: ComponentData[] = [];
  let currentSection = "";
  let currentContent: string[] = [];

  for (const line of lines) {
    if (line.startsWith("#")) {
      // Process previous section
      if (currentSection) {
        components.push({
          type: "section",
          props: {
            title: currentSection,
            content: currentContent.join("\n").trim(),
          },
        });
      }

      // Start new section
      currentSection = line.replace(/^#+\s*/, "");
      currentContent = [];
    } else if (line.trim()) {
      currentContent.push(line);
    }
  }

  // Process final section
  if (currentSection) {
    components.push({
      type: "section",
      props: {
        title: currentSection,
        content: currentContent.join("\n").trim(),
      },
    });
  }

  return {
    components,
    metadata: {
      title: "Document",
      description: "Parsed document content",
      tags: ["document"],
    },
  };
}
