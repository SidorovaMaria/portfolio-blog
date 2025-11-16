"use client";

/**
 * Renders the device mockup screens for a featured project.
 *
 * @param {Object} props - The component props
 * @param {FeaturedProjectsQueryResult[number]} props.project - The project data containing image URLs and alt text for different device views
 *
 * @returns {JSX.Element} A container with desktop, tablet, and mobile project screenshots positioned relatively
 *
 * @remarks
 * Images are optimized using Sanity's image URL builder with specified dimensions and quality.
 * Tablet and mobile images are hidden on smaller screens and positioned absolutely on larger screens.
 */
const featuredProjectScreen = ({ project }: { project: FeaturedProjectsQueryResult[number] }) => {
  return (
    <div className="relative mx-auto flex w-full items-center justify-center max-lg:col-span-2 ">
      {project.desktopImg && (
        <Image
          src={urlFor(project.desktopImg).width(1100).height(700).quality(100).auto("format").url()}
          width={550}
          height={350}
          className="desktop-image mx-auto max-lg:max-w-[350px]"
          alt={project.desktopAlt || "Project Image Desktop"}
        />
      )}
      {project.tabletImg && (
        <Image
          src={urlFor(project.tabletImg).width(440).height(300).quality(90).auto("format").url()}
          width={220}
          height={150}
          className="tablet-image hidden w-2/5 lg:absolute lg:bottom-0 lg:right-2 lg:block"
          alt={project.tabletAlt || "Project Image Tablet"}
        />
      )}
      {project.mobileImg && (
        <Image
          src={urlFor(project.mobileImg).width(260).height(160).quality(90).auto("format").url()}
          width={130}
          height={80}
          className="mobile-image hidden w-2/9 lg:absolute lg:bottom-0 lg:left-4/7 lg:block"
          alt={project.mobileAlt || "Project Image Mobile"}
        />
      )}
    </div>
  );
};

/**
 * A featured project component that displays project information with animated reveal effects.
 *
 * @component
 * @param {FeaturedProjectProps} props - The component props
 * @param {FeaturedProjectsQueryResult[number]} props.project - The project data including title, description, images, tech stack, and links
 * @param {gsap.core.Tween | null} props.htl - The horizontal timeline animation instance from GSAP for coordinating scroll animations
 *
 * @remarks
 * This component uses GSAP and ScrollTrigger to create scroll-based animations including:
 * - 3D transformations (rotateX, rotateY, perspective)
 * - Opacity and blur effects
 * - Staggered animations for project index and info text
 * - Responsive device mockup displays (desktop, tablet, mobile)
 *
 * The component is structured with:
 * - An intro card showing project index, title, and tech stack
 * - Device mockup images (desktop, tablet, mobile views)
 * - A description section with GitHub and live demo links
 *
 * @example
 * ```tsx
 * <FeaturedProject
 *   project={projectData}
 *   htl={horizontalTimeline}
 * />
 * ```
 *
 * @returns {JSX.Element} A full-screen panel containing the animated featured project display
 */

import React from "react";
import { FeaturedProjectsQueryResult } from "@/sanity/types";
import TechTag from "./TechTag";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import ProjectLinkBtn from "./ProjectLinkBtn";
import { EyeOpenIcon, GithubIcon } from "@sanity/icons";

gsap.registerPlugin(ScrollTrigger);

type FeaturedProjectProps = {
  project: FeaturedProjectsQueryResult[number];
  htl: gsap.core.Tween | null;
};
const FeaturedProject = ({ project, htl }: FeaturedProjectProps) => {
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const introRef = React.useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const rootEl = rootRef.current;
      const introEl = introRef.current;
      if (!rootEl || !introEl || !htl) return;
      const headlineEl = document.querySelector(".featured-headline");
      const featuredStart = headlineEl?.getBoundingClientRect().bottom ?? 0;

      const offset = -200;
      const delta = featuredStart - introEl.getBoundingClientRect().top + offset;
      const isFirstProject = project.index === "01";
      const indexEls = introEl.querySelectorAll<HTMLElement>(".index-number");
      const infoTextEls = introEl.querySelectorAll<HTMLElement>(".info-text");
      const imageEls = rootEl.querySelectorAll<HTMLElement>(
        ".desktop-image, .tablet-image, .mobile-image"
      );
      const descriptionEl = rootEl.querySelector<HTMLElement>(".description-text");
      const tl = gsap.timeline({
        defaults: { ease: "sine.out" },
        scrollTrigger: {
          containerAnimation: isFirstProject ? undefined : htl,
          trigger: introEl,
          start: isFirstProject ? `${delta} 50%` : "-12% 80%",
          end: isFirstProject ? "bottom 30%" : "center center",
          scrub: 0.01,
          toggleActions: "play reverse play reverse",
          // markers: true,
        },
      });

      tl.fromTo(
        introEl,
        {
          y: 50,
          opacity: 0,
          scaleY: 1.2,
          rotateX: 25, // tilt away from the viewer
          scale: 0.95, // slightly smaller
          transformOrigin: "center center",
          transformPerspective: 800, // give depth
          filter: "blur(4px)",
        },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          scaleY: 1,
          scale: 1,
          filter: "blur(0px)",
          duration: 1.5,
          clearProps: "transform,filter,opacity",
        },
        0
      );
      tl.fromTo(
        indexEls,
        {
          y: -200,
          x: -200,
          rotateY: -10,
          rotateX: -10,
          opacity: 0,
          scaleY: 1.5,
          transformOrigin: "center center",
          transformPerspective: 800, // give depth
        },
        {
          y: 0,
          x: 0,
          rotateX: 0,
          scaleY: 1,
          rotateY: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.1,
          clearProps: "transform,opacity",
        },
        0
      ).fromTo(
        infoTextEls,
        {
          y: -200,
          x: 200,
          scaleY: 1.5,
          rotateY: -10,
          rotateX: 10,
          opacity: 0,
          transformOrigin: "center center",
          transformPerspective: 800, // give depth
        },
        {
          y: 0,
          x: 0,
          scaleY: 1,
          rotateY: 0,
          rotateX: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.1,
          clearProps: "transform,opacity",
        },
        0
      );
      //Screens
      tl.fromTo(
        imageEls,
        {
          rotateY: 45,
          y: 60,
          opacity: 0,
          transformOrigin: "center left",
          transformPerspective: 800,
        },
        {
          rotateY: 0,
          y: 0,
          opacity: 1,
          duration: 1.4,
          stagger: 0.15,
          clearProps: "transform,opacity",
        },
        "<0.5"
      );
      if (descriptionEl) {
        tl.fromTo(
          descriptionEl,
          {
            y: 50,
            opacity: 0,
            scaleY: 1.2,
            rotateX: 25,
            scale: 0.95,
            transformOrigin: "center center",
            transformPerspective: 800,
            filter: "blur(4px)",
          },
          {
            y: 0,
            opacity: 1,
            rotateX: 0,
            scaleY: 1,
            scale: 1,
            filter: "blur(0px)",
            ease: "power3.out",
            duration: 1.5,
            clearProps: "transform,filter,opacity",
          }
        );
      }
    },
    { scope: rootRef, dependencies: [htl] }
  );

  return (
    <div className="panel flex h-screen w-screen items-center justify-center px-[12.5vw] ">
      <div
        ref={rootRef}
        className="grid w-full grid-cols-2 items-center gap-x-8 gap-y-1 lg:gap-y-2 "
      >
        {/* Intro card */}
        <div
          ref={introRef}
          className="col-span-2 grid grid-cols-[1fr_3fr] items-center rounded-xl bg-(--accent-color) p-4 text-(--text-light) dark:text-(--text-dark) md:p-6"
          style={
            {
              "--accent-color": project.accent,
              "--text-dark": project.textDark,
              "--text-light": project.textLight,
            } as React.CSSProperties
          }
        >
          <p className="index-number text-[min(10vw,90px)] text-(--text-dark)">{project.index}</p>
          <div className="info-text flex flex-col">
            <h2 className="max-sm:text-right text-xl tracking-wide text-(--text-dark) lg:text-3xl">
              {project.title}
            </h2>
            <ul className="my-4 hidden flex-wrap gap-2 md:flex">
              {project.techStack.map((tech) => (
                <TechTag key={tech.title} title={tech.title} />
              ))}
            </ul>
          </div>
        </div>
        {/* Screens */}
        {featuredProjectScreen({ project })}

        {/* Description / links */}
        <div
          className="description-text max-lg:col-span-2 flex w-full flex-col gap-4 rounded-xl p-4 md:p-6 text-center lg:text-left text-[min(2.6vw,14px)]"
          style={{ backgroundColor: `${project.accent}40` }}
        >
          <p className="tracking-wider mix-blend-difference">{project.description}</p>
          <div className="flex items-center justify-around">
            <ProjectLinkBtn
              link={project.githubLink!}
              text="GitHub"
              accent={project.accent!}
              icon={<GithubIcon className="size-8 text-(--text-dark)" />}
            />
            <ProjectLinkBtn
              link={project.liveLink!}
              text="Live Demo"
              accent={project.accent!}
              icon={<EyeOpenIcon className="size-8 text-(--accent-color)" />}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedProject;
