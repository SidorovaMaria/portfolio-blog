## Core Schemas Overview

This document provides an overview of the core schema definitions used in our Sanity.io content management system. The schemas define the structure and types of content that can be created and managed within the Sanity Studio.

### Project Schema

Fields:

- `title`: String - The title of the project.
- `slug`: Slug - A URL-friendly identifier for the project.
- `small-intro`: Text - A brief introduction to the project.
- `description`: Text - A detailed description of the project.
- `tech-stack`: Array of references to TechTag - References to the technologies used in the project.
- `github-link`: URL - A link to the project's GitHub repository.
- `live-link`: URL - A link to the live version of the project.
- `accent-color`: String - A color code representing the project's accent color.
- `text-light`: String - A color code representing the project's light text color.
- `text-dark`: String - A color code representing the project's dark text color.
- `images` - (object with desktop, tablet, mobile)
  - `desktop`: Image - An image optimized for desktop view.
  - `tablet`: Image - An image optimized for tablet view.
  - `mobile`: Image - An image optimized for mobile view.
- `featured`: Boolean - A flag indicating whether the project is featured.
- `index`:string - A string used for ordering projects.

### TechTag Schema

Fields:

- `title`: String - The name of the technology tag.(E.g., React, Node.js)
- `category`: String - The category of the technology tag.(E.g., 'Framework', 'Database', 'Tool')
- `icon`: Image - An icon representing the technology tag.
- `color`: String - A color code associated with the technology tag.

### Blog Schema

Fields:

- `title`: String - The title of the blog post.
- `slug`: Slug - A URL-friendly identifier for the blog post.
- `excerpt`: Text - A brief summary of the blog post.
- `cover-image`: Image - The cover image for the blog post.
- `published-at`: DateTime - The publication date and time of the blog post.
- `tags`: Array of references to Tag - References to tags associated with the blog post. or custom string array.
- `reading-time`: Number - Estimated reading time for the blog post.
- `content`: (PortableText — rich text with code blocks, inline images, headings)
- `featured`: Boolean - A flag indicating whether the blog post is featured.
- `seo`: (object)
  - `meta-title`: String - The meta title for SEO purposes.
  - `meta-description`: Text - The meta description for SEO purposes.
  - `meta-image`: Image - An image used for SEO purposes.
- `mood-color`: String - A color code representing the mood of the blog post.

### Author Schema

Fields:

- `name`: String - The name of the author.
- `slug`: Slug - A URL-friendly identifier for the author.
- `bio`: Text - A brief biography of the author.
- `avatar`: Image - An image representing the author.
- `links`: (object)
  - `website`: URL - The author's personal or professional website.
  - `twitter`: URL - The author's Twitter profile.
  - `linkedin`: URL - The author's LinkedIn profile.
  - `github`: URL - The author's GitHub profile.

## Site Metadata Schema

Fields:

- `heroHeadline`: String - The main heading displayed on the homepage.
- `heroSubtitle`: String - The subheading displayed on the homepage.
- `aboutText`: Text - The text content for the "About" section of the homepage.
- `profileImage`: Image - An image representing the author.
- `cvLink`: URL - A link to the author's CV or resume.
- `contactEmail`: Email - The author's contact email address.
- `socialLinks`: Array of URLs - Links to the author's social media profiles.
- `themeAccent`: String - A color code representing the theme accent color.

### Relationships Overview

- Project ↔ TechTag (many-to-many)
- Blog ↔ TechTag (many-to-many)
- Blog ↔ Project (optional relation)
- Blog ↔ Author (many-to-one)
