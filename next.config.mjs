import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
const projectRoot = dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath,
  assetPrefix: basePath,
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  turbopack: {
    root: projectRoot
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
    NEXT_PUBLIC_TEACHER_MODE: process.env.NEXT_PUBLIC_TEACHER_MODE || "off"
  }
};

export default nextConfig;
