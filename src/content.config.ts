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
      heroImage: image(),
      year: z.number().optional(),
      tools: z.array(z.string()).optional(),
      workType: z.array(z.string())
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
