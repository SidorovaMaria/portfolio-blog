/**
 * Avatar component that displays an animated profile image with overlaid text content.
 *
 * @component
 * @param {Object} props - Component props
 * @param {any} props.avatar - Avatar image object from Sanity CMS containing image data and alt text
 *
 * @returns {JSX.Element | null} Rendered avatar container with animated image and text overlays, or null if no avatar is provided
 *
 * @description
 * This client-side component uses GSAP animations to create a scroll-triggered reveal effect.
 * The avatar image starts in a grayscale, blurred state and animates to full color and clarity
 * as the user scrolls. Title and description text elements fade in with a staggered timing.
 *
 * Animation Features:
 * - Initial state: Image is positioned below anchor point, semi-transparent, grayscale with blur
 * - Scroll trigger: Animation starts when component enters viewport
 * - Transitions: Smooth easing with scrubbing for natural scroll-synced animation
 * - Text reveals: Profile title and description fade in sequentially
 *
 * @requires next/image - For optimized image rendering
 * @requires gsap - For animation timeline and scroll triggers
 * @requires @gsap/react - For React integration with useGSAP hook
 * @requires @/sanity/lib/image - For Sanity image URL generation
 *
 * @example
 * ```tsx
 * <Avatar avatar={sanityAvatarObject} />
 * ```
 */
"use client";

import { urlFor } from "@/sanity/lib/image";
import {
  Author,
  internalGroqTypeReferenceTo,
  SanityImageCrop,
  SanityImageHotspot,
} from "@/sanity/types";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Image from "next/image";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

const Avatar = ({ avatar }: { avatar: Author["avatar"] }) => {
  if (!avatar) return null;

  const rootRef = useRef<HTMLDivElement>(null);
  const imageWrapperRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const root = rootRef.current;
    const imgWrapper = imageWrapperRef.current;
    const headline = document.querySelector(".headline");
    if (!root || !imgWrapper || !headline) return;

    // Measurements
    const imgBox = imgWrapper.getBoundingClientRect();
    const anchorBox = headline.getBoundingClientRect();

    const offset = 50;

    const deltaY = anchorBox.top - imgBox.top + offset;
    // Initial state
    gsap.set(imgWrapper, {
      y: deltaY,
      opacity: 0.5,
      zIndex: -30,
      filter: "grayscale(1) blur(3px)",
    });

    const tl = gsap.timeline({
      defaults: { ease: "power2.out" },
      scrollTrigger: {
        trigger: root,
        start: `+=${deltaY} 18%`,
        end: "bottom center",
        scrub: 0.25,
      },
    });

    // Image reveal

    tl.to(imgWrapper, {
      y: 0,
      opacity: 1,
      filter: "grayscale(0) blur(0px) ",
      duration: 1.5,
    });
    //Title and description reveal
    tl.fromTo(".profile-title", { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 1 }, "<0.5");

    tl.fromTo(
      ".profile-description",
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1 },
      "<0.5"
    );
  });
  return (
    <div className="avatar-container " ref={rootRef}>
      <div
        ref={imageWrapperRef}
        className="relative mx-auto h-[45vw] max-h-[450px] w-[75vw] max-w-[800px] leading-tight text-white opacity-0"
      >
        {avatar && (
          <Image
            src={urlFor(avatar).width(800).height(450).quality(90).auto("format").url()}
            alt={avatar.alt || "Avatar Image"}
            width={800}
            height={450}
            className="h-full w-full rounded-2xl object-cover object-[0%_80%]"
          />
        )}
        <p className="profile-title absolute bottom-4 left-4 max-w-[min(30vw,384px)] text-[min(3vw,36px)] opacity-0">
          Translating imagination into scalable systems
        </p>
        <p className="profile-description absolute bottom-4 right-4 max-w-[min(30vw,300px)] rounded-xl bg-black/50 p-2 text-right text-[min(2vw,18px)] opacity-0">
          Genuine love for clean, well-structured code, intuitive design, and meaningful
          collaboration.
          <span className="hidden md:inline">
            <br />I care deeply about building software that not only functions flawlessly but also
            feels effortless to use.
          </span>
        </p>
      </div>
    </div>
  );
};

export default Avatar;
