"use client";

import React from 'react'
import { IBlog } from "@/types/IBlog";
import { notFound, redirect } from "next/navigation";
import { fetchBlog } from "@/utils/blogApis";
import { renderToReactElement } from '@tiptap/static-renderer'
import { extensions } from "@/components/tiptap-templates/simple/extentions";
import { useCallback, useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import Image from 'next/image';
import buildImageUrl from '@/utils/buildImageUrl';

function BlogPreview({ slug }: { slug?: string }) {
    const [blog, setBlog] = useState<IBlog | null>(null)
    const [loading, setLoading] = useState(true);

    if (!slug) redirect("/");
    const fetchBlogHandler = useCallback(async () => {
        setLoading(true);
        try {
            const fetchedBlog = await fetchBlog(slug);
            setBlog(fetchedBlog);
        } catch (err) {
            console.error("Error fetching blog:", err);
        } finally {
            setLoading(false);
        }
    }, [slug])

    useEffect(() => {
        fetchBlogHandler();
    }, [fetchBlogHandler])

    if (loading) return <div className="flex justify-center items-center h-screen">
        <Spinner className="size-6" />
    </div>;

    if (!blog || !blog.content) notFound();

    let reactNode;
    if (blog.content) {
        const contentJSON = typeof blog.content === 'string'
            ? JSON.parse(blog.content)
            : blog.content;

        const extArray = Array.isArray(extensions)
            ? extensions
            : [...extensions];

        reactNode = renderToReactElement({
            extensions: extArray,
            content: contentJSON,
        });
    }

    return (
        <div className='p-4'>
            <h1 className="text-3xl font-bold">{blog.title}</h1>
            <Image src={buildImageUrl(blog.featuredImage)} alt={blog.title} height={500} width={500} />
            <div className="tiptap">
                {reactNode}
            </div>
        </div>
    )
}

export default BlogPreview