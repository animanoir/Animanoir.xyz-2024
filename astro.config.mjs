import { defineConfig, sharpImageService } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import react from "@astrojs/react";
import dotenv from "dotenv";

dotenv.config();

// https://astro.build/config
export default defineConfig({
  site: "https://animanoir.xyz",
  integrations: [mdx(), sitemap(), react()],
  prefetch: {
    defaultStrategy: "viewport",
  },
  experimental: {
    clientPrerender: true,
  },
  image: {
    domains: ["astro.build"],
    remotePatterns: [{ protocol: "https" }],
    service: sharpImageService({
      quality: 80,
      formats: ['jpeg', 'webp'],
      maxWidth: 1920,
      maxHeight: 1080,
      fit: 'cover',
      position: 'center',
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    })
  }
});