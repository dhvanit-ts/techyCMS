"use client"

import BlogForm from '@/components/forms/BlogForm'
import { Spinner } from '@/components/ui/spinner';
import { IBlog } from '@/types/IBlog';
import fetcher from '@/utils/fetcher';
import { redirect, useParams } from 'next/navigation';
import React, { useEffect } from 'react'

function EditBlog() {
  const [blog, setBlog] = React.useState<IBlog | null>(null);
  const [loading, setLoading] = React.useState(true);

  const { slug } = useParams() as { slug?: string };

  useEffect(() => {
    if (slug) {
      setLoading(true);
      const fetchBlog = async () => {
          const res = await fetcher.get<{ data: IBlog }>({
            endpointPath: `/blogs/${slug}`,
            statusShouldBe: 200,
            fallbackErrorMessage: "Error fetching blog page",
            finallyDoThis: () => { setLoading(false); }
          });
          setBlog(res.data);
      }
      fetchBlog();
    }
  }, [slug]);

  if (!slug) return redirect("/admin/blogs");
  if (loading) return <div className='flex justify-center items-center h-screen'><Spinner className='size-6' /></div>;
  if (!blog) return redirect("/admin/blogs");

  return (
    <BlogForm blog={blog} />
  )
}

export default EditBlog