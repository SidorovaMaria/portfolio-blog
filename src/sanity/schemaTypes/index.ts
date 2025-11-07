import { type SchemaTypeDefinition } from "sanity";
import { projectType } from "./projectType";
import { techTagType } from "./techTagType";
import { blogPostType } from "./blogPostType";
import { blockContentType } from "./blockContentType";
import { authorType } from "./authorType";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [projectType, techTagType, blogPostType, blockContentType, authorType],
};
