"use client";

import { CSSProperties, useEffect, useMemo, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type FluidBuildProps = {
  build: string[];
};

const FluidBuild = ({ build }: FluidBuildProps) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const fluidTitleRef = useRef<HTMLHeadingElement | null>(null);
  useEffect(() => {
    if (fluidTitleRef.current) {
      console.log("FluidBuild mounted, title:", fluidTitleRef.current.getBoundingClientRect());
    }
  }, []);

  useGSAP(
    (context) => {
      const section = sectionRef.current;
      if (!section) return;

      // Scope queries to this component only
      const items = gsap.utils.toArray<HTMLLIElement>(section.querySelectorAll(".fluid-color"));
      const title = fluidTitleRef.current;

      if (!items.length || !title) return;

      context.add(() => {
        // Initial state
        gsap.set(items, { transformOrigin: "0 50%" });
        gsap.set(items.slice(1), {
          opacity: 0.25,
          filter: "blur(2px)",
        });

        const tl = gsap
          .timeline()
          .to(items.slice(1), {
            opacity: 1,
            stagger: 0.5,
            filter: "blur(0px)",
          })
          .to(
            items.slice(0, -1),
            {
              opacity: 0.25,
              stagger: 0.5,
              filter: "blur(2px)",
            },
            0
          );

        ScrollTrigger.create({
          trigger: title,
          start: "top center",
          endTrigger: items[items.length - 1],
          end: "top center",
          pin: true,
          animation: tl,
          scrub: 0.5,
          snap: build.length > 1 ? 1 / (build.length - 1) : 1,
        });
      });
    },
    { scope: sectionRef }
  );

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
