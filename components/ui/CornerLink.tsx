"use client";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Link } from "next-transition-router";
import React, { useRef } from "react";

type ConnectSectionProps = {
  className?: string;
  connectLinks: { label?: string; href: string; icon?: React.ReactNode }[];
};

const CornerLink = ({ connectLinks, className }: ConnectSectionProps) => {
  const menuContainer = useRef<HTMLDivElement | null>(null);
  const cornersContainer = useRef<HTMLDivElement | null>(null);
  const corners = useRef<HTMLDivElement[]>([]);
  const connectUnderline = useRef<HTMLSpanElement | null>(null);
  useGSAP(
    (context, contextSafe) => {
      const container = cornersContainer.current;
      const menu = menuContainer.current;
      if (!container || !menu) return;

      gsap.set(corners.current, { opacity: 0, scale: 0, rotate: 0 });
      const setX = gsap.quickTo(container, "x", { duration: 0.4, ease: "power2.out" });
      const setY = gsap.quickTo(container, "y", { duration: 0.4, ease: "power2.out" });
      const setW = gsap.quickTo(container, "width", { duration: 0.4, ease: "power2.out" });
      const setH = gsap.quickTo(container, "height", { duration: 0.4, ease: "power2.out" });
      const showBox = () =>
        gsap.to(container, {
          opacity: 1,
          backgroundColor: "rgba(255, 255, 255, 0.05)",
          duration: 0.2,
          ease: "none",
        });
      const hideBox = () =>
        gsap.to(container, {
          opacity: 0,
          backgroundColor: "transparet",
          duration: 0.2,
          ease: "none",
        });

      function moveTo(linkEl: HTMLElement) {
        const linkRect = linkEl.getBoundingClientRect();
        const menuRect = menu!.getBoundingClientRect();
        // position of link relative to menu
        const x = linkRect.left - menuRect.left - 12;
        const y = linkRect.top - menuRect.top - 12;
        const width = linkRect.width + 24;
        const height = linkRect.height + 24;
        setX(x);
        setY(y);
        setW(width);
        setH(height);
        gsap.to(corners.current, {
          opacity: 1,
          scale: 1,
          rotate: 0,
          duration: 0.35,
          stagger: { each: 0.05, from: "random" },
          ease: "back.out(1.7)",
          overwrite: "auto",
        });
        gsap.to(connectUnderline.current, {
          scaleX: 1,
          opacity: 1,
          transformOrigin: "center center",
          duration: 0.5,
          ease: "power2.out",
        });
      }
      const handleEnter = contextSafe!((e: Event) => {
        const target = e.currentTarget as HTMLElement;
        moveTo(target);
        showBox();
      });
      const handleLeave = contextSafe!(() => {
        hideBox();
      });
      const links = menu.querySelectorAll<HTMLElement>(".menu-item");
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
    { scope: menuContainer }
  );

  return (
    <div className="relative " ref={menuContainer}>
      <div
        role="navigation"
        className={`flex flex-row justify-center gap-8 mt-8 w-fit mx-auto ${className}`}
      >
        {connectLinks.map((item, i) => (
          <Link
            key={i}
            href={item.href}
            className={`group relative text-[min(3vw,14px)] menu-item text-center flex items-center gap-2 justify-center corner-link`}
          >
            {item.icon && item.icon}
            {item.label && item.label}
            <span className="block absolute bottom-0 w-full h-px bg-fg origin-center scale-x-0 opacity-0 transition-transform duration-300 ease-out group-hover:scale-x-100 group-hover:opacity-100"></span>
          </Link>
        ))}
      </div>
      <div
        className="corners-container absolute pointer-events-none top-0 left-0"
        ref={cornersContainer}
      >
        {["tl", "tr", "bl", "br"].map((pos, i) => (
          <div
            key={pos}
            ref={(el) => {
              if (el) corners.current[i] = el;
            }}
            className={`corner absolute w-2 h-2 border-fg ${
              pos === "tl"
                ? "top-0 left-0 border-t border-l"
                : pos === "tr"
                ? "top-0 right-0 border-t border-r"
                : pos === "bl"
                ? "bottom-0 left-0 border-b border-l"
                : "bottom-0 right-0 border-b border-r"
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default CornerLink;
