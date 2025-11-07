import { defineType, defineField, ALL_FIELDS_GROUP } from "sanity";
import { DocumentTextIcon } from "@sanity/icons";

const HEX_REGEX = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

export const projectType = defineType({
  name: "project",
  title: "Project",
  type: "document",
  icon: DocumentTextIcon,
  groups: [
    { name: "identity", title: "Identity" },
    { name: "content", title: "Content" },
    { name: "media", title: "Media" },
    { name: "theme", title: "Branding" },
    { name: "links", title: "Links" },
    { name: "meta", title: "Meta" },
    { ...ALL_FIELDS_GROUP, hidden: true },
  ],
  fields: [
    // Identity
    // Title
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "identity",
      validation: (Rule) =>
        Rule.required()
          .error("Title is required.")
          .max(120)
          .error("Please limit the title to 120 characters."),
    }),
    //Slug
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "identity",
      options: {
        source: "title",
      },
      validation: (Rule) => Rule.required().error("Slug is required."),
    }),
    //Order Index
    defineField({
      name: "index",
      title: "Order Index",
      type: "string",
      description: "A string to define the order of projects, e.g., '01', '02', etc.",
      group: "identity",
      validation: (Rule) => Rule.required().error("Order Index is required."),
    }),
    // Content
    //Small Intro
    defineField({
      name: "smallIntro",
      title: "Tagline",
      type: "string",
      group: "content",
      validation: (Rule) =>
        Rule.required()
          .error("Tagline is required.")
          .max(140)
          .error("Please limit the tagline to 140 characters."),
    }),
    // Description
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      group: "content",
      rows: 4,
      validation: (Rule) =>
        Rule.required()
          .error("Description is required.")
          .min(80)
          .error("Please limit the description to at least 80 characters.")
          .max(500)
          .error("Please limit the description to 500 characters."),
    }),
    // Tech & Links
    defineField({
      name: "techStack",
      title: "Tech Stack",
      type: "array",
      of: [{ type: "reference", to: [{ type: "techTag" }] }],
      validation: (Rule) => Rule.required().min(1),
      group: "links",
    }),
    defineField({
      name: "githubLink",
      title: "GitHub",
      type: "url",
      group: "links",
      validation: (Rule) => Rule.uri({ scheme: ["https"] }).warning("Prefer https:// URLs"),
    }),
    defineField({
      name: "liveLink",
      title: "Live URL",
      type: "url",
      group: "links",
      validation: (Rule) => Rule.uri({ scheme: ["https"] }).warning("Prefer https:// URLs"),
    }),
    // Media
    // Media
    defineField({
      name: "images",
      title: "Device Images",
      type: "object",
      group: "media",
      fields: [
        defineField({
          name: "desktop",
          title: "Desktop Image",
          type: "image",
          options: {
            hotspot: true,
          },
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
        }),
        defineField({
          name: "tablet",
          title: "Tablet Image",
          type: "image",
          options: {
            hotspot: true,
          },
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
        }),
        defineField({
          name: "mobile",
          title: "Mobile Image",
          type: "image",
          options: {
            hotspot: true,
          },
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
        }),
      ],
      validation: (Rule) => Rule.required().error("At least one image is required."),
    }),
    //Branding
    defineField({
      name: "accent",
      title: "Accent Color",
      type: "string",
      description: "Hex code for the project's accent color, e.g., #FF5733",
      group: "theme",
      validation: (Rule) =>
        Rule.regex(HEX_REGEX, { name: "hex color" }).warning("Use hex color like #1a2b3c"),
    }),
    defineField({
      name: "textLight",
      title: "Text (Light)",
      type: "string",
      group: "theme",
      validation: (Rule) =>
        Rule.regex(HEX_REGEX, { name: "hex color" }).warning("Use hex color like #ffffff"),
    }),
    defineField({
      name: "textDark",
      title: "Text (Dark)",
      type: "string",
      group: "theme",
      validation: (Rule) =>
        Rule.regex(HEX_REGEX, { name: "hex color" }).warning("Use hex color like #000000"),
    }),
    // Meta
    defineField({
      name: "featured",
      type: "boolean",
      group: "meta",
      initialValue: false,
    }),
    defineField({
      name: "timeline",
      type: "string",
      group: "meta",
      description: "e.g., Apr–Jun 2024",
    }),
    defineField({
      name: "publishedAt",
      type: "datetime",
      group: "meta",
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "index",
      desktop: "images.desktop",
      featured: "featured",
    },
    prepare({ title, subtitle, desktop, featured }) {
      const sub = featured ? `${subtitle} ★` : subtitle;
      return {
        title,
        subtitle: sub || undefined,
        media: desktop,
      };
    },
  },
  orderings: [
    {
      title: "Order (Low → High)",
      name: "orderAsc",
      by: [
        { field: "order", direction: "asc" },
        { field: "title", direction: "asc" },
      ],
    },
    {
      title: "Published (New → Old)",
      name: "publishedDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
    { title: "Title (A → Z)", name: "titleAsc", by: [{ field: "title", direction: "asc" }] },
  ],
});
