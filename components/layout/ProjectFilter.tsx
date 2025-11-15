"use client";
import React, { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { GetAllTechTagsQueryResult } from "@/sanity/types";
import TechTag from "../ui/TechTag";
import { StackCompactIcon, StackIcon } from "@sanity/icons";
import SplitText from "../ui/SplitText";
type ProjectFilterProps = {
  techStack: GetAllTechTagsQueryResult;
};
/* --------------------------------- FILTER BAR ------------------------------- */
const ProjectFilter = ({ techStack }: ProjectFilterProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  // View mode comes from the URL: ?view=compact or no param (full view)
  const compact = searchParams.get("view") === "compact";

  // const [compact, setCompact] = useState<boolean>(searchParams.get("view") === "compact");

  // Read current selected tags from the query param ?tag=React,Next.js,...
  const readTags = React.useCallback((): string[] => {
    const raw = searchParams.get("tag") || "";
    return raw
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  }, [searchParams]);

  // Check if a given tag is currently active
  const tagChosen = React.useCallback(
    (tag: string) => {
      const tags = readTags();
      return tags.includes(tag);
    },
    [readTags]
  );
  // Toggle a tag on/off in the URL query
  const toggleTag = React.useCallback(
    (tag: string) => {
      const params = new URLSearchParams(searchParams.toString());
      const current = readTags();
      let next: string[];

      if (current.includes(tag)) {
        next = current.filter((x) => x !== tag);
      } else {
        next = Array.from(new Set([...current, tag]));
      }

      if (next.length === 0) params.delete("tag");
      else params.set("tag", next.join(","));
      router.replace(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams, readTags]
  );

  const setView = (isFull: boolean) => {
    const params = new URLSearchParams(searchParams.toString());

    if (isFull) {
      // Full view → remove `view` param (default)
      params.delete("view");
    } else {
      // Compact view → set `view=compact`
      params.set("view", "compact");
    }

    router.replace(`${pathname}?${params.toString()}`);
  };
  return (
    <div className="flex w-full items-center gap-6 md:items-start lg:gap-20">
      {/* Tag filter list */}
      <div className="flex w-full flex-wrap items-center justify-start gap-1 gap-y-2">
        {techStack.map((tech) => (
          <TechTag
            key={tech.title}
            title={tech.title}
            button
            onClick={() => toggleTag(tech.title)}
            active={tagChosen(tech.title)}
          />
        ))}
      </div>
      {/* View mode toggle (full vs compact) */}
      <div className="flex items-center justify-center gap-2 md:justify-end">
        {/* Full view button */}
        <button
          className={`flex size-10 items-center justify-center rounded-md border aspect-square ${
            !compact ? "bg-muted text-bg" : ""
          }`}
          disabled={!compact}
          title="Full View"
          onClick={() => setView(true)}
        >
          <StackIcon className="size-8" />
        </button>
        {/* Compact view button */}
        <button
          className={`flex size-10 items-center justify-center rounded-md border aspect-square ${
            compact ? "bg-muted text-bg" : ""
          }`}
          title="Compact View"
          disabled={compact}
          onClick={() => setView(false)}
        >
          <StackCompactIcon className="size-8" />
        </button>
      </div>
    </div>
  );
};

export default ProjectFilter;

export const NoProjectFound = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Remove the `tag` filter from the URL and keep everything else
  const handleReset = React.useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("tag");
    router.replace(`${pathname}?${params.toString()}`);
  }, [pathname, router, searchParams]);

  return (
    <aside className="flex flex-col items-center justify-center gap-4">
      <SplitText
        type="chars"
        text="No projects found"
        className="mx-auto cursor-default text-center text-[min(6vw,40px)] font-bold leading-snug max-sm:leading-tight"
      />
      <SplitText
        type="words"
        text={"Try adjusting your filters or selecting different technologies"}
        className="text-center text-[min(3vw,18px)] max-w-[min(60vw,768px)] mx-auto text-muted-foreground tracking-wide cursor-default"
      />

      <TechTag
        button
        onClick={handleReset}
        title="Reset Tag Filter"
        className=" text-[min(3vw,18px)]!"
      ></TechTag>
    </aside>
  );
};
