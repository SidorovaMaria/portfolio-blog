"use client";
import { FeaturedProjectsQueryResult } from "@/sanity/types";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import React, { useRef, useState } from "react";
import FeaturedProject from "../ui/FeaturedProject";

const HorizontalScroll = ({ projects }: { projects: FeaturedProjectsQueryResult }) => {
  const root = useRef<HTMLDivElement>(null);
  const [containerTl, setContainerTl] = useState<gsap.core.Tween | null>(null);
  useGSAP(() => {
    let sections = gsap.utils.toArray(".panel");

    const tween = gsap.to(sections, {
      xPercent: -100 * (sections.length - 1),
      ease: "none",
      scrollTrigger: {
        trigger: root.current,
        pin: true,
        scrub: 1,
        end: "+=3500",
      },
    });
    setContainerTl(tween);
  });
  return (
    <div ref={root} className="flex overscroll-none w-full h-screen flex-nowrap ">
      {projects.map((project, index) => (
        <div key={index}>
          <FeaturedProject project={project} htl={containerTl} />
        </div>
      ))}
    </div>
  );
};

export default HorizontalScroll;
