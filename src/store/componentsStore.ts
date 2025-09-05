import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface ParsedMetadata {
  [key: string]: any;
}

export interface ParsedComponentsData {
  data?: {
    metadata: ParsedMetadata;
    [key: string]: any;
  };
  metadata?: ParsedMetadata;
  [key: string]: any;
}

export interface GenerationOptions {
  useIntelligentSelection: boolean;
  filteringStrictness: "strict" | "moderate" | "lenient";
}

interface ComponentsState {
  // Parsed data from API
  parsedComponents: ParsedComponentsData | null;
  parsedMetadata: ParsedMetadata | null;
  originalMarkdown: string;

  // Generation options
  generationOptions: GenerationOptions;

  // Hydration state
  _hasHydrated: boolean;

  // Actions
  setParsedComponents: (data: ParsedComponentsData) => void;
  setParsedMetadata: (metadata: ParsedMetadata) => void;
  setOriginalMarkdown: (markdown: string) => void;
  setGenerationOptions: (options: Partial<GenerationOptions>) => void;
  setHasHydrated: (hasHydrated: boolean) => void;

  // Utility actions
  clearAll: () => void;

  // Helper getters
  getMetadata: () => ParsedMetadata | null;
}

const initialGenerationOptions: GenerationOptions = {
  useIntelligentSelection: true,
  filteringStrictness: "moderate",
};

export const useComponentsStore = create<ComponentsState>()(
  persist(
    (set, get) => ({
      // Initial state
      parsedComponents: null,
      parsedMetadata: null,
      originalMarkdown: "",
      generationOptions: initialGenerationOptions,
      _hasHydrated: false,

      // Actions
      setParsedComponents: (data: ParsedComponentsData) => {
        set({ parsedComponents: data });

        // Also extract and set metadata for backward compatibility
        if (data.data?.metadata) {
          // New structured format
          set({ parsedMetadata: data.data.metadata });
        } else if (data.metadata) {
          // Legacy format
          set({ parsedMetadata: data.metadata });
        }
      },

      setParsedMetadata: (metadata: ParsedMetadata) => {
        set({ parsedMetadata: metadata });
      },

      setOriginalMarkdown: (markdown: string) => {
        set({ originalMarkdown: markdown });
      },

      setGenerationOptions: (options: Partial<GenerationOptions>) => {
        set((state) => ({
          generationOptions: { ...state.generationOptions, ...options },
        }));
      },

      setHasHydrated: (hasHydrated: boolean) => {
        set({ _hasHydrated: hasHydrated });
      },

      clearAll: () => {
        set({
          parsedComponents: null,
          parsedMetadata: null,
          originalMarkdown: "",
          generationOptions: initialGenerationOptions,
        });
      },

      // Helper getters
      getMetadata: () => {
        const state = get();
        return (
          state.parsedMetadata ||
          state.parsedComponents?.data?.metadata ||
          state.parsedComponents?.metadata ||
          null
        );
      },
    }),
    {
      name: "components-storage", // unique name for localStorage key
      storage: createJSONStorage(() => {
        // Safely access localStorage with fallback
        try {
          return localStorage;
        } catch {
          // Fallback for SSR or when localStorage is not available
          return {
            getItem: () => null,
            setItem: () => {},
            removeItem: () => {},
          };
        }
      }),
      // Only persist the data, not the actions or hydration state
      partialize: (state) => ({
        parsedComponents: state.parsedComponents,
        parsedMetadata: state.parsedMetadata,
        originalMarkdown: state.originalMarkdown,
        generationOptions: state.generationOptions,
      }),
      onRehydrateStorage: () => (state) => {
        // Set hydration flag when store is rehydrated from localStorage
        if (state) {
          state.setHasHydrated(true);
        }
      },
      // Skip hydration during SSR
      skipHydration: typeof window === "undefined",
    }
  )
);

// Hook to check if the store has been hydrated from localStorage
export const useHasHydrated = () => {
  const hasHydrated = useComponentsStore((state) => state._hasHydrated);
  return hasHydrated;
};

// Convenience hook for accessing just the generation options
export const useGenerationOptions = () => {
  const { generationOptions, setGenerationOptions } = useComponentsStore();
  return { generationOptions, setGenerationOptions };
};

// Convenience hook for accessing parsed data
export const useParsedData = () => {
  const { parsedComponents, parsedMetadata, originalMarkdown, getMetadata } =
    useComponentsStore();
  return { parsedComponents, parsedMetadata, originalMarkdown, getMetadata };
};
