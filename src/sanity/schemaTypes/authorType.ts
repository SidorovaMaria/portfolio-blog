import { UserIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const authorType = defineType({
  name: "author",
  title: "Author",
  type: "document",
  icon: UserIcon,
  fields: [
    defineField({
      name: "name",
      type: "string",
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: {
        source: "name",
      },
    }),
    defineField({
      name: "avatar",
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
      name: "build",
      title: 'I build (for example: "websites, mobile apps, etc.")',
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      validation: (R) => R.required().error("Please add at least 8 items.").min(8),
    }),
    defineField({
      name: "socialLinks",
      title: "Social Links",
      type: "object",
      fields: [
        defineField({
          name: "github",
          type: "url",
          validation: (R) => R.uri({ scheme: ["https"] }).warning("Use https://"),
        }),
        defineField({
          name: "linkedin",
          type: "url",
          validation: (R) => R.uri({ scheme: ["https"] }).warning("Use https://"),
        }),
        defineField({ name: "email", type: "string" }),
        defineField({ name: "instagram", type: "url" }),
        defineField({ name: "twitter", type: "url" }),
        defineField({ name: "facebook", type: "url" }),
      ],
    }),
    defineField({
      name: "techStack",
      title: "Tech Stack",
      type: "array",
      of: [{ type: "reference", to: [{ type: "techTag" }] }],
      description: "Select technologies that you work with",
      validation: (R) => R.required().error("Please select at least one technology.").unique(),
    }),
    defineField({
      name: "shortIntro",
      type: "string",
      description: "Who are you in 2-3 words?",
      validation: (R) =>
        R.max(40)
          .warning("Keep it under 40 characters.")
          .required()
          .error("This field is required."),
    }),
    defineField({
      name: "intro",
      type: "text",
      rows: 3,
      description: "A short bio intro the author.",
      validation: (R) =>
        R.required()
          .error("This field is required.")
          .min(50)
          .max(300)
          .warning("Keep it between 50 and 300 characters."),
    }),
    defineField({
      name: "links",
      type: "object",
      fields: [
        defineField({
          name: "github",
          type: "url",
          validation: (R) => R.uri({ scheme: ["https"] }).warning("Use https://"),
        }),
        defineField({
          name: "linkedin",
          type: "url",
          validation: (R) => R.uri({ scheme: ["https"] }).warning("Use https://"),
        }),
        defineField({ name: "email", type: "string" }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "name",
      media: "image",
    },
  },
});
