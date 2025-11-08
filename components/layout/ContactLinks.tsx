"use client";

import { GetAuthorSocialLinksQueryResult } from "@/sanity/types";
import { toSocialIcons } from "../../lib/socials";
import CornerLink from "../ui/CornerLink";
import Link from "next/link";
import { Mail, MailCheck, Phone } from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const ContactLinks = ({ socials }: { socials: GetAuthorSocialLinksQueryResult }) => {
  const socialIcons = toSocialIcons(socials, "8");
  useGSAP((context) => {
    const master = gsap.timeline({ defaults: { ease: "sine.out" } });
    const links = gsap.utils.toArray(".contact-link");
    master.fromTo(
      links,
      { yPercent: 20, opacity: 0 },
      {
        yPercent: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.3,
        ease: "linear",
      },
      ">2"
    );
  });
  return (
    <div>
      <div className="flex md:justify-center w-full">
        <CornerLink connectLinks={socialIcons} className="contact-link w-full" />
      </div>
      <div className="flex flex-col items-start md:items-center  space-y-2 mt-4">
        <Link
          href="mailto:yourname@example.com"
          className="text-fg hover:text-primary contact-link"
        >
          <Mail size={20} className="inline-block mr-2" />
          sidmashav@icloud.com
        </Link>
        <Link href="tel:+1234567890" className="text-fg hover:text-primary contact-link">
          <Phone size={20} className="inline-block mr-2" />
          +44 7766 932 154
        </Link>
      </div>
    </div>
  );
};

export default ContactLinks;
