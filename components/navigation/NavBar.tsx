"use client";
import React, { useRef } from "react";
import { NAVLINKS } from "../../constants";
import Link from "next/link";
import NavLink from "./NavLink";
import ThemeToggle from "../theme/ThemeToggle";
import MobileNavBar from "./MobileNavBar";
import { EnvelopeIcon, GithubIcon, LinkedinIcon } from "@sanity/icons";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";

gsap.registerPlugin(ScrollTrigger);
const NavBar = () => {
  const navRef = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      const nav = navRef.current;
      if (!nav) return;
      // Add/remove a class after we scroll past the top a bit
      ScrollTrigger.create({
        start: "top -10%",
        end: 9_999_999, // effectively "forever"
        toggleClass: { className: "nav-scroll", targets: nav },
        // markers: true, // keep only for debugging
      });

      // Show on scroll up, hide on scroll down
      const showAnim = gsap
        .from(nav, {
          yPercent: -100,
          paused: true,
          duration: 0.2,
          ease: "power2.out",
        })
        .progress(1);

      ScrollTrigger.create({
        start: "top top",
        end: 9_999_999,
        onUpdate: (self) => {
          if (self.direction === -1) showAnim.play();
          else showAnim.reverse();
        },
      });
    },
    { scope: navRef }
  );
  return (
    <header
      ref={navRef}
      className="flex items-center w-full justify-between px-3 md:px-6 py-4 border-b border-fg/50 sticky top-0 z-50"
    >
      <h1 className="text-xl">
        <Link href="/" className="lowercase">
          Maria Sidorova
        </Link>
      </h1>
      <nav className="hidden md:flex">
        <ul className="flex items-center gap-10 relative">
          {NAVLINKS.map((link) => (
            <Link key={link.key} href={link.href} passHref>
              <NavLink href={link.href} label={link.name} />
            </Link>
          ))}
        </ul>
      </nav>
      <div className="hidden md:flex items-center gap-2 ">
        <div className="flex items-center gap-1  border borer-fg rounded-3xl">
          <div
            className="flex items-center justify-center w-8 h-8  bg-bg menu-btn hover:bg-primary/40 transition-colors rounded-full"
            title="Github Portoflio Link"
          >
            <Link href="https://github.com/SidorovaMaria" target="_blank">
              <GithubIcon className="size-6" />
              <p className="sr-only">GitHub Profile</p>
            </Link>
          </div>
          <div
            className="flex items-center justify-center w-8 h-8  bg-bg menu-btn hover:bg-primary/40 transition-colors rounded-full"
            title="LinkedIn Profile Link"
          >
            <Link href="https://www.linkedin.com/in/maria-sidorova-dev/" target="_blank">
              <LinkedinIcon className="size-6" />
              <p className="sr-only">LinkedIn Profile</p>
            </Link>
          </div>
          <div
            className="flex items-center justify-center w-8 h-8  bg-bg menu-btn hover:bg-primary/40 transition-colors rounded-full"
            title="Send me an Email"
          >
            <Link href="mailto:sidmashav@icloud.com" target="_blank">
              <EnvelopeIcon className="size-6" />
              <p className="sr-only">Email me</p>
            </Link>
          </div>
        </div>
        <ThemeToggle />
      </div>
      <MobileNavBar />
    </header>
  );
};

export default NavBar;
