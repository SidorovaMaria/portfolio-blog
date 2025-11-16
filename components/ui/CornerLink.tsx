/**
 * A navigation component that renders a list of links with animated corner decorations.
 *
 * Features an animated hover effect that displays a background box with corner borders
 * that follow the cursor as it moves between links. The animation uses GSAP for smooth
 * transitions and includes staggered corner animations.
 *
 * @component
 * @param {ConnectSectionProps} props - The component props
 * @param {ConnectLink[]} props.connectLinks - Array of link objects containing href, optional label, and optional icon
 * @param {string} [props.className] - Optional additional CSS classes to apply to the navigation container
 *
 * @example
 * ```tsx
 * <CornerLink
 *   connectLinks={[
 *     { label: "GitHub", href: "https://github.com", icon: <GitHubIcon /> },
 *     { label: "LinkedIn", href: "https://linkedin.com", icon: <LinkedInIcon /> }
 *   ]}
 *   className="custom-class"
 * />
 * ```
 *
 * @returns {JSX.Element} A navigation component with animated hover effects
 */
"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Link } from "next-transition-router";
import React, { useRef } from "react";
type ConnectLink = {
  label?: string;
  href: string;
  icon?: React.ReactNode;
};
type ConnectSectionProps = {
  className?: string;
  connectLinks: ConnectLink[];
};

const CornerLink = ({ connectLinks, className }: ConnectSectionProps) => {
  const menuContainerRef = useRef<HTMLDivElement | null>(null);
  const cornersContainerRef = useRef<HTMLDivElement | null>(null);
  const cornersRef = useRef<HTMLDivElement[]>([]);
  useGSAP(
    (context, contextSafe) => {
      const container = cornersContainerRef.current;
      const menu = menuContainerRef.current;
      if (!container || !menu) return;
      const links = menu.querySelectorAll<HTMLElement>(".menu-item");
      if (!links.length) return;
      // Initial state of corners + box

      gsap.set(container, { opacity: 0 });
      gsap.set(cornersRef.current, {
        opacity: 0,
        scale: 0,
        rotate: 0,
      });
      const quickX = gsap.quickTo(container, "x", {
        duration: 0.4,
        ease: "power2.out",
      });
      const quickY = gsap.quickTo(container, "y", {
        duration: 0.4,
        ease: "power2.out",
      });
      const quickW = gsap.quickTo(container, "width", {
        duration: 0.4,
        ease: "power2.out",
      });
      const quickH = gsap.quickTo(container, "height", {
        duration: 0.4,
        ease: "power2.out",
      });
      const showBox = () =>
        gsap.to(container, {
          opacity: 1,
          backgroundColor: "rgba(255, 255, 255, 0.05)",
          duration: 0.2,
          ease: "none",
        });

      const hideBox = () => {
        gsap.to(container, {
          opacity: 0,
          backgroundColor: "transparent",
          duration: 0.2,
          ease: "none",
        });
        gsap.to(cornersRef.current, {
          opacity: 0,
          scale: 0,
          duration: 0.25,
          ease: "power2.inOut",
        });
      };
      const moveTo = (linkEl: HTMLElement) => {
        const linkRect = linkEl.getBoundingClientRect();
        const menuRect = menu.getBoundingClientRect();
        const padding = 12;
        const x = linkRect.left - menuRect.left - padding;
        const y = linkRect.top - menuRect.top - padding;
        const width = linkRect.width + padding * 2;
        const height = linkRect.height + padding * 2;
        quickX(x);
        quickY(y);
        quickW(width);
        quickH(height);
        gsap.to(cornersRef.current, {
          opacity: 1,
          scale: 1,
          rotate: 0,
          duration: 0.35,
          stagger: { each: 0.05, from: "random" },
          ease: "back.out(1.7)",
          overwrite: "auto",
        });
      };
      const handleEnter = contextSafe!((e: Event) => {
        const target = e.currentTarget as HTMLElement;
        moveTo(target);
        showBox();
      });
      const handleLeave = contextSafe!(() => {
        hideBox();
      });
      links.forEach((link) => {
        link.addEventListener("mouseenter", handleEnter);
      });
      menu.addEventListener("mouseleave", handleLeave);

      return () => {
        links.forEach((link) => {
          link.removeEventListener("mouseenter", handleEnter);
        });
        menu.removeEventListener("mouseleave", handleLeave);
      };
    },
    { scope: menuContainerRef }
  );

  return (
    <div className="relative" ref={menuContainerRef}>
      <div
        role="navigation"
        className={`mx-auto mt-8 flex w-fit flex-row justify-center gap-8 ${className ?? ""}`}
      >
        {connectLinks.map((item, i) => (
          <Link
            key={i}
            href={item.href}
            className="corner-link menu-item group relative flex items-center justify-center gap-2 text-center text-[min(3vw,14px)]"
          >
            {item.icon}
            {item.label}
            <span className="pointer-events-none absolute bottom-0 block h-px w-full origin-center scale-x-0 bg-fg opacity-0 transition-transform duration-300 ease-out group-hover:scale-x-100 group-hover:opacity-100" />
          </Link>
        ))}
      </div>
      <div
        ref={cornersContainerRef}
        className="corners-container pointer-events-none absolute left-0 top-0"
      >
        {["tl", "tr", "bl", "br"].map((pos, i) => (
          <div
            key={pos}
            ref={(el) => {
              if (el) {
                cornersRef.current[i] = el;
              }
            }}
            className={`corner absolute h-2 w-2 border-fg ${
              pos === "tl"
                ? "left-0 top-0 border-l border-t"
                : pos === "tr"
                ? "right-0 top-0 border-r border-t"
                : pos === "bl"
                ? "left-0 bottom-0 border-b border-l"
                : "right-0 bottom-0 border-b border-r"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default CornerLink;
