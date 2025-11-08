import { urlFor } from "@/sanity/lib/image";
import { AllBlogPostsQueryResult } from "@/sanity/types";
import { format } from "date-fns";
import { Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const BlogCard = ({
  post,
  className,
  direction = "column",
}: {
  post: AllBlogPostsQueryResult[number];
  className?: string;
  direction?: "row" | "column";
}) => {
  const date = format(new Date(post.publishedAt), "EEEE, d MMM yyyy");
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={`grid items-center justify-center ${
        direction === "row"
          ? "grid-cols-[1fr_2fr]"
          : " grid-cols-[1fr_2fr] md:grid-cols-1 md:max-w-[420px] mx-auto"
      } gap-y-4   gap-x-6 rounded-xl ${className} hover:transition-transform cursor-pointer blog-card overflow-hidden relative hover:shadow-xl hover:scale-[1.02]! duration-300 shadow-fg/20 `}
    >
      {post.coverImage && (
        <Image
          src={urlFor(post.coverImage.asset!).quality(100).auto("format").url()}
          id="tablet-image"
          width={420}
          height={120}
          alt={post.coverImage.alt || "Blog Post Cover Image"}
          className={`h-full rounded-xl object-cover aspect-video `}
        />
      )}

      <div className="absolute inset-0 bg-linear-to-br from-primary/20 via-bg/50 to-primary/20 backdrop-blur-sm rounded-xl  -z-10"></div>
      <div
        className={`flex flex-col h-full gap-2 justify-center ${
          direction === "row" ? " py-3 pr-4" : "max-sm:py-3 pr-4 md:pb-3 px-4 "
        }`}
      >
        <h3 className="text-[min(4vw,24px)] leading-tight  tracking-wide font-bold">
          {post.title}
        </h3>

        <p className="text-[min(2.5vw,16px)] text-muted font-medium">#{post.type}</p>

        <p className="text-[min(2.5vw,16px)] text-fg/80 line-clamp-3 italic">{post.excerpt}</p>
        <div className="flex flex-row-reverse items-center justify-between">
          <p className="text-sm font-semibold tracking-wide text-fg">{date}</p>
          <p className="flex items-center gap-1">
            {post.readingTime && (
              <>
                <Clock className=" size-3 " /> {post.readingTime || 0} min read
              </>
            )}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;
