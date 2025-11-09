"use client";
import { AllBlogPostsQueryResult } from "@/sanity/types";
import SplitText from "../ui/SplitText";
import BlogCard from "./BlogCard";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const Latest = ({ posts }: { posts: AllBlogPostsQueryResult }) => {
  return (
    <aside className="flex flex-col w-full ">
      <SplitText
        type="chars"
        text={"Latest"}
        className="text-[min(5vw,32px)] text-center  leading-snug max-sm:leading-tight cursor-default font-bold uppercase "
      />
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {posts.map((post, index) => (
          <BlogCard
            direction={index === 0 ? "row" : "column"}
            key={post._id}
            post={post}
            className={`
            ${
              index === 0
                ? "col-span-1 md:col-span-3 lg:col-span-3"
                : "col-span-1 md:col-span-1 lg:col-span-1"
            }
          `}
          />
        ))}
      </div>
    </aside>
  );
};

export default Latest;
