import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { getAllPosts } from "../lib/sanity";
import { SITE_TITLE, SITE_DESCRIPTION } from "../consts";

export async function GET(context) {
  const works = await getCollection("works");
  const posts = await getAllPosts();

  const worksItems = works.map((work) => ({
    ...work.data,
    link: `/works/${work.slug}/`,
    pubDate: work.data.pubDate, // Ensure this field exists in your content collection schema
  }));

  const postsItems = posts.map((post) => ({
    title: post.title,
    description: post.summary || "",
    pubDate: new Date(post.publishedAt),
    link: `/blog/${post.slug.current}/`,
  }));

  const items = [...worksItems, ...postsItems].sort(
    (a, b) => new Date(b.pubDate).valueOf() - new Date(a.pubDate).valueOf()
  );

  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site,
    items,
  });
}
