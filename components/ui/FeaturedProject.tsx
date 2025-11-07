import React from "react";
import { FeaturedProjectsQueryResult } from "@/sanity/types";
import TechTag from "./TechTag";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";
import gsap from "gsap";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import ProjectLinkBtn from "./ProjectLinkBtn";
import { EyeOpenIcon, GithubIcon } from "@sanity/icons";

const FeaturedProject = ({
  project,
  htl,
}: {
  project: FeaturedProjectsQueryResult[number];
  htl: gsap.core.Tween | null;
}) => {
  const root = React.useRef<HTMLDivElement>(null);
  const introRef = React.useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const el = introRef.current;
      if (!el || !htl) return;
      const featuredStart =
        window.document.querySelector(".featured-headline")?.getBoundingClientRect().bottom || 0;
      const offset = -200;
      const delta = featuredStart - el.getBoundingClientRect().top + offset;
      const tl = gsap.timeline({
        defaults: { ease: "sine.out" },
        scrollTrigger: {
          containerAnimation: project.index === "01" ? undefined : htl,
          trigger: el,
          start: project.index === "01" ? `${delta} 50%` : "-12% 80%",
          end: project.index === "01" ? "bottom 30%" : "center center",
          scrub: 0.01,
          //   markers: true,
          toggleActions: "play reverse play reverse",
        },
      });
      tl.fromTo(
        introRef.current,
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
          ease: "power1.out",
          duration: 1.5,
          clearProps: "transform,filter,opacity",
        },
        0
      );
      tl.fromTo(
        el.querySelectorAll(".index-number"),
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
          ease: "power3.out",
          stagger: 0.1,
          clearProps: "transform,opacity",
        },
        0
      )
        .fromTo(
          el.querySelectorAll(".info-text"),
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
            ease: "power3.out",
            stagger: 0.1,
            clearProps: "transform,opacity",
          },
          0
        )
        .fromTo(
          ["#desktop-image", "#tablet-image", "#mobile-image"],
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
            ease: "power2.out",
            clearProps: "transform,opacity",
          },
          "<0.5"
        )
        .fromTo(
          ".description-text",
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
            ease: "power3.out",
            duration: 1.5,
            clearProps: "transform,filter,opacity",
          }
        );
    },
    { scope: root, dependencies: [htl] }
  );

  return (
    <div className="w-screen px-[12.5vw] h-screen flex items-center justify-center panel">
      <div ref={root} className="grid grid-cols-2 gap-y-1  lg:gap-y-2 items-center gap-x-8 w-full">
        <div
          className={`col-span-2 grid grid-cols-[1fr_3fr] p-4 md:p-6 rounded-xl items-center bg-(--accent-color) text-(--text-light) dark:text-(--text-dark)`}
          ref={introRef}
          style={
            {
              "--accent-color": project.accent,
              "--text-dark": project.textDark,
              "--text-light": project.textLight,
            } as React.CSSProperties
          }
        >
          <p className=" text-[min(10vw,90px)] text-(--text-dark) index-number">{project.index}</p>
          <div className="flex flex-col info-text">
            <h2 className="max-sm:text-right text-xl lg:text-3xl tracking-wide text-(--text-dark)">
              {project.title}
            </h2>
            <ul className="hidden md:flex flex-wrap gap-2 my-4 ">
              {project.techStack.map((tech) => (
                <TechTag key={tech.title} title={tech.title} />
              ))}
            </ul>
          </div>
        </div>
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
              className="mx-auto max-lg:max-w-[500px]"
              alt={project.desktopAlt || "Project Image Desktop"}
            />
          )}
          {project.tabletImg && (
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
          {project.mobileImg && (
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
        <div
          style={{ backgroundColor: project.accent + "40" }}
          className="w-full text-center lg:text-left flex flex-col rounded-xl p-6 description-text max-lg:col-span-2  gap-4"
        >
          <p className="tracking-wider mix-blend-difference">{project.description}</p>
          <div className=" flex items-center justify-around">
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
