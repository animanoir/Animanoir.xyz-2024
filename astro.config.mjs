import { defineConfig, sharpImageService } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import react from "@astrojs/react";
import dotenv from "dotenv";
import lenis from "astro-lenis";

dotenv.config();

// https://astro.build/config
export default defineConfig({
  site: "https://animanoir.xyz",
  integrations: [mdx(), sitemap(), react(), lenis()],
  prefetch: {
    defaultStrategy: "viewport",
  },
  experimental: {
    clientPrerender: true,
  },
  image: {
    domains: ["youtube.com", "s3.amazonaws.com", "notion.so", "prod-files-secure.s3.us-west-2.amazonaws.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.s3.amazonaws.com",
        pathname: "/**"
      },
      {
        protocol: "https",
        hostname: "**.notion.so",
        pathname: "/**"
      },
      {
        protocol: "https",
        hostname: "prod-files-secure.s3.us-west-2.amazonaws.com",
        pathname: "/**"
      }
    ],
    service: sharpImageService({
      quality: 90,
      formats: ['jpg','webp'],
      maxWidth: 1920,
      maxHeight: 1080,
      fit: 'cover',
      position: 'center',
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    })
  },
  prefetch: {
    prefetchAll: true
  },
  vite: {
    resolve: {
      alias: {
        'three/examples/jsm': 'three/examples/jsm',
      },
    },
  },
});
