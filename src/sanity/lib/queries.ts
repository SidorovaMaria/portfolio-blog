import { defineQuery } from "next-sanity";

// /lib/queries.ts
export const allBlogPostsQuery = defineQuery(
  `*[_type == "blogPost"] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    type,
    excerpt,
    publishedAt,
    featured,
    readingTime,
    coverImage,
    author->{
      name,
      "slug": slug.current,
      image
    }
  }`
);

//Technically I am the only one author, but this is to keep it scalable
export const avatarQuery = defineQuery(
  `*[_type == "author"] | order(_createdAt desc)[0] {
  name,
  alt,
  shortIntro,
  intro,
  build,
  techStack[]->{
    title,
    icon{asset->}
  },
  avatar 
}`
);
export const getAuthorSocialLinksQuery = defineQuery(
  `*[_type == "author"] | order(_createdAt desc)[0] {
  socialLinks
}`
);

export const featuredProjectsQuery = defineQuery(`
  *[_type == 'project' && featured == true] | order(index asc) {
  title,
  index,
  description,
  accent,
    textDark,
    textLight,
  githubLink,
  liveLink,
   techStack[]->{title},
  "desktopImg": images.desktop.asset->,
  "mobileImg": images.mobile.asset->,
  "tabletImg": images.tablet.asset->,
   'desktopAlt':images.desktop.alt,
   'mobileAlt':images.mobile.alt,
   'tabletAlt':images.tablet.alt
}`);
export const getAllTechTagsQuery = defineQuery(`
  *[
    _type == "techTag" &&
    count(*[_type == "project" && references(^._id)]) >= 1
  ] | order(title asc) {
    title,
    icon{asset->}
  }
`);

export const allProjectsQuery = defineQuery(`
  *[_type == 'project' && count(techStack[_ref in *[_type == "techTag" && title in $tags]._id]) == count($tags)] | order(index asc) {
  title,
  index,
  description,
  accent,
    textDark,
    textLight,
  githubLink,
  liveLink,
   techStack[]->{title},
  "desktopImg": images.desktop.asset->,
  "mobileImg": images.mobile.asset->,
  "tabletImg": images.tablet.asset->,
   'desktopAlt':images.desktop.alt,
   'mobileAlt':images.mobile.alt,
   'tabletAlt':images.tablet.alt
}`);
