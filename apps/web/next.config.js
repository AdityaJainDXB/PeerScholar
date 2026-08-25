/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Static export so the site can be hosted for free on GitHub Pages —
  // see .github/workflows/deploy.yml and docs/ARCHITECTURE.md.
  output: "export",
  images: {
    // next/image's optimizer needs a server; static export has none, and
    // Google avatar URLs are already served pre-sized.
    unoptimized: true,
  },
};

module.exports = nextConfig;
