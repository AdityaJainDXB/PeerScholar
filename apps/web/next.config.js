// GitHub Pages serves this as a project page at /<repo-name>/, not at the
// domain root, so every asset URL Next.js emits needs that prefix. Only set
// in CI (see .github/workflows/deploy.yml) — local dev stays at "/".
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Static export so the site can be hosted for free on GitHub Pages —
  // see .github/workflows/deploy.yml and docs/ARCHITECTURE.md.
  output: "export",
  basePath,
  assetPrefix: basePath,
  // Emit `route/index.html` instead of `route.html`. On GitHub Pages this
  // makes URLs with a trailing slash resolve (they 404 otherwise), and it
  // fixes the home route's RSC prefetch, which otherwise requests
  // `/<basePath>.txt` — a path that can't exist — on every page load.
  trailingSlash: true,
  images: {
    // next/image's optimizer needs a server; static export has none, and
    // Google avatar URLs are already served pre-sized.
    unoptimized: true,
  },
};

module.exports = nextConfig;
