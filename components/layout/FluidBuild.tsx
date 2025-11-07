"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const FluidBuild = ({ build }: { build: Array<string> }) => {
  useGSAP(() => {
    gsap.set(".fluid-colors > li", { transformOrigin: "0 50%" });
    gsap.set(".fluid-colors > li:not(:first-of-type)", {
      opacity: 0.25,
      filter: "blur(2px)",
    });
    const tl = gsap
      .timeline()
      .to(".fluid-colors > li:not(:first-of-type)", {
        opacity: 1,
        stagger: 0.5,
        filter: "blur(0px)",
      })
      .to(
        ".fluid-colors > li:not(:last-of-type)",
        { opacity: 0.25, stagger: 0.5, filter: "blur(2px)" },
        0
      );
    ScrollTrigger.create({
      trigger: ".fluid-title",
      start: "top center",
      endTrigger: ".fluid-colors > li:last-of-type",
      end: "top center",
      pin: true,
      animation: tl,
      scrub: 0.5,
      snap: 1 / (build.length - 1),
    });
  });
  return (
    <section className="w-full px-8 flex relative ">
      <h2 className="text-[min(7vw,110px)] font-clash tracking-wide font-semibold  fluid-title whitespace-nowrap sticky top-0 h-fit">
        I build
        <span className="sr-only">I build {build.join(", ")}</span>
      </h2>
      <ul className="fluid-colors" style={{ "--count": build.length } as React.CSSProperties}>
        {build.map((item, index) => (
          <li
            style={{ "--i": index } as React.CSSProperties}
            key={index}
            className="text-[min(7vw,110px)] font-clash tracking-wide   fluid-color pl-1 lg:pl-4 scroll-snap-align font-semibold"
          >
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
};

export default FluidBuild;
