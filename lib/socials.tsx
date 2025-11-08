import { GetAuthorSocialLinksQueryResult } from "@/sanity/types";
import { EnvelopeIcon, GithubIcon, LinkedinIcon } from "@sanity/icons";

export const toSocialIcons = (socialLinks: GetAuthorSocialLinksQueryResult, size: string = "6") => {
  const socialIcons = [
    {
      icon: <GithubIcon className={`size-${size}`} />,
      href: socialLinks?.socialLinks?.github ?? "/not-found",
    },
    {
      icon: <LinkedinIcon className={`size-${size}`} />,
      href: socialLinks?.socialLinks?.linkedin ?? "/not-found",
    },
    {
      icon: <EnvelopeIcon className={`size-${size}`} />,
      href: socialLinks?.socialLinks?.email ?? "/not-found",
    },
  ];
  return socialIcons;
};
