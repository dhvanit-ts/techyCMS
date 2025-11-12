"use client"

import { useParams } from "next/navigation";
import BlogPreview from "@/components/previews/BlogPreview";

export default function BlogPage() {
    const { slug } = useParams() as { slug?: string };
    return <BlogPreview slug={slug} />
}
