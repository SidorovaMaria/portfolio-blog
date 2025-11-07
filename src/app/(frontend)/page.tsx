import { sanityFetch } from "@/sanity/lib/live";
import { avatarQuery, featuredProjectsQuery } from "@/sanity/lib/queries";
import Link from "next/link";
import React from "react";
import SplitText from "../../../components/ui/SplitText";
import Marquee from "../../../components/ui/Marquee";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import Avatar from "../../../components/ui/Avatar";
import HorizontalScroll from "../../../components/layout/HorizontalScroll";
import FluidBuild from "../../../components/layout/FluidBuild";

const HomePage = async () => {
  const { data: author } = await sanityFetch({ query: avatarQuery });
  const { data: featuredProjects } = await sanityFetch({ query: featuredProjectsQuery });
  if (!author) {
    return <div>No author data found.</div>;
  }
  if (!featuredProjects) {
    return <div>No featured projects found.</div>;
  }
  return (
    <main className="space-y-12 my-12">
      <SplitText
        type="chars"
        text={author.shortIntro}
        className="text-center text-[min(10vw,80px)] max-w-[min(90vw,1024px)] mx-auto leading-snug max-sm:leading-tight cursor-default font-bold
        headline"
      />
      <SplitText
        type="words"
        delay={0.6}
        stagger={0.055}
        text={author.intro}
        className="text-center text-[min(5vw,32px])] max-w-[min(60vw,768px)] mx-auto  text-muted-foreground tracking-wide cursor-default
   "
      />
      <Marquee techStack={author.techStack} />
      <Avatar avatar={author.avatar} />
      <SplitText
        type="chars"
        text="Featured Projects"
        className="text-center text-[min(8vw,64px)] max-w-[min(80vw,768px)] mx-auto leading-snug max-sm:leading-tight cursor-default font-bold
        featured-headline "
      />
      <HorizontalScroll projects={featuredProjects} />
      <FluidBuild build={author.build} />
    </main>
  );
};

export default HomePage;
