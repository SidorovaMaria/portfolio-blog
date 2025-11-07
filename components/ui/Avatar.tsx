"use client";
import { urlFor } from "@/sanity/lib/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import Image from "next/image";
import React, { useRef } from "react";

const Avatar = ({ avatar }: { avatar: any }) => {
  if (!avatar) return null;
  const root = useRef<HTMLDivElement>(null);
  const tlRef = React.useRef<gsap.core.Timeline | null>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const imageEl = imageRef.current;
    const headline = window.document.querySelector(".headline");
    if (!imageEl || !root.current || !headline) return;
    const imgRect = imageEl.getBoundingClientRect();
    const anchorRect = headline.getBoundingClientRect();
    const offset = 0;
    const delta = anchorRect.top - imgRect.top + offset;
    console.log("Delta for Avatar animation:", delta);
    gsap.set(imageEl, {
      y: delta,
      zIndex: -30,
      opacity: 0.5,
      filter: "grayscale(1) blur(3px)  ",
    });
    const tl = gsap.timeline({
      defaults: { ease: "power2.out" },
      scrollTrigger: {
        trigger: root.current,
        start: `+=${delta} top`,
        end: "bottom center",
        scrub: true,
        // once: true,
      },
    });

    tl.to(imageEl, {
      y: 0,
      opacity: 1,
      filter: "grayscale(0) blur(0px) ",
      ease: "power2.out",
      duration: 1.5,
    });
    tl.fromTo(".profile-title", { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 1 }, "<0.5");
    tl.fromTo(
      ".profile-description",
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1 },
      "<0.5"
    );
  });
  return (
    <div className="avatar-container " ref={root}>
      <div
        className="w-[75vw] max-w-[800px] h-[45vw] max-h-[450px] mx-auto relative text-white leading-tight opacity-0  "
        ref={imageRef}
      >
        {avatar && (
          <Image
            src={urlFor(avatar).width(800).height(450).quality(90).auto("format").url()}
            alt={avatar.alt || "Avatar Image"}
            width="800"
            height="450"
            className="w-full h-full object-cover object-[0%_80%] rounded-2xl
           "
          />
        )}
        <p
          className="profile-title absolute bottom-4 left-4 
        text-[min(3vw,36px)] max-w-[min(30vw,384px)] opacity-0 "
        >
          Translating imagination into scalable systems
        </p>
        <p className=" profile-description absolute bottom-4 text-right right-4 text-[min(2vw,18px)] max-w-[min(30vw,300px)] opacity-0 bg-black/50 p-2 rounded-xl">
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
