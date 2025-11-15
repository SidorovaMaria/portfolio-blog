"use client";
import { SplitText as splitTextGSAP } from "gsap/all";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import React from "react";
import gsap from "gsap";
gsap.registerPlugin(ScrollTrigger, splitTextGSAP);
const SplitText = ({
  text,
  className,
  type = "lines",
  component,
  stagger = 0.025,
  delay = 0,
  optionsIn = {
    y: 100,
    opacity: "0%",
  },
  optionsOut = {
    y: 0,
    opacity: "100%",
  },
}: {
  text: string;
  type: "lines" | "words" | "chars";
  className?: string;
  component?: React.ElementType;
  stagger?: number;
  delay?: number;
  optionsIn?: gsap.TweenVars;
  optionsOut?: gsap.TweenVars;
}) => {
  const Component = component || "div";
  const textRef = React.useRef<HTMLDivElement | null>(null);
  useGSAP(() => {
    new splitTextGSAP(textRef.current, {
      type,
      smartWrap: true,
      // mask: type,
      charsClass: "split-char",
      onSplit: (instance) => {
        return gsap.fromTo(
          instance[type],
          {
            ...optionsIn,
          },
          {
            ...optionsOut,
            ease: "power2.out",
            stagger: stagger,
            delay: delay,
            scrollTrigger: {
              trigger: textRef.current,
              start: "top 80%",
              end: "bottom 20%",
            },
            onComplete: () => instance.revert(),
          }
        );
      },
    });
  });
  return (
    <div className="overflow-hidden">
      <Component className={`${className} split-text`} ref={textRef}>
        {text}
      </Component>
    </div>
  );
};

export default SplitText;
