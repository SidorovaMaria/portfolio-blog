import React from "react";
import SplitText from "../../../../components/ui/SplitText";
import { sanityFetch } from "@/sanity/lib/live";
import { allProjectsQuery, getAllTechTagsQuery } from "@/sanity/lib/queries";
import ProjectsStack from "../../../../components/layout/ProjectsStack";
import ProjectFilter, { NoProjectFound } from "../../../../components/layout/ProjectFilter";

const ProjectsPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const { tag } = await searchParams;
  const tags = (Array.isArray(tag) ? tag.join(",") : tag ?? "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  const { data: projects } = await sanityFetch({
    query: allProjectsQuery,
    params: {
      tags,
    },
  });
  const { data: techStack } = await sanityFetch({
    query: getAllTechTagsQuery,
  });
  console.log(projects);

  return (
    <main className="space-y-12 my-12 mx-[4vw]">
      <SplitText
        type="chars"
        text={"My Projects"}
        className="text-[min(6vw,40px)]   leading-snug max-sm:leading-tight cursor-default font-bold
          uppercase "
      />

      <ProjectFilter techStack={techStack} />
      {projects.length > 0 ? (
        <ProjectsStack projects={projects} />
      ) : (
        <>
          <NoProjectFound />
        </>
      )}
    </main>
  );
};

export default ProjectsPage;
