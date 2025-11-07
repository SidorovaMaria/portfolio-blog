"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";

import { Component, useRef } from "react";

type ProjectMagneticLinkProps = {
  title: string;
  className?: string;
  button?: boolean;
  onClick?: () => void;
  active?: boolean;
};
const TechTag = ({ title, className, button, onClick, active }: ProjectMagneticLinkProps) => {
  const tagRef = useRef<HTMLLIElement | null>(null);
  const tagButtonRef = useRef<HTMLButtonElement | null>(null);
  useGSAP((context, contextSafe) => {
    const tag = button ? tagButtonRef.current : tagRef.current;
    if (!tag) return;
    const onMouseMove = contextSafe!((e: Event) => {
      const ev = e as MouseEvent;
      const rect = tag.getBoundingClientRect();
      const x = ev.clientX - rect.left - rect.width / 2;
      const y = ev.clientY - rect.top - rect.height / 2;
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
  if (button) {
    return (
      <button
        onClick={onClick}
        ref={tagButtonRef}
        className={`cursor-pointer text-[min(4vw,14px)] border px-2.5 p-1 rounded-xl hover:bg-muted hover:text-bg transition-all duration-300 ${
          active ? "bg-muted text-bg" : "bg-transparent"
        } ${className}`}
      >
        <span className="font-medium">{title}</span>
      </button>
    );
  }

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
