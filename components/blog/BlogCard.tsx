import { format } from "date-fns";
import { Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { urlFor } from "@/sanity/lib/image";
import type { AllBlogPostsQueryResult } from "@/sanity/types";

type BlogCardProps = {
  post: AllBlogPostsQueryResult[number];
  className?: string;
  direction?: "row" | "column";
};

const BlogCard = ({ post, className = "", direction = "column" }: BlogCardProps) => {
  const date = format(new Date(post.publishedAt), "EE, d MMM yyyy");

  const isRow = direction === "row";

  const layoutClasses = isRow
    ? "grid grid-cols-[1fr_2fr] items-center md:items-start"
    : "grid grid-cols-[1fr_2fr] md:flex md:flex-col md:max-w-[420px] mx-auto";

  const contentPaddingClasses = isRow
    ? "py-3 pr-4 justify-center"
    : "max-md:py-3 pr-4 md:pb-3 px-4";

  return (
    <Link
      href={`/blog/${post.slug}`}
      className={`relative ${layoutClasses} gap-y-4 gap-x-6 rounded-xl overflow-hidden blog-card cursor-pointer hover:scale-[1.02] transition-transform duration-300 hover:shadow-xl ${className}`}
      aria-label={post.title}
    >
      {/* Background gradient overlay */}
      <div className="absolute inset-0 -z-10 rounded-xl bg-linear-to-br from-primary/20 via-bg/50 to-primary/20 backdrop-blur-sm" />

      {post.coverImage && (
        <Image
          src={urlFor(post.coverImage.asset!).quality(100).auto("format").url()}
          id="tablet-image"
          width={420}
          height={120}
          alt={post.coverImage.alt || `${post.title} – cover image`}
          className="aspect-video h-full max-md:h-full rounded-xl object-cover"
        />
      )}

      <div className={`flex h-full flex-col gap-2 md:justify-between ${contentPaddingClasses}`}>
        <div className="flex flex-col gap-1">
          {/* Title */}
          <h3 className="font-semibold leading-tight tracking-wide text-[clamp(16px,4vw,20px)]">
            {post.title}
          </h3>

          {/* Type */}
          {post.type && (
            <p className="font-medium text-muted text-[clamp(12px,2.5vw,14px)]">#{post.type}</p>
          )}

          {/* Excerpt */}
          {post.excerpt && (
            <p className="italic text-fg/80 line-clamp-3 text-[clamp(12px,2.5vw,14px)]">
              {post.excerpt}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between">
          {/* Reading time */}
          <div className="flex items-center gap-1 whitespace-nowrap text-[clamp(10px,2.5vw,16px)]">
            {post.readingTime && (
              <>
                <Clock className="size-4" />
                <p>{post.readingTime} min read</p>
              </>
            )}
          </div>

          {/* Date */}
          <p className="whitespace-nowrap font-medium tracking-wide text-fg text-[clamp(10px,2.5vw,16px)]">
            {date}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;
