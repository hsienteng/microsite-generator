"use client";

import { useState } from "react";
import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";
import { Card } from "primereact/card";
import { ProgressSpinner } from "primereact/progressspinner";
import { Message } from "primereact/message";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  useComponentsStore,
  useGenerationOptions,
} from "@/store/componentsStore";

export default function Home() {
  const [markdownContent, setMarkdownContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const { generationOptions, setGenerationOptions } = useGenerationOptions();
  const { setParsedComponents, setOriginalMarkdown } = useComponentsStore();

  const { useIntelligentSelection, filteringStrictness } = generationOptions;

  const handleParse = async () => {
    if (!markdownContent.trim()) {
      setError("Please enter some markdown content");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/parse-markdown", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          markdownContent,
          useIntelligentSelection,
          filteringStrictness,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to parse markdown");
      }

      const data = await response.json();

      setParsedComponents(data);
      setOriginalMarkdown(markdownContent);

      // Navigate to the results page
      router.push("/results");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const loadSampleData = async () => {
    try {
      const response = await fetch("/hcd.md");
      const content = await response.text();
      setMarkdownContent(content);
    } catch (err) {
      setError("Failed to load sample data");
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors duration-200">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Theme Toggle */}
          <div className="flex justify-end mb-6">
            <ThemeToggle />
          </div>

          {/* Header */}
          <div className="text-center mb-12">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-600 dark:bg-gray-800 rounded-full mb-4">
                <i className="pi pi-globe text-3xl text-white"></i>
              </div>
              <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
                AI Microsite Generator
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
                Transform your content into a complete, professional microsite
                with AI-powered component selection
              </p>
            </div>

            {/* Feature highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <Card className="text-center shadow-lg hover:shadow-xl transition-shadow bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                <div className="p-6">
                  <div className="w-16 h-16 bg-primary-600 dark:bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="pi pi-cog text-2xl text-white dark:text-black"></i>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                    AI-Powered Design
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Intelligent component selection creates the perfect layout
                    for your content
                  </p>
                </div>
              </Card>

              <Card className="text-center shadow-lg hover:shadow-xl transition-shadow bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                <div className="p-6">
                  <div className="w-16 h-16 bg-primary-600 dark:bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="pi pi-palette text-2xl text-white dark:text-black"></i>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                    Up to 24 Component Types
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    From hero sections to testimonials, timeline to team grids
                  </p>
                </div>
              </Card>

              <Card className="text-center shadow-lg hover:shadow-xl transition-shadow bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                <div className="p-6">
                  <div className="w-16 h-16 bg-primary-600 dark:bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="pi pi-bolt text-2xl text-white dark:text-black"></i>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                    Instant Deployment
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Generate a complete microsite in seconds with responsive
                    design
                  </p>
                </div>
              </Card>
            </div>
          </div>

          {/* How It Works */}
          <div className="my-16">
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600 dark:text-blue-300">
                    1
                  </span>
                </div>
                <h3 className="text-lg text-gray-900 dark:text-white font-semibold mb-2">
                  Input Content
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Paste your markdown content or load sample data
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-purple-600 dark:text-purple-300">
                    2
                  </span>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                  AI Analysis
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  AI analyzes content structure and selects appropriate
                  components
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-green-600 dark:text-green-300">
                    3
                  </span>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                  Component Generation
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Creates dynamic components with responsive design
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-orange-600 dark:text-orange-300">
                    4
                  </span>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                  Live Microsite
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Your complete microsite is ready to use
                </p>
              </div>
            </div>
          </div>

          {/* Input Section */}
          <Card className="mb-8 shadow-xl bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
            <div className="p-8">
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="flex-1">
                  <label className="block text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Your Content
                  </label>
                  <InputTextarea
                    value={markdownContent}
                    onChange={(e) => setMarkdownContent(e.target.value)}
                    rows={16}
                    placeholder="Enter your markdown content here... This will be transformed into a complete microsite with intelligent component selection."
                    className="w-full text-base p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-primary-500 dark:focus:border-primary-400 focus:ring-1 focus:ring-primary-500 dark:focus:ring-primary-400 transition-colors"
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    The AI will analyze your content and create the most
                    appropriate components for each section.
                  </p>
                </div>

                <div className="lg:w-80">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Generation Options
                      </label>
                      <div className="space-y-4">
                        <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <input
                            type="checkbox"
                            id="intelligent"
                            checked={useIntelligentSelection}
                            onChange={(e) =>
                              setGenerationOptions({
                                useIntelligentSelection: e.target.checked,
                              })
                            }
                            className="mr-3 w-5 h-5"
                          />
                          <label
                            htmlFor="intelligent"
                            className="text-gray-900 dark:text-white"
                          >
                            <div className="font-medium">
                              AI-Powered Selection
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-300">
                              Let AI choose the best components for your content
                            </div>
                          </label>
                        </div>

                        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <label className="block text-gray-900 dark:text-white font-medium mb-3">
                            Content Filtering
                          </label>
                          <select
                            value={filteringStrictness}
                            onChange={(e) =>
                              setGenerationOptions({
                                filteringStrictness: e.target.value as
                                  | "strict"
                                  | "moderate"
                                  | "lenient",
                              })
                            }
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white bg-white dark:bg-gray-700"
                          >
                            <option value="strict">
                              Strict - Only essential content (8 components max)
                            </option>
                            <option value="moderate">
                              Moderate - Important content (12 components max)
                            </option>
                            <option value="lenient">
                              Lenient - Include most content (20 components max)
                            </option>
                          </select>
                          <div className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                            Controls how much content is included in your
                            microsite
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Button
                        label="Load Sample Site"
                        icon="pi pi-download"
                        onClick={loadSampleData}
                        className="w-full dark:text-white text-black"
                        size="large"
                      />

                      <Button
                        label="Generate Microsite"
                        icon="pi pi-bolt"
                        onClick={handleParse}
                        loading={isLoading}
                        className="w-full dark:text-white text-black"
                        size="large"
                        disabled={!markdownContent.trim()}
                      />
                    </div>

                    {error && (
                      <Message
                        severity="error"
                        text={error}
                        className="w-full"
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Loading Section */}
          {isLoading && (
            <Card className="mb-8 shadow-xl bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
              <div className="p-12 text-center">
                <ProgressSpinner style={{ width: "60px", height: "60px" }} />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-6 mb-3">
                  Building Your Microsite
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  AI is analyzing your content and selecting the perfect
                  components...
                </p>
                <div className="flex justify-center space-x-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-green-600 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
