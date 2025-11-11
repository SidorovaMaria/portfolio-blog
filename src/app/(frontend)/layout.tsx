import type { Metadata } from "next";
import { sanityFetch, SanityLive } from "@/sanity/lib/live";
import NavBar from "../../../components/navigation/NavBar";
import { PageTransition } from "../../../components/navigation/PageTransition";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Footer from "../../../components/layout/Footer";
import { getAuthorSocialLinksQuery } from "@/sanity/lib/queries";
gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);
export const metadata: Metadata = {
  title: "Maria Sidorova | Frontend & Full-Stack Developer",
  description:
    "Portfolio of Maria Sidorova — Computer Science & Mathematics graduate and software engineer specializing in React, Next.js, TypeScript, Tailwind CSS, and creative UI/UX animations with GSAP and Framer Motion.",
  openGraph: {
    title: "Maria Sidorova | Frontend & Full-Stack Developer",
    description:
      "Explore Maria Sidorova’s developer portfolio — showcasing projects built with React, Next.js, TypeScript, Tailwind CSS, GSAP, and more.",
    url: "https://maria-sidorova-dev.vercel.app",
    siteName: "Maria Sidorova Portfolio",
    images: [
      {
        url: "/main-page.png",
        width: 1200,
        height: 630,
        alt: "Maria Sidorova Portfolio Preview",
      },
    ],
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Maria Sidorova | Frontend & Full-Stack Developer",
    description:
      "Portfolio of Maria Sidorova — showcasing modern web applications built with React, Next.js, TypeScript, Tailwind, GSAP, and more.",
    images: ["/og-image.jpg"],
  },
  metadataBase: new URL("https://maria-sidorova-dev.vercel.app"),
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { data: socials } = await sanityFetch({ query: getAuthorSocialLinksQuery });
  return (
    <>
      <NavBar />
      <PageTransition>{children}</PageTransition>
      <Footer socialLinks={socials} />
      <SanityLive />
    </>
  );
}
