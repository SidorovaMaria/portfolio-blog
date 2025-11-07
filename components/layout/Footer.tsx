"use client";

import NavLink from "../navigation/NavLink";
import CornerLink from "../ui/CornerLink";
import { EnvelopeIcon, GithubIcon, LaunchIcon, LinkedinIcon } from "@sanity/icons";
import { GetAuthorSocialLinksQueryResult } from "@/sanity/types";
import { InstagramIcon } from "lucide-react";
import Image from "next/image";
import { NAVLINKS } from "../../constants";
import Link from "next/link";

const Footer = ({ socialLinks }: { socialLinks: GetAuthorSocialLinksQueryResult }) => {
  console.log("Footer socialLinks:", socialLinks);
  const socialIcons = [
    {
      icon: <GithubIcon className="size-6" />,
      href: socialLinks?.socialLinks?.github ?? "/not-found",
    },
    {
      icon: <LinkedinIcon className="size-6" />,
      href: socialLinks?.socialLinks?.linkedin ?? "/not-found",
    },
    {
      icon: <EnvelopeIcon className="size-6" />,
      href: socialLinks?.socialLinks?.email ?? "/not-found",
    },
  ];
  return (
    <footer className="w-full bg-primary/20  rounded-t-3xl px-10 md:px-16 py-6 flex flex-col justify-between">
      <div className="flex items-center justify-between w-full px-2">
        <h3 className="text-[min(6vw,64px)] font-semibold">Let's Connect</h3>
        <CornerLink
          className="mt-0!"
          connectLinks={[
            {
              label: "Contact Me",
              href: "/contacts",
              icon: <LaunchIcon className="size-8" />,
            },
          ]}
        />
      </div>
      <hr className="my-4 border-fg/30" />
      <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr]  items-center">
        <div className="flex flex-col items-center md:items-start gap-4">
          <div className="flex items-center gap-6">
            <Image
              src="/icon.png"
              alt=" Logo"
              width={40}
              height={40}
              className="object-contain bg-white rounded-full"
            />
            <h1 className="text-[min(4vw,32px)] font-semibold">Maria Sidorova</h1>
          </div>
          <p className="tracking-wide text-[min(3vw,16px)] text-center md:text-left">
            A software engineer with a deep love for clean design, logical structure, and the quiet
            satisfaction of solving hard problems. Open to graduate and junior software engineering
            roles where I can grow, contribute, and keep learning.
          </p>

          <div className="flex flex-col md:items-end mt-4 md:mt-0">
            <CornerLink connectLinks={socialIcons} className="mt-0!" />
          </div>
        </div>
        <div className="flex flex-col md:items-end px-8 justify-center mt-6 md:mt-0">
          <p className="font-bold hover:text-primary text-center text-lg">Navigation</p>
          <nav>
            <ul className="flex flex-col items-center  md:items-end gap-2 my-4">
              {NAVLINKS.map((link) => (
                <Link key={link.key} href={link.href} passHref>
                  <NavLink href={link.href} label={link.name} />
                </Link>
              ))}
            </ul>
          </nav>
        </div>
      </div>
      <hr className="my-4 border-fg/30" />
      <p className="text-center tracking-wider md:text-right">
        © {new Date().getFullYear()} Maria Sidorova. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
