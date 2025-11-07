"use client";
import { AllProjectsQueryResult } from "@/sanity/types";
import { EyeOpenIcon, GithubIcon } from "@sanity/icons";
import Link from "next/link";
import React from "react";
import TechTag from "./TechTag";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";

const ProjectStacked = ({
  project,
  compact,
}: {
  project: AllProjectsQueryResult[number];
  compact: boolean;
}) => {
  return (
    <div
      className="project-card-wrapper perspective-midrange py-3 "
      style={
        {
          "--accent-color": project.accent,
          "--text-dark": project.textDark,
          "--text-light": project.textLight,
        } as React.CSSProperties
      }
    >
      <div className="card-slide rounded-xl px-6 pt-2 pb-6 text-(--text-light) dark:text-(--text-dark) ">
        {/* Glass Effect */}
        <div className="absolute inset-0 bg-linear-to-br from-(--accent-color) via-bg/50 to-(--accent-color) backdrop-blur-sm rounded-xl border border-(--accent-color)"></div>
        {/* Index */}
        <span className="absolute top-4 right-6 text-4xl font-bold text-(--accent-color) brightness-150">{`<${project.index}>`}</span>

        {/* Content */}
        <div
          className={`card-inner relative w-full h-fit grid grid-cols-[2fr_3fr]  gap-x-4 items-center max-lg:grid-cols-1 ${
            compact ? "grid-cols-1!" : ""
          }`}
        >
          {/* Image */}
          <div className="flex items-center justify-center">
            <div className="max-lg:col-span-2 w-full mx-auto flex justify-center items-center relative">
              {project.desktopImg && (
                <Image
                  src={urlFor(project.desktopImg)
                    .width(300)
                    .height(200)
                    .quality(90)
                    .auto("format")
                    .url()}
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
                  src={urlFor(project.tabletImg)
                    .width(220)
                    .height(150)
                    .quality(100)
                    .auto("format")
                    .url()}
                  id="tablet-image"
                  width={220}
                  height={150}
                  className="hidden w-2/5 lg:block lg:absolute bottom-0 right-2"
                  alt={project.tabletAlt || "Project Image Tablet"}
                />
              )}
              {project.mobileImg && !compact && (
                <Image
                  src={urlFor(project.mobileImg)
                    .width(130)
                    .height(80)
                    .quality(100)
                    .auto("format")
                    .url()}
                  id="mobile-image"
                  width={130}
                  height={80}
                  className="hidden lg:block w-2/9 z-30 lg:absolute bottom-0 left-4/7"
                  alt={project.mobileAlt || "Project Image Mobile"}
                />
              )}
            </div>
          </div>
          {/* Description */}
          <div className="flex flex-col gap-6 px-6 py-4">
            <div className="space-y-2 text-center">
              <h3 className="text-2xl font-bold">{project.title}</h3>
              {!compact && <p className="font-medium opacity-80">{project.description}</p>}
            </div>

            {/* Tech Stack */}
            {!compact && (
              <ul className="flex flex-wrap gap-2 justify-center">
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
              className={`flex items-center mx-auto z-50 gap-4 mt-2 h-fit w-full ${
                compact && "flex-col"
              }`}
            >
              <Link
                role="button"
                href={project.liveLink!}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 w-full  px-2 py-2 justify-center rounded-xl bg-(--accent-color)  hover:brightness-125  text-(--text-dark) transition duration-300 origin-top hover:shadow-md shadow-fg/40 hover:rotate-x-30 border-b-4 border-transparent hover:border-b-4 hover:border-(--text-dark)/80"
              >
                <EyeOpenIcon className="size-4" />
                <p>Live Demo</p>
              </Link>
              <Link
                role="button"
                href={project.githubLink!}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 w-full  px-2 py-2 justify-center rounded-xl bg-(--accent-color)  hover:brightness-125  text-(--text-dark) transition duration-300 origin-top hover:shadow-md shadow-fg/40 hover:rotate-x-30 border-b-4 border-transparent hover:border-b-4 hover:border-(--text-dark)/80"
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
