import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import react from "@astrojs/react";

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
    service: {
      entrypoint: 'astro/assets/services/noop'
  },
}
});
