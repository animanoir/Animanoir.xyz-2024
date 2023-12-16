import { defineCollection, z } from "astro:content";

// Collection of my professional works:
const works = defineCollection({
  // Type-check frontmatter using a schema
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
      tools: z.array(z.string()).optional(),
    }),
});

// Collection of blog posts:
const blog = defineCollection({
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      summary: z.string().optional(),
      pubDate: z
        .string()
        .or(z.date())
        .transform((val) => new Date(val)),
      heroImage: z.string().optional(),
      tags: z.array(z.string()).optional(),
    }),
});

export const collections = { works, blog };
