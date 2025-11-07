"use client";
import { AllProjectsQueryResult } from "@/sanity/types";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ProjectStacked from "../ui/ProjectStacked";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const ProjectsStack = ({ projects }: { projects: AllProjectsQueryResult }) => {
  const searchParams = useSearchParams();
  const [compact, setCompact] = useState<boolean>(searchParams.get("view") === "compact");
  useEffect(() => {
    setCompact(searchParams.get("view") == "compact");
  }, [searchParams]);
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const slideWrappers = gsap.utils.toArray(".project-card-wrapper") as HTMLElement[];
      const slides = gsap.utils.toArray(".card-slide") as HTMLElement[];
      if (slideWrappers.length !== slides.length || slideWrappers.length === 0) {
        return;
      }
      ScrollTrigger.refresh(); // re-measure after CSS grid applies

      slideWrappers.forEach((wrapper, i) => {
        const card = slides[i];
        gsap.to(card, {
          y: 200, // cards move down a bit
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
      scope: root,
      dependencies: [compact, projects.length],
    }
  );
  return (
    <section
      className={`stack-container flex flex-col ${compact && "grid grid-cols-1 md:grid-cols-2"}`}
      ref={root}
    >
      {projects.map((project, index) => (
        <ProjectStacked key={project.index} project={project} compact={compact} />
      ))}
    </section>
  );
};

export default ProjectsStack;
