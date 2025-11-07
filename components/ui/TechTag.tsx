"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";

import { useRef } from "react";

type ProjectMagneticLinkProps = {
  title: string;
  className?: string;
};
const TechTag = ({ title, className }: ProjectMagneticLinkProps) => {
  const tagRef = useRef<HTMLLIElement | null>(null);
  useGSAP((context, contextSafe) => {
    const tag = tagRef.current;
    if (!tag) return;
    const onMouseMove = contextSafe!((e: MouseEvent) => {
      const rect = tag.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      gsap.to(tag, {
        x: x * 0.3,
        y: y * 0.3,
        ease: "power2.out",
        duration: 0.3,
      });
    });

    const onMouseLeave = contextSafe!(() => {
      gsap.to(tag, {
        x: 0,
        y: 0,
        ease: "power2.out",
        duration: 0.5,
      });
    });

    tag.addEventListener("mousemove", onMouseMove);
    tag.addEventListener("mouseleave", onMouseLeave);

    return () => {
      tag.removeEventListener("mousemove", onMouseMove);
      tag.removeEventListener("mouseleave", onMouseLeave);
    };
  });
  return (
    <li
      ref={tagRef}
      className={`cursor-default text-xs lg:text-sm border border-current rounded-xl px-4 py-1 transition text-(--text-dark) ${className}`}
    >
      <span className="font-medium">{title}</span>
    </li>
  );
};

export default TechTag;
