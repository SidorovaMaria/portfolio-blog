"use client";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Brain, Lightbulb, Mail, NotebookIcon } from "lucide-react";
import React, { use } from "react";

const WhyMe = () => {
  useGSAP((context) => {
    const blocks = gsap.utils.toArray(".why-blocks");
    const whyMeBlock = gsap.utils.toArray(".why-me-block");
    const tl = gsap.timeline({ defaults: { ease: "sine.out" } });
    tl.fromTo(
      blocks,
      { y: -20, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: "power2.out",
      },
      ">3"
    ).fromTo(
      whyMeBlock,
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
  });
  return (
    <div className="space-y-8 why-blocks">
      <div className="rounded-2xl p-6 bg-linear-to-b from-bg/30 to-primary/30 backdrop-blur-md">
        <h3 className="text-2xl font-bold">Why Choose Me? </h3>
        <aside className="space-y-6 mt-5 h-fit">
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
export const WhyMeBlock = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => {
  return (
    <div className="flex gap-4 items-center ">
      <div className="w-14 h-14 flex items-center justify-center bg-primary  rounded-lg shrink-0 text-bg dark:text-fg relative z-50">
        {icon}
      </div>
      <div className="why-me-block ">
        <h4 className="font-semibold mb-1">{title}</h4>
        <p className="italic text-sm font-medium opacity-80">{description}</p>
      </div>
    </div>
  );
};
