/** @type {import('next').NextConfig} */
const nextConfig = {
  // appDir is now stable in Next.js 13.4+, no need for experimental flag
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // GitHub Pages serves from a subdirectory if not using custom domain
  // Remove basePath and assetPrefix if using custom domain
  ...(process.env.NODE_ENV === "production" &&
    process.env.GITHUB_PAGES && {
      basePath: "/microsite-generator",
      assetPrefix: "/microsite-generator/",
    }),
};

module.exports = nextConfig;
