/**
 * Utility functions for handling paths in different deployment environments
 */

/**
 * Get the base path for the application
 * Returns the base path for GitHub Pages deployment or empty string for other deployments
 */
export function getBasePath(): string {
  // Check if we're in production and using GitHub Pages
  if (typeof window !== "undefined") {
    // Client-side: check the current pathname
    const isGitHubPages = window.location.hostname.includes("github.io");
    const hasSubdirectory = window.location.pathname.startsWith(
      "/microsite-generator"
    );

    if (isGitHubPages && hasSubdirectory) {
      return "/microsite-generator";
    }
  } else {
    // Server-side: check environment variables
    if (process.env.NODE_ENV === "production" && process.env.GITHUB_PAGES) {
      return "/microsite-generator";
    }
  }

  return "";
}

/**
 * Get the full URL for a public asset
 * @param path - The path to the asset (e.g., '/hcd.md')
 * @returns The full path including base path if needed
 */
export function getAssetPath(path: string): string {
  const basePath = getBasePath();

  // Ensure path starts with /
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return `${basePath}${normalizedPath}`;
}

/**
 * Get the full URL for an API endpoint
 * @param path - The API path (e.g., '/api/parse-markdown')
 * @returns The full path including base path if needed
 */
export function getApiPath(path: string): string {
  const basePath = getBasePath();

  // Ensure path starts with /
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return `${basePath}${normalizedPath}`;
}
