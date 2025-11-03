// app/projects/[slug]/page.tsx
import { fetchProject } from "@/utils/projectApis";
import { IPage } from "@/types/IPage";
import { notFound, redirect } from "next/navigation";
import PublicHeader from "@/components/pages/PublicHeader";
import PublicFooter from "@/components/pages/PublicFooter";

interface PageProps {
  params: { slug: string };
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;

  if (!slug) redirect("/");

  let project: IPage | null = null;

  try {
    project = await fetchProject(slug);
  } catch (err) {
    console.error("Error fetching project:", err);
  }

  if (!project) notFound();

  return (
    <>
      <PublicHeader />
      <div>
        <div dangerouslySetInnerHTML={{ __html: project.html }} />
        <style dangerouslySetInnerHTML={{ __html: project.css }} />
      </div>
      <PublicFooter />
    </>
  );
}
