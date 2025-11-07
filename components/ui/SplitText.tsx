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
  options = {
    yPercent: 100,
  },
}: {
  text: string;
  type: "lines" | "words" | "chars";
  className?: string;
  component?: React.ElementType;
  stagger?: number;
  delay?: number;
  options?: gsap.TweenVars;
}) => {
  const Component = component || "div";
  const textRef = React.useRef<HTMLDivElement | null>(null);
  useGSAP(() => {
    new splitTextGSAP(textRef.current, {
      type,
      smartWrap: true,
      mask: type,
      onSplit: (instance) => {
        return gsap.from(instance[type], {
          ...options,
          stagger: stagger,
          delay: delay,
          scrollTrigger: {
            trigger: textRef.current,
            start: "top 80%",
            end: "bottom 20%",
          },
          onComplete: () => instance.revert(),
        });
      },
    });
  });
  return (
    <Component className={className} ref={textRef}>
      {text}
    </Component>
  );
};

export default SplitText;
