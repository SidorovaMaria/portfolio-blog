import { defineType, defineField } from "sanity";
import { TagIcon } from "@sanity/icons";

export const techTagType = defineType({
  name: "techTag",
  title: "Tech Tag",
  type: "document",
  icon: TagIcon,
  groups: [
    { name: "identity", title: "Identity" },
    { name: "display", title: "Display" },
    { name: "meta", title: "Meta" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "identity",
      validation: (Rule) => Rule.required().error("Title is required."),
    }),
    defineField({
      name: "slug",
      type: "slug",
      group: "identity",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      type: "string",
      group: "identity",
      options: {
        list: [
          "Language",
          "Framework",
          "Library",
          "Styling",
          "UI",
          "State",
          "Database",
          "Auth",
          "Tooling",
          "Infra",
          "Testing",
          "Other",
        ],
        layout: "radio",
      },
      initialValue: "Library",
    }),
    defineField({
      name: "icon",
      title: "Image Icon",
      type: "image",
      group: "display",
      options: { hotspot: true },
    }),
    defineField({
      name: "website",
      title: "Docs / Website",
      type: "url",
      group: "meta",
      validation: (Rule) => Rule.uri({ scheme: ["https"] }).warning("Prefer https:// URLs"),
    }),
    defineField({
      name: "description",
      type: "text",
      group: "meta",
      rows: 3,
      validation: (Rule) => Rule.max(240),
    }),
    defineField({
      name: "popularity",
      title: "Sort Weight",
      type: "number",
      group: "meta",
      description: "Optional weight for ordering skills (higher shows first).",
      validation: (Rule) => Rule.min(0).integer(),
      initialValue: 0,
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "category",
      media: "icon",
      popularity: "popularity",
    },
    prepare({ title, subtitle, media, popularity }) {
      return {
        title,
        subtitle: `${subtitle} ${popularity ? `|  ${popularity}` : ""}`,
        media,
      };
    },
  },
  orderings: [
    { title: "Title (A → Z)", name: "titleAsc", by: [{ field: "title", direction: "asc" }] },
    {
      title: "Category",
      name: "categoryAsc",
      by: [
        { field: "category", direction: "asc" },
        { field: "title", direction: "asc" },
      ],
    },
    {
      title: "Order Weight (Low → High)",
      name: "popularityAsc",
      by: [
        { field: "popularity", direction: "asc" },
        { field: "title", direction: "asc" },
      ],
    },
  ],
});
