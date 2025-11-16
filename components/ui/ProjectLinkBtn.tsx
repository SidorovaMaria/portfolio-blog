"use client";

/**
 * A button component that displays a project link with animated hover effects.
 *
 * @component
 * @example
 * ```tsx
 * <ProjectLinkBtn
 *   link="/contacts"
 *   text="View Project"
 *   accent="#3B82F6"
 *   icon={<ArrowIcon />}
 * />
 * ```
 *
 * @param {ProjectLinkBtnProps} props - The component props
 * @param {string} props.link - The URL to navigate to when the link is clicked
 * @param {string} props.text - The text to display for the link
 * @param {string} props.accent - The background color of the animated circle (e.g., hex, rgb, or CSS color name)
 * @param {React.ReactNode} [props.icon] - Optional icon to display inside the animated circle on hover
 *
 * @remarks
 * This component features GSAP animations including:
 * - Circle expansion on hover
 * - Icon fade-in and wobble animation
 * - Underline animation on link hover
 *
 * The component uses the "use client" directive and is meant for client-side rendering in Next.js applications.
 *
 * @returns {JSX.Element} A clickable link with animated visual effects
 */

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Link from "next/link";
import React, { useRef } from "react";

type ProjectLinkBtnProps = {
  link: string;
  text: string;
  accent: string;
  icon?: React.ReactNode;
};

const ProjectLinkBtn = ({ link, text, accent, icon }: ProjectLinkBtnProps) => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const circleRef = useRef<HTMLDivElement | null>(null);
  const iconRef = useRef<HTMLSpanElement | null>(null);

  useGSAP(
    (_, contextSafe) => {
      const root = rootRef.current;
      const circle = circleRef.current;
      const iconEl = iconRef.current;

      if (!root || !circle || !iconEl) return;

      // Base hover timeline for the circle + icon fade-in
      const hoverTl = gsap.timeline({
        paused: true,
        defaults: { ease: "power2.inOut", duration: 0.3 },
      });

      hoverTl
        .to(circle, { width: 40, height: 40, scale: 1.1 }, 0)
        .to(iconEl, { opacity: 1, scale: 1 }, 0);

      let wobbleTween: gsap.core.Tween | null = null;

      const onHoverLink = contextSafe!(() => {
        hoverTl.play();
        wobbleTween?.kill();
        wobbleTween = gsap.fromTo(
          iconEl,
          { rotate: 15 },
          {
            rotate: -15,
            duration: 0.6,
            yoyo: true,
            repeat: -1,
            ease: "power1.inOut",
          }
        );
      });

      const onLeaveLink = contextSafe!(() => {
        hoverTl.reverse();

        if (wobbleTween) {
          wobbleTween.kill();
          wobbleTween = null;
        }

        gsap.set(iconEl, { rotate: 0, opacity: 0, scale: 0.8 });
        gsap.set(circle, { width: 16, height: 16, scale: 1 });
      });

      root.addEventListener("mouseenter", onHoverLink);
      root.addEventListener("mouseleave", onLeaveLink);

      return () => {
        root.removeEventListener("mouseenter", onHoverLink);
        root.removeEventListener("mouseleave", onLeaveLink);
        hoverTl.kill();
        wobbleTween?.kill();
      };
    },
    { scope: rootRef }
  );

  return (
    <div ref={rootRef} className="group relative flex cursor-pointer items-center gap-2">
      <div
        ref={circleRef}
        style={{ backgroundColor: accent }}
        className="absolute left-0 -z-10 flex size-4 -translate-x-1/2 items-center justify-center rounded-full"
      >
        <span ref={iconRef} className="opacity-0 scale-75">
          {icon}
        </span>
      </div>

      <div className="relative ml-4">
        <Link href={link} className="font-medium" target="_blank" rel="noreferrer">
          {text}
        </Link>
        <span className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-300 group-hover:scale-x-100" />
      </div>
    </div>
  );
};

export default ProjectLinkBtn;
