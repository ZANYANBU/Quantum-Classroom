import type { NextConfig } from "next";

// GITHUB_PAGES=1 builds the static live demo served from
// https://zanyanbu.github.io/Quantum-Classroom/ (see .github/workflows/pages.yml).
const forPages = process.env.GITHUB_PAGES === "1";

const nextConfig: NextConfig = forPages
  ? {
      output: "export",
      basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
      trailingSlash: true,
      images: { unoptimized: true },
    }
  : {};

export default nextConfig;
