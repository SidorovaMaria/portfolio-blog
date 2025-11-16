/**
 * A reusable component that displays a technology tag with magnetic hover effect.
 *
 * The component uses GSAP animations to create a magnetic effect where the tag
 * follows the mouse cursor when hovering over it. The tag can be rendered either
 * as a button or a list item depending on the props.
 *
 * @component
 * @example
 * // As a static tag
 * <TechTag title="React" />
 *
 * @example
 * // As an interactive button
 * <TechTag
 *   title="TypeScript"
 *   button={true}
 *   active={true}
 *   onClick={() => console.log('clicked')}
 * />
 *
 * @param {Object} props - The component props
 * @param {string} props.title - The text content displayed in the tag
 * @param {string} [props.className] - Optional additional CSS classes to apply
 * @param {boolean} [props.button] - If true, renders as a button; otherwise renders as a list item
 * @param {() => void} [props.onClick] - Click handler function (only applies when button is true)
 * @param {boolean} [props.active] - If true, applies active styling (only applies when button is true)
 *
 * @returns {JSX.Element} A styled tag element with magnetic hover effect
 */
"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import React, { useRef } from "react";

type ProjectMagneticLinkProps = {
  title: string;
  className?: string;
  button?: boolean;
  onClick?: () => void;
  active?: boolean;
};

const TechTag = ({ title, className, button, onClick, active }: ProjectMagneticLinkProps) => {
  const tagRef = useRef<HTMLElement | null>(null);

  useGSAP(
    (context, contextSafe) => {
      const tag = tagRef.current;
      if (!tag) return;

      const onMouseMove = contextSafe!((e: Event) => {
        const ev = e as MouseEvent;
        const rect = tag.getBoundingClientRect();
        const x = ev.clientX - rect.left - rect.width / 2;
        const y = ev.clientY - rect.top - rect.height / 2;

        gsap.to(tag, {
          x: x * 0.5,
          y: y * 0.5,
          ease: "none",
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
    },
    { scope: tagRef }
  );

  if (button) {
    return (
      <button
        ref={tagRef as React.RefObject<HTMLButtonElement>}
        onClick={onClick}
        className={[
          "cursor-pointer rounded-xl border px-2.5 p-1 text-[min(4vw,14px)] transition-all duration-300 hover:bg-muted hover:text-bg",
          active ? "bg-muted text-bg" : "bg-transparent",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <span className="font-medium">{title}</span>
      </button>
    );
  }

  return (
    <li
      ref={tagRef as React.RefObject<HTMLLIElement>}
      className={[
        "cursor-default rounded-xl border border-current px-4 py-1 text-xs text-(--text-dark) transition lg:text-sm",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span className="font-medium">{title}</span>
    </li>
  );
};

export default TechTag;
