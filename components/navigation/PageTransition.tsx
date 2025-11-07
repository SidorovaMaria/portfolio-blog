"use client";

import { useRef, startTransition } from "react";
import { gsap } from "gsap";
import { TransitionRouter } from "next-transition-router";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const mainRef = useRef<HTMLElement>(null);

  return (
    <TransitionRouter
      auto={true}
      leave={(next) => {
        const tl = gsap
          .timeline({
            defaults: { ease: "sine.inOut", duration: 0.5 },
            onComplete: () => startTransition(() => next()),
          })
          .fromTo(mainRef.current, { opacity: 1 }, { opacity: 0 }, 0);
        return () => tl.kill();
      }}
      enter={(next) => {
        const tl = gsap
          .timeline({ defaults: { ease: "sine.inOut", duration: 0.5 }, onComplete: () => next() })
          .fromTo(mainRef.current, { opacity: 0 }, { opacity: 1 });
        return () => tl.kill();
      }}
    >
      <main ref={mainRef} className="relative z-10">
        {children}
      </main>
    </TransitionRouter>
  );
}
