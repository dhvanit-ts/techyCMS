// app/projects/[slug]/page.tsx
import { fetchProject } from "@/utils/projectApis";
import { IPage } from "@/types/IPage";
import { notFound, redirect } from "next/navigation";

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
    <div>
      <div dangerouslySetInnerHTML={{ __html: project.html }} />
      {/* If you're absolutely sure CSS is safe */}
      <style dangerouslySetInnerHTML={{ __html: project.css }} />
    </div>
  );
}
