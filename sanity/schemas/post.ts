/**
 * Post Schema for Sanity Studio
 * 
 * USAGE: Copy this file to your Sanity Studio project and import it in your schema index.
 * 
 * Your Sanity Studio is likely at: https://www.sanity.io/manage/project/ztpln7un
 * 
 * Add to your sanity.config.ts:
 * import post from './schemas/post'
 * 
 * Then include it in the schema definition:
 * schema: {
 *   types: [post, ...otherSchemas]
 * }
 */

import { defineArrayMember, defineField, defineType } from "sanity";

export default defineType({
  name: "post",
  title: "Blog Post",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "summary",
      title: "Summary",
      type: "text",
      rows: 3,
      description: "A brief summary of the blog post for SEO and previews",
    }),
    defineField({
      name: "deck",
      title: "Deck / standfirst",
      type: "text",
      rows: 2,
      description:
        "One-sentence thesis shown under the title, before the image",
    }),
    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "mainImage",
      title: "Main Image",
      type: "image",
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternative text",
          description: "Important for SEO and accessibility",
        },
      ],
    }),
    defineField({
      name: "heroCaption",
      title: "Hero caption",
      type: "string",
      description:
        "Required whenever a main image is set — anchored to the text column",
    }),
    defineField({
      name: "heroCredit",
      title: "Hero credit",
      type: "string",
      description: "Optional credit, rendered after the caption",
    }),
    defineField({
      name: "heroWidth",
      title: "Hero width",
      type: "string",
      options: {
        list: [
          { title: "Text (65ch)", value: "text" },
          { title: "Wide (default)", value: "wide" },
          { title: "Full", value: "full" },
        ],
        layout: "radio",
      },
      initialValue: "wide",
    }),
    defineField({
      name: "meta",
      title: "Extra metadata pairs",
      type: "array",
      description:
        "Optional labeled pairs for the header metadata row (e.g. ARCHIVE / 2024–2025)",
      of: [
        {
          type: "object",
          fields: [
            { name: "label", type: "string", title: "Label" },
            { name: "value", type: "string", title: "Value" },
          ],
          preview: {
            select: { title: "label", subtitle: "value" },
          },
        },
      ],
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
      options: {
        layout: "tags",
      },
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "H1", value: "h1" },
            { title: "H2", value: "h2" },
            { title: "H3", value: "h3" },
            { title: "H4", value: "h4" },
            { title: "Quote", value: "blockquote" },
          ],
          marks: {
            decorators: [
              { title: "Bold", value: "strong" },
              { title: "Italic", value: "em" },
              { title: "Code", value: "code" },
              { title: "Underline", value: "underline" },
              { title: "Strike", value: "strike-through" },
            ],
            annotations: [
              {
                name: "link",
                type: "object",
                title: "Link",
                fields: [
                  {
                    name: "href",
                    type: "url",
                    title: "URL",
                    validation: (Rule) =>
                      Rule.uri({
                        scheme: ["http", "https", "mailto", "tel"],
                      }),
                  },
                  {
                    name: "blank",
                    type: "boolean",
                    title: "Open in new tab",
                    initialValue: true,
                  },
                ],
              },
            ],
          },
        },
        {
          type: "image",
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: "alt",
              type: "string",
              title: "Alternative text",
            },
            {
              name: "caption",
              type: "string",
              title: "Caption",
            },
            {
              name: "width",
              type: "string",
              title: "Figure width",
              options: {
                list: [
                  { title: "Text (65ch)", value: "text" },
                  { title: "Wide (default)", value: "wide" },
                  { title: "Full", value: "full" },
                ],
                layout: "radio",
              },
            },
          ],
        },
        {
          type: "code",
          title: "Code Block",
          options: {
            withFilename: true,
          },
        },
        defineArrayMember({
          type: 'youTube'
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
      date: "publishedAt",
      media: "mainImage",
    },
    prepare(selection) {
      const { title, date, media } = selection;
      return {
        title,
        subtitle: date
          ? new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
          : "No date",
        media,
      };
    },
  },
  orderings: [
    {
      title: "Published Date, Newest",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
    {
      title: "Published Date, Oldest",
      name: "publishedAtAsc",
      by: [{ field: "publishedAt", direction: "asc" }],
    },
  ],
});
