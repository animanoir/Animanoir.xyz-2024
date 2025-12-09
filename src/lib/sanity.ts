import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

// Sanity client configuration
export const client = createClient({
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: import.meta.env.PUBLIC_SANITY_DATASET || "production",
  useCdn: true,
  apiVersion: "2024-01-01",
});

// Image URL builder
const builder = imageUrlBuilder(client);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function urlFor(source: any) {
  return builder.image(source);
}

// TypeScript interfaces for Sanity data
export interface SanityPost {
  _id: string;
  title: string;
  slug: { current: string };
  summary?: string;
  publishedAt: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mainImage?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body?: any[]; // Portable Text blocks
  tags?: string[];
}

// GROQ queries
const postFields = `
  _id,
  title,
  slug,
  summary,
  publishedAt,
  mainImage,
  body,
  tags
`;

/**
 * Fetch all blog posts, sorted by publication date (newest first)
 */
export async function getAllPosts(): Promise<SanityPost[]> {
  return await client.fetch(
    `*[_type == "post"] | order(publishedAt desc) {
      ${postFields}
    }`
  );
}

/**
 * Fetch a single blog post by its slug
 */
export async function getPostBySlug(slug: string): Promise<SanityPost | null> {
  return await client.fetch(
    `*[_type == "post" && slug.current == $slug][0] {
      ${postFields}
    }`,
    { slug }
  );
}

/**
 * Fetch all post slugs for static path generation
 */
export async function getAllPostSlugs(): Promise<{ slug: string }[]> {
  const posts = await client.fetch(
    `*[_type == "post"] { "slug": slug.current }`
  );
  return posts;
}

