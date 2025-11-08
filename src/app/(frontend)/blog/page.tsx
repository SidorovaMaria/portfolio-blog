import { sanityFetch } from "@/sanity/lib/live";
import { allBlogPostsQuery } from "@/sanity/lib/queries";

import React from "react";
import SplitText from "../../../../components/ui/SplitText";
import Latest from "../../../../components/blog/Latest";

const BlogPage = async () => {
  const { data: blogPosts } = await sanityFetch({
    query: allBlogPostsQuery,
  });
  if (!blogPosts || blogPosts.length === 0) {
    return <div>No blog posts found.</div>;
  }

  return (
    <main className="space-y-4 my-12 mx-[4vw]">
      <SplitText
        type="chars"
        text={"The Blog"}
        className="text-[min(6vw,40px)]   leading-snug max-sm:leading-tight cursor-default font-bold uppercase "
      />
      <Latest posts={blogPosts.slice(0, 4)} />
    </main>
  );
};

export default BlogPage;
