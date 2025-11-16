/**
 * A component that displays a project card in a stacked layout with glass morphism effects.
 *
 * @component
 * @param {ProjectStackedProps} props - The component props
 * @param {FeaturedProjectsQueryResult[number]} props.project - The project data including title, description, images, links, and tech stack
 * @param {boolean} props.compact - Flag to render the component in a compact layout (single column, fewer details)
 *
 * @remarks
 * The component features:
 * - Responsive grid layout that adapts based on the `compact` prop
 * - Custom CSS properties for theme colors (accent, text-dark, text-light)
 * - Glass morphism effect with backdrop blur
 * - Project index indicator in the top-right corner
 * - Conditional rendering of description and tech stack based on `compact` mode
 * - Multiple device mockups (desktop, tablet, mobile) for non-compact view
 * - Interactive buttons for live demo and GitHub repository links
 *
 * @example
 * ```tsx
 * <ProjectStacked
 *   project={projectData}
 *   compact={false}
 * />
 * ```
 *
 * @returns {JSX.Element} A styled project card component
 */

/**
 * A sub-component that renders responsive device mockup images for the project.
 *
 * @component
 * @param {Object} props - The component props
 * @param {any} props.project - The project data containing image URLs and alt text
 * @param {boolean} props.compact - Flag to show only desktop image when true
 *
 * @remarks
 * - Always displays the desktop image
 * - Conditionally renders tablet and mobile images when not in compact mode
 * - Uses responsive sizing with Tailwind CSS classes
 * - Implements absolute positioning for tablet and mobile images
 * - Optimizes images using Sanity's image CDN with proper dimensions and quality settings
 *
 * @returns {JSX.Element} A grid of device mockup images
 */
"use client";

import React from "react";
import { FeaturedProjectsQueryResult } from "@/sanity/types";
import { EyeOpenIcon, GithubIcon } from "@sanity/icons";
import Link from "next/link";
import TechTag from "./TechTag";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
type ProjectStackedProps = {
  project: FeaturedProjectsQueryResult[number];
  compact: boolean;
};
const ProjectStacked = ({ project, compact }: ProjectStackedProps) => {
  const buttonClasses =
    "flex w-full items-center justify-center gap-2 rounded-xl bg-(--accent-color) px-2 py-2 text-(--text-dark) shadow-fg/40 transition duration-300 origin-top hover:brightness-125 hover:shadow-md hover:rotate-x-30 border-b-4 border-transparent hover:border-(--text-dark)/80";
  return (
    <div
      className="project-card-wrapper perspective-midrange py-3"
      style={
        {
          "--accent-color": project.accent,
          "--text-dark": project.textDark,
          "--text-light": project.textLight,
        } as React.CSSProperties
      }
    >
      <div className="card-slide relative rounded-xl px-6 pb-6 pt-2 text-(--text-light) dark:text-(--text-dark)">
        {/* Glass Effect */}
        <div className="absolute inset-0 rounded-xl border border-(--accent-color) bg-linear-to-br from-(--accent-color) via-bg/50 to-(--accent-color) backdrop-blur-sm" />

        {/* Index */}
        <span className="absolute right-6 top-4 text-4xl font-bold text-(--accent-color) brightness-150">
          {`<${project.index}>`}
        </span>

        {/* Content */}
        <div
          className={`card-inner relative grid h-fit w-full items-center gap-x-4 max-lg:grid-cols-1 ${
            compact ? "grid-cols-1" : "grid-cols-[2fr_3fr]"
          }`}
        >
          {/* Image */}
          <ImagesGrid project={project} compact={compact} />

          {/* Description */}
          <div className="flex flex-col gap-6 px-6 py-4">
            <div className="space-y-2 text-center">
              <h3 className="text-2xl font-bold">{project.title}</h3>
              {!compact && <p className="font-medium opacity-80">{project.description}</p>}
            </div>

            {/* Tech Stack */}
            {!compact && (
              <ul className="flex flex-wrap justify-center gap-2">
                {project.techStack.map((tech) => (
                  <TechTag
                    key={tech.title}
                    title={tech.title}
                    className="text-(--text-light) dark:text-(--text-dark)"
                  />
                ))}
              </ul>
            )}
            {/* Github and Live */}
            <div
              className={`z-50 mx-auto mt-2 flex h-fit w-full items-center gap-4 ${
                compact ? "flex-col" : ""
              }`}
            >
              <Link
                role="button"
                href={project.liveLink!}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-light-up"
              >
                <EyeOpenIcon className="size-4" />
                <p>Live Demo</p>
              </Link>
              <Link
                role="button"
                href={project.githubLink!}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-light-up"
              >
                <GithubIcon className="aspect-square size-4" />
                <p>GitHub Repo</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectStacked;

const ImagesGrid = ({ project, compact }: { project: any; compact: boolean }) => {
  return (
    <div className="flex items-center justify-center">
      <div className="max-lg:col-span-2 w-full mx-auto flex justify-center items-center relative">
        {project.desktopImg && (
          <Image
            src={urlFor(project.desktopImg).width(300).height(200).quality(90).auto("format").url()}
            id="desktop-image"
            width={550}
            height={350}
            className={`mx-auto max-md:max-w-[300px] max-lg:max-w-[400px]
                    ${compact && "max-w-[400px]"}`}
            alt={project.desktopAlt || "Project Image Desktop"}
          />
        )}
        {project.tabletImg && !compact && (
          <Image
            src={urlFor(project.tabletImg).width(220).height(150).quality(100).auto("format").url()}
            id="tablet-image"
            width={220}
            height={150}
            className="hidden w-2/5 lg:block lg:absolute bottom-0 right-2"
            alt={project.tabletAlt || "Project Image Tablet"}
          />
        )}
        {project.mobileImg && !compact && (
          <Image
            src={urlFor(project.mobileImg).width(130).height(80).quality(100).auto("format").url()}
            id="mobile-image"
            width={130}
            height={80}
            className="hidden lg:block w-2/9 z-30 lg:absolute bottom-0 left-4/7"
            alt={project.mobileAlt || "Project Image Mobile"}
          />
        )}
      </div>
    </div>
  );
};
