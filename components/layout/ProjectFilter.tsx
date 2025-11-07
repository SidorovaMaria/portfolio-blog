"use client";
import { GetAllTechTagsQueryResult } from "@/sanity/types";
import React, { useState } from "react";
import TechTag from "../ui/TechTag";
import { StackCompactIcon, StackIcon } from "@sanity/icons";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { formUrlQuery, removeKeysFromUrlQuery } from "../../lib/url";
import SplitText from "../ui/SplitText";

const ProjectFilter = ({ techStack }: { techStack: GetAllTechTagsQueryResult }) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [compact, setCompact] = useState<boolean>(searchParams.get("view") === "compact");
  const readTags = React.useCallback((): string[] => {
    const raw = searchParams.get("tag") || "";
    return raw
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  }, [searchParams]);
  const tagChosen = React.useCallback(
    (tag: string) => {
      const tags = readTags();
      return tags.includes(tag);
    },
    [readTags]
  );
  const toggleTag = React.useCallback(
    (tag: string) => {
      const params = new URLSearchParams(searchParams.toString());
      const current = readTags();
      const t = tag;

      let next: string[];
      if (current.includes(t)) {
        next = current.filter((x) => x !== t);
      } else {
        next = Array.from(new Set([...current, t]));
      }

      if (next.length === 0) params.delete("tag");
      else params.set("tag", next.join(","));
      params.delete("page"); // Reset to first page on tag change
      router.replace(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams, readTags]
  );
  /** Preserve query params while navigating to a new path. */
  const withParams = React.useCallback(
    (newPathname: string) => {
      const params = new URLSearchParams(searchParams.toString());
      const qs = params.toString();
      return qs ? `${newPathname}?${qs}` : newPathname;
    },
    [searchParams]
  );
  const setView = (isFull: boolean) => {
    const params = new URLSearchParams(searchParams.toString());
    if (isFull) {
      params.delete("view");
    } else {
      params.set("view", "compact");
    }
    setCompact(!isFull);
    router.replace(`${pathname}?${params.toString()}`);
  };
  return (
    <div className="w-full flex gap-6 lg:gap-20 items-center md:items-start ">
      <div className="flex flex-wrap gap-1 items-center justify-start gap-y-2 w-full">
        {techStack.map((tech) => (
          <TechTag
            button
            key={tech.title}
            title={tech.title}
            onClick={() => toggleTag(tech.title)}
            active={tagChosen(tech.title)}
          />
        ))}
      </div>
      <div className="flex items-center  justify-center md:justify-end gap-2">
        <button
          className={`size-10 aspect square border rounded-md flex items-center justify-center  ${
            !compact ? "bg-muted text-bg" : ""
          }`}
          disabled={!compact}
          title="Full View"
          onClick={() => setView(true)}
        >
          <StackIcon className="size-8" />
        </button>
        <button
          className={`size-10 aspect square border rounded-md flex items-center justify-center  ${
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
  const tags = searchParams.get("tag");
  const handleReset = React.useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("tag");
    router.replace(`${pathname}?${params.toString()}`);
  }, [pathname, router, searchParams]);

  return (
    <aside className="flex flex-col items-center justify-center gap-4">
      <SplitText
        type="chars"
        text={"No projects found"}
        className="text-[min(6vw,40px)] text-center leading-snug max-sm:leading-tight cursor-default font-bold mx-auto"
      />
      <SplitText
        type="words"
        text={"Try adjusting your filters or selecting different technologies"}
        className="text-center text-[min(5vw,32px])] max-w-[min(60vw,768px)] mx-auto  text-muted-foreground tracking-wide cursor-default"
      />

      <TechTag button onClick={handleReset} title="Reset Tag Filter" className="text-lg!"></TechTag>
    </aside>
  );
};
