import { defineType, defineField } from "sanity";
import { ComposeIcon } from "@sanity/icons";
export const blogPostType = defineType({
  name: "blogPost",
  title: "Blog Post",
  type: "document",
  icon: ComposeIcon,
  groups: [
    { name: "identity", title: "Identity" },
    { name: "content", title: "Content" },
    { name: "publish", title: "Publish" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    // Identity
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "identity",
      validation: (Rule) =>
        Rule.required()
          .error("Title is required.")
          .max(150)
          .error("Title cannot exceed 150 characters."),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "identity",
      options: { source: "title" },
      validation: (Rule) => Rule.required().error("Slug is required."),
    }),
    defineField({
      name: "type",
      type: "string",
      title: "Post Type",
      group: "identity",
      options: {
        list: ["Dev Log", "Tutorial", "Opinion", "Update"],
        layout: "radio",
      },
      initialValue: "Dev Log",
    }),
    // Content
    defineField({
      name: "excerpt",
      type: "text",
      group: "content",
      rows: 2,
      validation: (Rule) => Rule.required().min(40).max(210),
    }),
    defineField({
      name: "coverImage",
      type: "image",
      options: {
        hotspot: true,
      },
      group: "content",
      fields: [
        defineField({
          name: "alt",
          type: "string",
          title: "Alternative text",
          validation: (rule) =>
            rule.custom((value, context) => {
              const parent = context?.parent as { asset?: { _ref?: string } };
              return !value && parent?.asset?._ref
                ? "Alternative text is recommended when an image is used"
                : true;
            }),
        }),
      ],
      validation: (Rule) => Rule.required().error("Cover image is required."),
    }),
    defineField({
      name: "body",
      type: "blockContent",
    }),

    defineField({
      name: "author",
      type: "reference",
      to: [{ type: "author" }],
      group: "publish",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "publishedAt",
      type: "datetime",
      group: "publish",
      initialValue: () => new Date().toISOString(),
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "featured",
      type: "boolean",
      group: "publish",
      initialValue: false,
    }),
    defineField({
      name: "readingTime",
      title: "Reading Time (min)",
      type: "number",
      group: "publish",
      description: "Optional manual override; otherwise compute on frontend.",
      validation: (Rule) => Rule.min(1).max(60),
    }),
    defineField({
      name: "seoTitle",
      type: "string",
      group: "seo",
      validation: (Rule) => Rule.max(60),
    }),
    defineField({
      name: "seoDescription",
      type: "text",
      group: "seo",
      rows: 3,
      validation: (Rule) => Rule.max(160),
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "type",
      media: "coverImage",
      date: "publishedAt",
    },
    prepare({ title, subtitle, media, date }) {
      const d = date ? new Date(date).toLocaleDateString() : undefined;
      return { title, subtitle: [subtitle, d].filter(Boolean).join(" • "), media };
    },
  },
  orderings: [
    {
      title: "Published (New → Old)",
      name: "publishedDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
    { title: "Title (A → Z)", name: "titleAsc", by: [{ field: "title", direction: "asc" }] },
    {
      title: "Type",
      name: "typeAsc",
      by: [
        { field: "type", direction: "asc" },
        { field: "publishedAt", direction: "desc" },
      ],
    },
  ],
});
