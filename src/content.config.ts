import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

// Collection of my professional works:
const works = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/works" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      // Transform string to Date object
      pubDate: z
        .string()
        .or(z.date())
        .transform((val) => new Date(val)),
      updatedDate: z
        .string()
        .optional()
        .transform((str) => (str ? new Date(str) : undefined)),
      heroImage: image().optional(),
      year: z.number().optional(),
      tools: z.array(z.string()).optional(),
      workType: z.array(
        z.enum(["Games", "Installations", "Sound & Music", "Web & Code"]),
      ),
      // == Editorial fields (phase 2) — all optional ==
      // Short lowercase label shown in the work index row (e.g. "game",
      // "installation", "sound", "web"). Derived from workType when absent.
      medium: z.string().optional(),
      // Case study: single intent paragraph. No placeholder is rendered when
      // missing — the build logs which works lack it.
      intent: z.string().optional(),
      // Case study: optional 2–3 process images rendered as a two-up grid.
      processMedia: z.array(image()).optional(),
      // Case study: short technical section under a mono "technical note" label.
      technicalDetail: z.string().optional(),
      // Metadata footer: YEAR · STACK · ROLE. `stack` falls back to `tools`.
      stack: z.array(z.string()).optional(),
      role: z.string().optional(),
      // Narrative homepage: works with featuredOrder appear as the three
      // full-viewport featured sections, sorted ascending.
      featuredOrder: z.number().optional(),
    }),
});

// Collection of blog posts:
const blog = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      summary: z.string().optional(),
      pubDate: z
        .string()
        .or(z.date())
        .transform((val) => new Date(val)),
      heroImage: image().optional(),
      tags: z.array(z.string()).optional(),
    }),
});

export const collections = { works, blog };
