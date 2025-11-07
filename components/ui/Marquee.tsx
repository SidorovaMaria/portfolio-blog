"use client";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import React, { useRef } from "react";
import { horizontalLoop } from "../../lib/gsap/horizontalLoop";
import gsap from "gsap";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";

const Marquee = ({
  techStack,
}: {
  techStack: Array<{
    title: string;
    icon: any;
  }>;
}) => {
  const refs = useRef<HTMLDivElement[]>([]);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useGSAP(() => {
    gsap.fromTo(refs.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 1, delay: 2 });
    const tl = horizontalLoop(refs.current, {
      repeat: -1,
      paused: false,
      reversed: false,
      paddingRight: 24,
      snap: techStack.length,
    });
    tlRef.current = tl;
    const BASE = 0.5; // idle drift when no scrolling
    const MAX = 1.5; // cap how wild it can get
    tl.timeScale(BASE);
    const scrollTrigger = ScrollTrigger.create({
      onUpdate: (self) => {
        const velocity = self.getVelocity();
        // Compute a magnitude for the animation timeScale from scroll velocity:
        // - Map the absolute ScrollTrigger velocity (0..3000) into the desired timescale range (BASE..MAX).
        // - Clamp the result to [0, MAX] to prevent negative or excessively large values.
        // `mag` will be used (with direction) to set the timeline's timeScale.
        const mag = gsap.utils.clamp(
          0,
          MAX,
          gsap.utils.mapRange(0, 3000, BASE, MAX, Math.abs(velocity))
        );
        const dir = velocity === 0 ? 0 : velocity > 0 ? 1 : -1;
        const target = dir === 0 ? BASE : mag * dir;
        // Smoothly ease to the new timeScale to avoid jitter.
        gsap.to(tl, { timeScale: target, duration: 0.2, overwrite: true });
      },
    });
  });
  return (
    <div className="flex items-center w-full border-primary px-6 py-6 my-18 overflow-hidden gap-6 -rotate-2 ">
      {techStack.map((tech, i) => (
        <div
          key={i}
          ref={(el) => {
            refs.current[i] = el!;
          }}
          className="flex gap-2 items-center justify-center pr-6"
        >
          {tech?.icon ? (
            <Image
              src={urlFor(tech?.icon).width(20).height(20).quality(100).auto("format").url()}
              alt={tech.title}
              width="20"
              height="20"
              className="inline-flex whitespace-nowrap"
            />
          ) : null}
          <p className="whitespace-nowrap text-base font-clash text-muted  tracking-wider uppercase">
            {tech.title}
          </p>
        </div>
      ))}
    </div>
  );
};

export default Marquee;
