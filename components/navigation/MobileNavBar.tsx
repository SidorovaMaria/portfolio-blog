"use client";
import { NAVLINKS } from "../../constants";
import Link from "next/link";
import ThemeToggle from "../theme/ThemeToggle";
import { EnvelopeIcon, GithubIcon, LinkedinIcon } from "@sanity/icons";
import React from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import clsx from "clsx";
import { usePathname } from "next/navigation";

const MobileNavBar = () => {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const root = React.useRef<HTMLDivElement | null>(null);
  const menuBtnRef = React.useRef<HTMLButtonElement | null>(null);
  const tlRef = React.useRef<gsap.core.Timeline | null>(null);

  useGSAP(
    (context, safeContext) => {
      const menuBtn = menuBtnRef.current!;
      const nav = root.current!.querySelector<HTMLElement>("#nav")!;
      const menuItems = gsap.utils.toArray<HTMLElement>(nav.querySelectorAll(".menu-item"));
      const menuBtnItems = gsap.utils.toArray<HTMLElement>(".menu-btn");

      // Initial state
      gsap.set(nav, { display: "none", xPercent: 0 });
      gsap.set(menuItems, { xPercent: 100, opacity: 0 });
      gsap.set(menuBtnItems, { xPercent: 100, opacity: 0 });

      const tl = gsap
        .timeline({
          paused: true,
          defaults: { duration: 0.4, ease: "sine.inOut" },
        })
        // button rotate
        .to(menuBtn, { rotation: 270 }, 0)
        // show nav + slide it in from right (nav starts off-screen with left-full)
        .set(nav, { display: "flex" }, 0)
        .to(nav, { xPercent: -100 }, 0)
        // cascade items
        .to(menuItems, { xPercent: 0, opacity: 1, stagger: 0.08 }, "<0.1")
        .to(menuBtnItems, { xPercent: 0, opacity: 0.9, stagger: 0.1 }, ">");

      // Start in "closed" state

      // When fully closed, hide from flow/clicks
      tl.eventCallback(
        "onReverseComplete",
        safeContext!(() => {
          gsap.set(nav, { display: "none" });
        })
      );

      // Keep aria/state in sync
      tl.eventCallback(
        "onStart",
        safeContext!(() => {
          setOpen(true);
          menuBtn.setAttribute("aria-expanded", "true");
        })
      );
      tl.eventCallback(
        "onReverseComplete",
        safeContext!(() => {
          setOpen(false);
          menuBtn.setAttribute("aria-expanded", "false");
        })
      );

      tlRef.current = tl;
    },
    { scope: root }
  );

  const toggleMenu = () => {
    const tl = tlRef.current;
    if (!tl) return;
    // If reversed (closed), play to open; otherwise reverse to close
    tl.reversed() ? tl.play() : tl.reverse();
  };
  return (
    <div className="md:hidden" ref={root}>
      <button onClick={toggleMenu} className="flex items-center gap-2">
        <p>menu</p>
        <span
          ref={menuBtnRef}
          id="menu"
          className="menu-button md:hidden"
          aria-label="Navigation menu"
          aria-expanded={open}
          aria-controls="nav"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="60 0 15 22"
            fill="none"
            aria-hidden="true"
            focusable="false"
            className="w-6 h-6 rotate-45"
          >
            <g>
              <path
                d="M68.707 5.53711L66.2013 18.3499"
                stroke="var(--color-fg)"
                strokeWidth="2.5"
              ></path>
              <path d="M73 10.9365L62 12.9365" stroke="var(--color-fg)" strokeWidth="2.5"></path>
            </g>
          </svg>
        </span>
      </button>
      <nav
        id="nav"
        className="fixed left-full top-0 m-0 p-2 -z-10 text-(--dark) h-screen flex-col gap-[0.2rem] hidden md:hidden "
        data-open={open}
      >
        <ul className="list-none p-0 w-[50vw] max-w-[50vw] m-0 menu-list pt-[59px] cursor-pointer  rounded-xl border border-transparent z-50 relative">
          {NAVLINKS.map((link) => (
            <Link href={link.href} key={link.key} passHref>
              <li
                className={clsx(
                  `p-3 border border-fg/50 font-medium lowercase  bg-linear-to-r from-bg to-primary/20 bg-bg rounded-md  my-1 hover:underline transition-all menu-item`,
                  pathname === link.href ? "from-primary transition-all" : ""
                )}
                onClick={toggleMenu}
              >
                {link.name}
              </li>
            </Link>
          ))}
          <li className=" my-2 flex justify-center rounded-md gap-4">
            <div className="flex items-center justify-center w-10 h-10 border rounded-md bg-bg menu-btn ">
              <ThemeToggle />
            </div>
            <div className="flex items-center justify-center w-10 h-10 border rounded-md bg-bg menu-btn  hover:bg-primary/40">
              <Link href="https://github.com/SidorovaMaria">
                <GithubIcon className="size-8 " />
              </Link>
            </div>
            <div className="flex items-center justify-center w-10 h-10 border rounded-md bg-bg menu-btn  hover:bg-primary/40">
              <Link href="https://www.linkedin.com/in/maria-sidorova-dev/">
                <LinkedinIcon className="size-8 " />
              </Link>
            </div>
            <div className="flex items-center justify-center w-10 h-10 border rounded-md bg-bg menu-btn  hover:bg-primary/40">
              <Link href="mailto:sidmashav@icloud.com">
                <EnvelopeIcon className="size-8 " />
              </Link>
            </div>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default MobileNavBar;
