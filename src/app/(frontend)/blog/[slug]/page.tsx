import { urlFor } from "@/sanity/lib/image";
import { sanityFetch } from "@/sanity/lib/live";
import { getPostBySlugQuery } from "@/sanity/lib/queries";
import { format } from "date-fns";
import { Calendar, Clock } from "lucide-react";
import { PortableText } from "next-sanity";
import Image from "next/image";

const BlogPost = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  const { data: post } = await sanityFetch({
    query: getPostBySlugQuery,
    params: { slug },
  });

  if (!post) {
    return <div>Post not found.</div>;
  }
  const date = format(new Date(post.publishedAt), "EEEE, d MMM yyyy");

  return (
    <main className="max-w-5xl mx-auto my-12 font-inter">
      {post.coverImage && (
        <Image
          src={urlFor(post.coverImage.asset!)
            .width(1024)
            .height(300)
            .quality(100)
            .auto("format")
            .url()}
          id="tablet-image"
          width={1024}
          height={200}
          alt={post.coverImage.alt || "Blog Post Cover Image"}
          className="rounded-4xl mx-auto"
        />
      )}
      <div className="max-w-3xl md:mx-auto mx-4 space-y-4">
        <h1 className="text-[min(6vw,32px)] font-bold mt-6 mb-2 text-left ">{post.title}</h1>
        {post.type && (
          <span className="bg-primary rounded-md px-2 py-1 leading-none whitespace-nowrap text-sm font-semibold">
            #{post.type}
          </span>
        )}

        <div className="flex items-center justify-between py-4 border-b border-fg/20">
          <div className="flex items-center">
            <Calendar className="mr-2 size-4" />
            <time dateTime={post.publishedAt}>{date}</time>
          </div>
          <div className="flex items-center">
            <Clock className="mr-2 size-4" />
            <p>{post.readingTime} min read</p>
          </div>
        </div>
        <div className="my-6">
          {post.body ? (
            <div className="lg:col-span-7 lg:col-start-6 prose dark:prose-invert lg:prose-lg prose-code:bg-fg prose-code:text-bg prose-code:px-1 prose-code:py-0.5 prose-code:rounded-md prose-code:text-sm prose-code:font-mono">
              <PortableText value={post.body} />
            </div>
          ) : null}
        </div>
      </div>
    </main>
  );
};

export default BlogPost;
