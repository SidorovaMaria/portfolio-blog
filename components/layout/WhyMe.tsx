"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Brain, Lightbulb, Mail, NotebookIcon } from "lucide-react";

type WhyMeBlockProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
};
/* ---------------------------- SINGLE WHY-ME ITEM ---------------------------- */

export const WhyMeBlock = ({ icon, title, description }: WhyMeBlockProps) => {
  return (
    <div className="why-me-row flex items-center gap-4">
      <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-primary text-bg dark:text-fg">
        {icon}
      </div>
      <div className="why-me-block">
        <h4 className="mb-1 font-semibold">{title}</h4>
        <p className="text-sm font-medium italic opacity-80">{description}</p>
      </div>
    </div>
  );
};

const WhyMe = () => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;
      const container = root.querySelector(".why-card");
      const rows = gsap.utils.toArray<HTMLElement>(root.querySelectorAll(".why-me-row"));
      const textBlocks = gsap.utils.toArray<HTMLElement>(root.querySelectorAll(".why-me-block"));
      if (!container || !rows.length || !textBlocks.length) return;

      const tl = gsap.timeline({ defaults: { ease: "sine.out" } });
      // 1) Fade + slide in the whole block of items
      tl.fromTo(
        container,
        { y: -20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
        },
        ">3"
      );
      // 2) Then animate each row's text content with a stagger
      tl.fromTo(
        textBlocks,
        { xPercent: -20, opacity: 0, zIndex: -10 },
        {
          xPercent: 0,
          zIndex: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.3,
          ease: "power1.out",
        },
        "-=0.5"
      );
    },
    {
      scope: rootRef,
    }
  );
  return (
    <div ref={rootRef} className="why-blocks space-y-8">
      <div className="why-card rounded-2xl bg-linear-to-b from-bg/30 to-primary/30 p-6 backdrop-blur-md">
        <h3 className="text-2xl font-bold">Why Choose Me?</h3>
        <aside className="mt-5 h-fit space-y-6">
          <WhyMeBlock
            icon={<Brain size={20} />}
            title="Creative Problem Solver"
            description="I thrive on tackling complex challenges with innovative solutions that drive results."
          />
          <WhyMeBlock
            icon={<Mail size={20} />}
            title="Excellent Communicator"
            description="I prioritize clear and open communication to ensure successful collaboration and project outcomes."
          />
          <WhyMeBlock
            icon={<Lightbulb size={20} />}
            title="Innovative Thinker"
            description="I bring fresh ideas and perspectives to every project, fostering creativity and innovation."
          />
          <WhyMeBlock
            icon={<NotebookIcon size={20} />}
            title="Constant Learner"
            description="I am committed to continuous learning and self-improvement, always seeking new knowledge and skills."
          />
        </aside>
      </div>
    </div>
  );
};

export default WhyMe;
// export const WhyMeBlock = ({
//   icon,
//   title,
//   description,
// }: {
//   icon: React.ReactNode;
//   title: string;
//   description: string;
// }) => {
//   return (
//     <div className="flex gap-4 items-center ">
//       <div className="w-14 h-14 flex items-center justify-center bg-primary  rounded-lg shrink-0 text-bg dark:text-fg relative z-50">
//         {icon}
//       </div>
//       <div className="why-me-block ">
//         <h4 className="font-semibold mb-1">{title}</h4>
//         <p className="italic text-sm font-medium opacity-80">{description}</p>
//       </div>
//     </div>
//   );
// };
