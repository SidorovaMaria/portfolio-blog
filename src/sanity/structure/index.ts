import { StructureResolver } from "sanity/structure";

export const structure: StructureResolver = (S) =>
  S.list()
    .id("root")
    .title("Content")
    .items([
      S.divider().title("Projects"),
      S.listItem()
        .title("All Projects")
        .schemaType("project")
        .child(S.documentTypeList("project").title("All Projects")),
      S.listItem()
        .title("Featured Projects")
        .schemaType("project")
        .child(
          S.documentList()
            .title("Featured Projects")
            .filter('_type == "project" && featured == true')
        ),
      S.documentTypeListItem("techTag").title("Tech Stack"),
      S.divider().title("Blog"),
      S.documentTypeListItem("author").title("Authors"),
      S.listItem()
        .title("All Posts")
        .schemaType("blogPost")
        .child(S.documentTypeList("blogPost").title("All Posts")),
      S.listItem()
        .title("Drafts")
        .schemaType("blogPost")
        .child(
          S.documentList().title("Drafts").filter('_type == "blogPost" && _id in path("drafts.**")')
        ),
    ]);
