"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useTheme } from "next-themes";
import { use, useRef } from "react";

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const sunRef = useRef<SVGSVGElement>(null);
  const moonRef = useRef<SVGSVGElement>(null);
  useGSAP(() => {
    const tl = gsap.timeline({
      defaults: { duration: 0.5, ease: "sine.inOut" },
    });
    gsap.set(sunRef.current, { transformOrigin: "50% 50%", opacity: 0 });
    gsap.set(moonRef.current, { transformOrigin: "50% 50%", opacity: 0 });
    if (theme === "dark") {
      tl.to(moonRef.current, { opacity: 1, rotation: 0 }, 0).to(
        sunRef.current,
        { opacity: 0, rotation: -90 },
        0
      );
    } else {
      tl.to(sunRef.current, { opacity: 1, rotation: 0 }, 0).to(
        moonRef.current,
        { opacity: 0, rotation: 90 },
        0
      );
    }
  }, [theme]);
  return (
    <button
      aria-label="Toggle Dark Mode"
      type="button"
      className="w-8 h-8 flex items-center justify-center relative hover:bg-primary/40 bg-bg md:rounded-full transition-colors"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      <p className="sr-only">Toggle Mode</p>
      <svg
        ref={moonRef}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 -960 960 960"
        width="24"
        height="24"
        role="img"
        aria-hidden="true"
        className="absolute  top-1/2 left-1/2  -translate-x-1/2 -translate-y-1/2 opacity-0"
      >
        <path
          id="moon"
          fill="currentColor"
          d="M600-640 480-760l120-120 120 120-120 120Zm200 120-80-80 80-80 80 80-80 80ZM483-80q-84 0-157.5-32t-128-86.5Q143-253 111-326.5T79-484q0-146 93-257.5T409-880q-18 99 11 193.5T520-521q71 71 165.5 100T879-410q-26 144-138 237T483-80Zm0-80q88 0 163-44t118-121q-86-8-163-43.5T463-465q-61-61-97-138t-43-163q-77 43-120.5 118.5T159-484q0 135 94.5 229.5T483-160Zm-20-305Z"
        />
      </svg>

      <svg
        ref={sunRef}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 -960 960 960"
        width="24"
        height="24"
        role="img"
        aria-hidden="true"
        className="absolute top-1/2 left-1/2  -translate-x-1/2 -translate-y-1/2 opacity-0   "
      >
        <path
          id="sun"
          fill="currentColor"
          d="M480-360q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35Zm0 80q-83 0-141.5-58.5T280-480q0-83 58.5-141.5T480-680q83 0 141.5 58.5T680-480q0 83-58.5 141.5T480-280ZM200-440H40v-80h160v80Zm720 0H760v-80h160v80ZM440-760v-160h80v160h-80Zm0 720v-160h80v160h-80ZM256-650l-101-97 57-59 96 100-52 56Zm492 496-97-101 53-55 101 97-57 59Zm-98-550 97-101 59 57-100 96-56-52ZM154-212l101-97 55 53-97 101-59-57Zm326-268Z"
        />
      </svg>
    </button>
  );
};

export default ThemeToggle;
