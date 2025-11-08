"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { usePathname } from "next/navigation";

gsap.registerPlugin(SplitText);

const NavLink = ({
  href,
  label,
  className,
}: {
  href: string;
  label: string;
  className?: string;
}) => {
  const pathname = usePathname();
  const isActive = pathname === href;
  const root = useRef<HTMLLIElement | null>(null);
  const line1 = useRef<HTMLParagraphElement | null>(null);
  const line2 = useRef<HTMLParagraphElement | null>(null);
  const underline = useRef<HTMLSpanElement | null>(null);
  // We'll fill these with contextSafe functions inside useGSAP:
  const onEnterRef = useRef<() => void>(() => {});
  const onLeaveRef = useRef<() => void>(() => {});
  const onClickRef = useRef<() => void>(() => {});

  useGSAP(
    (_, contextSafe) => {
      if (isActive) {
        gsap.to(underline.current, {
          scaleX: 1,
          transformOrigin: "left bottom",
          duration: 0.6,
          ease: "sine.out",
        });
        return;
      } else {
        gsap.to(underline.current, {
          scaleX: 0,
          transformOrigin: "right bottom",
          duration: 0.6,
          ease: "sine.out",
        });
      }
      const split1 = new SplitText(line1.current!, { type: "chars" });
      const split2 = new SplitText(line2.current!, { type: "chars" });
      // Split just the elements in this component instance

      const tl = gsap
        .timeline({
          paused: true,
          defaults: { duration: 0.4, stagger: 0.02, ease: "sine.out" },
        })
        .to(split1.chars, { yPercent: -120 }, 0)
        .to(split2.chars, { yPercent: -100 }, 0);

      // “context safe” (Strict Mode + unmount/re-mount proof)
      onEnterRef.current = contextSafe!(() => tl.play());
      onLeaveRef.current = contextSafe!(() => tl.reverse());

      // Revert SplitText on cleanup to restore original DOM
      return () => {
        split1.revert();
        split2.revert();
      };
    },
    { scope: root, dependencies: [isActive] }
  );

  return (
    <li
      ref={root}
      className="relative inline-block overflow-hidden cursor-pointer select-none"
      aria-label={label}
    >
      <p
        ref={line1}
        className={`link-text-1 text-sm tracking-wider font-clash lowercase text-fg ${
          isActive ? "pointer-events-none" : "peer"
        } ${className}`}
        onMouseEnter={() => onEnterRef.current()}
        onMouseLeave={() => onLeaveRef.current()}
        onFocus={() => onEnterRef.current()}
        onBlur={() => onLeaveRef.current()}
      >
        {label}
      </p>
      <span
        ref={underline}
        className=" absolute bottom-0 left-0 w-full h-px bg-fg scale-x-0 origin-left"
      />
      {/* Hover underline  */}
      <span className=" absolute bottom-0 left-0 w-full h-px bg-fg scale-x-0 origin-left peer-hover:scale-x-100 transition-transform duration-600 ease-in-out" />

      {/* the “revealed” copy stacked on top */}
      <p
        ref={line2}
        className={`link-text-2 text-sm tracking-wider font-clash lowercase text-fg  pointer-events-none absolute ${className}`}
        aria-hidden
      >
        {label}
      </p>
    </li>
  );
};

export default NavLink;
