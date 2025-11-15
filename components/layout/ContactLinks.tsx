/**
 * ContactLinks component displays social media links and contact information with GSAP animations.
 *
 * @component
 * @param {ContactLinksProps} props - The component props
 * @param {GetAuthorSocialLinksQueryResult} props.socials - Social media links data retrieved from Sanity CMS
 *
 * @remarks
 * This component uses GSAP animations to animate contact links on mount with a staggered fade-in effect.
 * It displays a CornerLink component for social media icons and direct contact methods (email and phone).
 * The animations start with a 2-second delay to allow title animations to complete first.
 *
 * @example
 * ```tsx
 * <ContactLinks socials={socialLinksData} />
 * ```
 *
 * @returns {JSX.Element} A container with animated social links and contact information
 */
"use client";

import { useMemo, useRef } from "react";
import { Mail, Phone } from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

import { GetAuthorSocialLinksQueryResult } from "@/sanity/types";
import { toSocialIcons } from "../../lib/socials";
import CornerLink from "../ui/CornerLink";

type ContactLinksProps = {
  socials: GetAuthorSocialLinksQueryResult;
};

const EMAIL = "sidmashav@icloud.com";
const PHONE = "+44 7766 932 154";

const ContactLinks = ({ socials }: ContactLinksProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const socialIcons = useMemo(() => toSocialIcons(socials, "8"), [socials]);
  useGSAP(
    () => {
      const links = gsap.utils.toArray<HTMLElement>(".contact-link");

      gsap.fromTo(
        links,
        { yPercent: 20, opacity: 0, display: "none" },
        {
          yPercent: 0,
          display: "inline-flex",
          opacity: 1,
          duration: 0.8,
          stagger: 0.3,
          //To let the title animations finish first
          delay: 2,
          ease: "linear",
        }
      );
    },
    { scope: containerRef }
  );
  return (
    <div ref={containerRef}>
      <div className="flex w-full md:justify-center">
        <CornerLink connectLinks={socialIcons} className="contact-link w-full" />
      </div>
      <div className="mt-4 flex flex-col items-start space-y-2 md:items-center">
        {/* Since mailto and tel not need prefetching, using <a> for mailto and Link for tel */}
        <a
          href={`mailto:${EMAIL}`}
          className="contact-link text-fg hover:-translate-y-0.5! transition-transform hover:scale-[1.02]! duration-300"
        >
          <Mail size={20} className="mr-2 inline-block" />
          {EMAIL}
        </a>
        <a
          href={`tel:${PHONE}`}
          className="contact-link text-fg hover:-translate-y-0.5! transition-transform hover:scale-[1.02]! duration-300"
        >
          <Phone size={20} className="mr-2 inline-block" />
          {PHONE}
        </a>
      </div>
    </div>
  );
};

export default ContactLinks;
