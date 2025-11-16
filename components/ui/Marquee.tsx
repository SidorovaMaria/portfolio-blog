/**
 * A horizontal scrolling marquee component that displays a list of technology items with icons.
 *
 * @remarks
 * This component uses GSAP animations to create a continuous horizontal loop effect.
 * The scroll speed dynamically adjusts based on user scroll velocity, with smooth transitions
 * between different speeds. Items fade in with a staggered animation on mount.
 *
 * @component
 * @example
 * ```tsx
 * const techStack = [
 *   { title: "React", icon: sanityImageObject },
 *   { title: "TypeScript", icon: sanityImageObject }
 * ];
 *
 * <Marquee techStack={techStack} />
 * ```
 *
 * @param props - The component props
 * @param props.techStack - Array of technology items to display in the marquee
 * @param props.techStack[].title - The name/title of the technology
 * @param props.techStack[].icon - Sanity image object for the technology icon
 *
 * @returns A rotating marquee displaying technology stack items with icons
 */
"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { horizontalLoop } from "../../lib/gsap/horizontalLoop";
import { urlFor } from "@/sanity/lib/image";

gsap.registerPlugin(ScrollTrigger);
type TechItem = {
  title: string;
  icon: any; // you can tighten this to your Sanity image type later
};
type MarqueeProps = {
  techStack: TechItem[];
};
const Marquee = ({ techStack }: MarqueeProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<HTMLDivElement[]>([]);
  const refs = useRef<HTMLDivElement[]>([]);

  useGSAP(
    () => {
      const items = itemRefs.current.filter(Boolean);
      if (!items.length) return;
      // Soft fade/slide-in on mount
      gsap.fromTo(
        items,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, delay: 2, stagger: 0.05 }
      );

      const tl = horizontalLoop(items, {
        repeat: -1,
        paused: false,
        reversed: false,
        paddingRight: 24,
        snap: techStack.length,
      });

      const BASE = 0.5; // idle drift when no scrolling
      const MAX = 1.5; // cap how wild it can get
      tl.timeScale(BASE);

      ScrollTrigger.create({
        onUpdate: (self) => {
          const velocity = self.getVelocity();
          const mag = gsap.utils.clamp(
            0,
            MAX,
            gsap.utils.mapRange(0, 3000, BASE, MAX, Math.abs(velocity))
          );
          const dir = velocity === 0 ? 0 : velocity > 0 ? 1 : -1;
          const target = dir === 0 ? BASE : mag * dir;
          // Smoothly ease to the new timeScale to avoid jitter.
          gsap.to(tl, {
            timeScale: target,
            duration: 0.2,
            overwrite: true,
          });
        },
      });
    },
    {
      scope: containerRef,
      dependencies: [techStack.length],
    }
  );
  return (
    <div
      ref={containerRef}
      className="my-18 flex w-full -rotate-2 items-center gap-6 overflow-hidden px-6 py-6 border-primary"
    >
      {techStack.map((tech, i) => (
        <div
          key={tech.title ?? i}
          ref={(el) => {
            if (el) itemRefs.current[i] = el;
          }}
          className="flex items-center justify-center gap-2 pr-6"
        >
          {tech.icon ? (
            <Image
              src={urlFor(tech.icon).width(20).height(20).quality(100).auto("format").url()}
              alt={tech.title}
              width={20}
              height={20}
              className="inline-flex whitespace-nowrap"
            />
          ) : null}
          <p className="font-clash whitespace-nowrap text-base uppercase tracking-wider text-muted">
            {tech.title}
          </p>
        </div>
      ))}
    </div>
  );
};

export default Marquee;
