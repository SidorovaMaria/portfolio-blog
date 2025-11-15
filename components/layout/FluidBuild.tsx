"use client";
/**
 * A scroll-driven animation component that displays a sticky "I build" title
 * alongside a list of items that animate into focus as the user scrolls.
 *
 * Uses GSAP and ScrollTrigger to create a cinematic effect where:
 * - The title remains pinned in place
 * - List items sequentially come into focus (opacity + blur transitions)
 * - Scroll position controls the animation timeline
 * - Snaps to each item for precise control
 *
 * @component
 * @param {FluidBuildProps} props - Component props
 * @param {string[]} props.build - Array of text items to animate through (e.g., ["websites", "applications", "experiences"])
 *
 * @example
 * ```tsx
 * <FluidBuild build={["websites", "mobile apps", "design systems"]} />
 * ```
 *
 * @remarks
 * - Automatically scales animation based on the number of items
 * - Re-runs animation setup when `build.length` changes
 * - Uses CSS custom properties (`--count`, `--i`) for dynamic styling
 * - Implements scroll-snap behavior for enhanced UX
 */

import { CSSProperties, useMemo, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type FluidBuildProps = {
  build: string[];
};

const FluidBuild = ({ build }: FluidBuildProps) => {
  // Whole section wrapper – used as GSAP scope/root
  const sectionRef = useRef<HTMLElement | null>(null);
  // Sticky title – used as ScrollTrigger "pin" + trigger
  const fluidTitleRef = useRef<HTMLHeadingElement | null>(null);

  useGSAP(
    (context) => {
      const section = sectionRef.current;
      const title = fluidTitleRef.current;

      if (!section || !title) return;

      // Scope queries to this component only
      const items = gsap.utils.toArray<HTMLLIElement>(section.querySelectorAll(".fluid-color"));

      if (!items.length) return;

      // --- Initial state for the color lines ---
      // All items share the same transform origin
      gsap.set(items, { transformOrigin: "0 50%" });

      // All except the first start "muted"
      gsap.set(items.slice(1), {
        opacity: 0.25,
        filter: "blur(2px)",
      });
      // Timeline that cycles focus across the list items
      const tl = gsap
        .timeline()
        // Phase 1: bring all non-first items into focus
        .to(items.slice(1), {
          opacity: 1,
          stagger: 0.5,
          filter: "blur(0px)",
        })
        // Phase 2: dim everything except the last item,
        // starting at the same time (position 0)
        .to(
          items.slice(0, -1),
          {
            opacity: 0.25,
            stagger: 0.5,
            filter: "blur(2px)",
          },
          0
        );
      // Scroll-driven control of the timeline
      ScrollTrigger.create({
        trigger: title, // the sticky title as anchor
        start: "top center",
        endTrigger: items[items.length - 1], // last item defines end
        end: "top center",
        pin: true, // keep title fixed during the sequence
        animation: tl, // link scroll to this timeline
        scrub: 0.5, // smooth scrubbing, takes 0.5 seconds to "catch up"
        snap: build.length > 1 ? 1 / (build.length - 1) : 1, // snap to each item
      });
    },
    { scope: sectionRef, dependencies: [build.length] } // Re-run if the number of items changes -> for scalability
  );
  // CSS custom prop for the list (`--count`)
  const listStyle = useMemo(
    () =>
      ({
        "--count": build.length,
      } as CSSProperties),
    [build.length]
  );

  return (
    <section ref={sectionRef} className="relative flex w-full px-8">
      <h2
        ref={fluidTitleRef}
        className="fluid-title sticky top-0 h-fit whitespace-nowrap text-[min(7vw,110px)] font-clash font-semibold tracking-wide"
      >
        I build
        <span className="sr-only">I build {build.join(", ")}</span>
      </h2>

      <ul className="fluid-colors" style={listStyle}>
        {build.map((item, index) => (
          <li
            key={`${item}-${index}`}
            style={{ "--i": index } as CSSProperties}
            className="fluid-color scroll-snap-align text-[min(7vw,110px)] pl-1 font-clash font-semibold tracking-wide lg:pl-4"
          >
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
};

export default FluidBuild;
