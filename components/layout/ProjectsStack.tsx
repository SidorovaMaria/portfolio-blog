"use client";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

import { FeaturedProjectsQueryResult } from "@/sanity/types";
import ProjectStacked from "../ui/ProjectStacked";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

type ProjectsStackProps = {
  projects: FeaturedProjectsQueryResult;
};

const ProjectsStack = ({ projects }: ProjectsStackProps) => {
  const searchParams = useSearchParams();

  const rootRef = useRef<HTMLElement | null>(null);
  // View mode comes from the URL (?view=compact)
  const compact = searchParams.get("view") === "compact";

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;
      const slideWrappers = gsap.utils.toArray<HTMLElement>(
        root.querySelectorAll(".project-card-wrapper")
      );
      const slides = gsap.utils.toArray<HTMLElement>(root.querySelectorAll(".card-slide"));
      // Bail if something is off
      if (!slideWrappers.length || slideWrappers.length !== slides.length) return;
      ScrollTrigger.refresh(); // re-measure after CSS grid applies

      slideWrappers.forEach((wrapper, i) => {
        const card = slides[i];

        gsap.to(card, {
          y: 200, // cards move down a bit as you scroll
          zIndex: -30,
          transformOrigin: "50% center",
          ease: "power1.in",
          scale: 0.9,
          rotateX: "-5",
          duration: 1,
          scrollTrigger: {
            trigger: wrapper,
            start: "top top",
            end: "bottom 20%",
            endTrigger: wrapper,
            scrub: 1,
            pinSpacing: false,
            id: `card-${i}`,
            // markers: true,
          },
        });
      });
    },
    {
      scope: rootRef,
      dependencies: [compact, projects.length],
    }
  );
  const baseClasses = "stack-container w-full gap-6";
  return (
    <section
      ref={rootRef}
      className={
        compact ? `${baseClasses} grid grid-cols-1 md:grid-cols-2` : `${baseClasses} flex flex-col`
      }
    >
      {projects.map((project) => (
        <ProjectStacked key={project.index} project={project} compact={compact} />
      ))}
    </section>
  );
};

export default ProjectsStack;
