// next/image with images.unoptimized (required for static export) renders a
// plain <img> and does NOT auto-prepend basePath the way next/link and the
// optimized image loader do. Any hand-written "/foo.png" reference to a
// public/ asset needs this helper so it still resolves once GitHub Pages
// serves the site from /<repo>/ instead of the domain root.
export function withBasePath(path: string): string {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  return `${basePath}${path}`;
}
