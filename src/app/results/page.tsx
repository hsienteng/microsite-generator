"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Message } from "primereact/message";
import { DynamicPage } from "@/components/DynamicComponents";
import { ComponentData } from "@/lib/markdownParser";
import {
  FlexibleComponentData,
  StructuredApiResponse,
} from "@/lib/componentSchema";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  useComponentsStore,
  useParsedData,
  useGenerationOptions,
  useHasHydrated,
} from "@/store/componentsStore";

interface ParsedMetadata {
  title: string;
  description: string;
  tags: string[];
}

export default function ResultsPage() {
  const [components, setComponents] = useState<
    ComponentData[] | FlexibleComponentData[]
  >([]);
  const [metadata, setMetadata] = useState<ParsedMetadata | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [processingInfo, setProcessingInfo] = useState<any>(null);
  const router = useRouter();

  // Use Zustand store for data management
  const { parsedComponents, originalMarkdown, getMetadata } = useParsedData();
  const { generationOptions } = useGenerationOptions();
  const { clearAll } = useComponentsStore();
  const hasHydrated = useHasHydrated();

  const { useIntelligentSelection } = generationOptions;

  useEffect(() => {
    // Wait for hydration before accessing store data
    if (!hasHydrated) {
      return;
    }

    // Load data from Zustand store
    try {
      if (!parsedComponents) {
        setError(
          "No parsed data found. Please go back and generate a page first."
        );
        setIsLoading(false);
        return;
      }

      // Handle both old and new response formats
      const parsedData = parsedComponents;

      // Check if it's the new structured response format
      if (parsedData.success !== undefined) {
        // New structured format
        const structuredResponse = parsedData as StructuredApiResponse;
        setComponents(structuredResponse.data.components);
        setMetadata({
          title: structuredResponse.data.metadata.title,
          description: structuredResponse.data.metadata.description,
          tags: structuredResponse.data.metadata.tags,
        });
        setWarnings(structuredResponse.warnings || []);
        setProcessingInfo(structuredResponse.data.metadata.processingInfo);
      } else {
        // Legacy format - transform as before
        const transformedComponents = Array.isArray(parsedData)
          ? parsedData.map((component: any) => {
              if (component.content && !component.props) {
                return { ...component, props: component.content };
              }
              return component;
            })
          : [];

        setComponents(transformedComponents);
        const storeMetadata = getMetadata();
        if (storeMetadata) {
          setMetadata(storeMetadata as ParsedMetadata);
        }
      }

      setIsLoading(false);
    } catch (err) {
      setError("Failed to load parsed data");
      setIsLoading(false);
      console.error("Error loading parsed data:", err);
    }
  }, [hasHydrated, parsedComponents, getMetadata]);

  const handleGoBack = () => {
    // Clear Zustand store and go back to home
    clearAll();
    router.push("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="p-8 shadow-xl">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-600 border-t-transparent mx-auto mb-6"></div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Building Your Microsite
            </h2>
            <p className="text-gray-600">
              AI is crafting your website with intelligent components...
            </p>
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Card className="mb-8 shadow-xl">
              <div className="p-8 text-center">
                <i className="pi pi-exclamation-triangle text-6xl text-red-500 mb-6"></i>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  Oops! Something went wrong
                </h2>
                <Message severity="error" text={error} className="mb-6" />
                <Button
                  label="Start Over"
                  icon="pi pi-home"
                  onClick={handleGoBack}
                  className="p-button-outlined text-white"
                  size="large"
                />
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors duration-200">
      {/* Navigation Header */}
      <nav className="bg-white dark:bg-black shadow-lg border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
        <div className="container mx-auto p-4">
          <div className="flex justify-between items-center gap-3">
            <div className="flex items-center gap-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {metadata?.title || "Generated Microsite"}
                </h1>
                {metadata?.description && (
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {metadata.description}
                  </p>
                )}
              </div>
              {metadata?.tags && metadata.tags.length > 0 && (
                <div className="flex gap-1">
                  {metadata.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-red-600 text-white px-3 py-1 rounded text-sm font-medium flex items-center"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="flex items-center">
              <ThemeToggle showLabel={false} />
              <Button
                label="New Site"
                icon="pi pi-plus"
                onClick={handleGoBack}
                className="p-button-outlined whitespace-nowrap"
              />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div>
        {/* Page Info Banner */}
        <div className="bg-black text-white py-6">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <i className="pi pi-check-circle text-green-400"></i>
                  <span className="text-sm">
                    {components.length} components generated
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <i className="pi pi-brain text-blue-300"></i>
                  <span className="text-sm">
                    {processingInfo?.strategy
                      ? `Strategy: ${processingInfo.strategy}${
                          processingInfo.fallbackUsed ? " (fallback)" : ""
                        }`
                      : useIntelligentSelection
                      ? "AI-Powered Selection"
                      : "Basic Parsing"}
                  </span>
                </div>
                {warnings.length > 0 && (
                  <div className="flex items-center gap-2">
                    <i className="pi pi-exclamation-triangle text-yellow-300"></i>
                    <span className="text-sm">{warnings.length} warnings</span>
                  </div>
                )}
              </div>
              <div className="text-sm opacity-90">
                Generated at {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>

        {/* Warnings Section */}
        {warnings.length > 0 && (
          <div className="bg-yellow-50 border-b border-yellow-200">
            <div className="container mx-auto px-4 py-4">
              <div className="max-w-6xl mx-auto">
                <details className="group">
                  <summary className="flex items-center gap-2 cursor-pointer text-yellow-700 hover:text-yellow-800">
                    <i className="pi pi-exclamation-triangle"></i>
                    <span className="font-medium">
                      Processing Warnings ({warnings.length})
                    </span>
                    <i className="pi pi-chevron-down transition-transform group-open:rotate-180"></i>
                  </summary>
                  <div className="mt-3 space-y-1">
                    {warnings.map((warning, index) => (
                      <div
                        key={index}
                        className="text-sm text-yellow-600 bg-yellow-100 px-3 py-2 rounded"
                      >
                        {warning}
                      </div>
                    ))}
                  </div>
                </details>
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <DynamicPage components={components} />
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-black text-white py-12 mt-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">About This Site</h3>
                <p className="text-gray-400 text-sm">
                  This microsite was generated using AI-powered component
                  selection, creating a dynamic and responsive web experience.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <Button
                    label="Download Original"
                    icon="pi pi-download"
                    onClick={() => {
                      const blob = new Blob([originalMarkdown], {
                        type: "text/markdown",
                      });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = "original-content.md";
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="p-button-text p-button-sm text-gray-400"
                  />
                  <Button
                    label="Generate New Site"
                    icon="pi pi-plus"
                    onClick={handleGoBack}
                    className="p-button-text p-button-sm text-gray-400"
                  />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Site Info</h3>
                <div className="text-gray-400 text-sm space-y-1">
                  <p>Components: {components.length}</p>
                  <p>
                    Generation:{" "}
                    {useIntelligentSelection ? "AI-Powered" : "Basic"}
                  </p>
                  <p>Created: {new Date().toLocaleDateString()}</p>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-8 pt-8 text-center">
              <p className="text-gray-400 text-sm">
                Generated with AI-powered component selection •
                <Button
                  label="View Source"
                  icon="pi pi-code"
                  onClick={() => {
                    const blob = new Blob([originalMarkdown], {
                      type: "text/markdown",
                    });
                    const url = URL.createObjectURL(blob);
                    window.open(url, "_blank");
                    URL.revokeObjectURL(url);
                  }}
                  className="p-button-link p-0 ml-2 text-gray-400"
                />
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
