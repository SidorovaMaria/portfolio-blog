/**
 * A React component that animates text by splitting it into lines, words, or characters
 * using GSAP's SplitText plugin and ScrollTrigger.
 *
 * @component
 * @example
 * ```tsx
 * <SplitText
 *   text="Hello World"
 *   type="words"
 *   stagger={0.05}
 *   className="text-4xl"
 * />
 * ```
 *
 * @param {string} text - The text content to be split and animated
 * @param {"lines" | "words" | "chars"} [type="lines"] - The type of split to perform on the text
 * @param {string} [className] - Additional CSS classes to apply to the text component
 * @param {React.ElementType} [component] - Custom HTML element or React component to render (defaults to "div")
 * @param {number} [stagger=0.025] - The delay in seconds between each element's animation
 * @param {number} [delay=0] - The initial delay in seconds before the animation starts
 * @param {gsap.TweenVars} [optionsIn] - GSAP animation properties for the initial state (defaults to {y: 100, opacity: 0})
 * @param {gsap.TweenVars} [optionsOut] - GSAP animation properties for the final state (defaults to {y: 0, opacity: 1})
 *
 * @returns {JSX.Element} A wrapper div with overflow-hidden containing the animated text component
 *
 * @remarks
 * - The animation is triggered when the element enters the viewport (ScrollTrigger: top 80%)
 * - The SplitText instance is automatically reverted after animation completes to restore original DOM structure
 * - The component re-runs animations when text, type, stagger, or delay dependencies change
 */
"use client";

import React from "react";
import gsap from "gsap";
import { SplitText as splitTextGSAP } from "gsap/all";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, splitTextGSAP);

type SplitTextProps = {
  text: string;
  type?: "lines" | "words" | "chars";
  className?: string;
  component?: React.ElementType;
  stagger?: number;
  delay?: number;
  optionsIn?: gsap.TweenVars;
  optionsOut?: gsap.TweenVars;
};
const defaultIn: gsap.TweenVars = {
  y: 100,
  opacity: 0,
};

const defaultOut: gsap.TweenVars = {
  y: 0,
  opacity: 1,
};
const SplitText = ({
  text,
  className,
  type = "lines",
  component,
  stagger = 0.025,
  delay = 0,
  optionsIn = defaultIn,
  optionsOut = defaultOut,
}: SplitTextProps) => {
  const Component = component || "div";
  const textRef = React.useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const el = textRef.current;
      if (!el) return;

      const split = new splitTextGSAP(el, {
        type,
        smartWrap: true,
        charsClass: "split-char",
      });

      const targets = split[type]; // split.lines | split.words | split.chars

      if (!targets || !targets.length) {
        split.revert();
        return;
      }

      const tween = gsap.fromTo(
        targets,
        {
          ...(optionsIn || defaultIn),
        },
        {
          ...(optionsOut || defaultOut),
          ease: "power2.out",
          stagger,
          delay,
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
            end: "bottom 20%",
            // markers: true,
          },
          onComplete: () => {
            split.revert();
          },
        }
      );
    },
    {
      scope: textRef,
      // rerun only when content or animation config meaningfully changes
      dependencies: [text, type, stagger, delay],
    }
  );
  return (
    <div className="overflow-hidden">
      <Component className={`${className} split-text`} ref={textRef}>
        {text}
      </Component>
    </div>
  );
};

export default SplitText;
