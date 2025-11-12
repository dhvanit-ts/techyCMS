"use client";

import TooltipWrapper from "@/components/TooltipWrapper";
import { Button } from "@/components/ui/button";
import useHandleAuthError from "@/hooks/useHandleAuthError";
import { cn } from "@/lib/utils";
import fetcher from "@/utils/fetcher";
import { AxiosError } from "axios";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { MdDelete, MdEdit } from "react-icons/md";
import { Spinner } from "@/components/ui/spinner";
import { IBlog } from "@/types/IBlog";
import BlogPreview from "@/components/previews/BlogPreview";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { IoMdEye } from "react-icons/io";
import { VisuallyHidden } from "radix-ui";
import DeleteBlog from "@/components/forms/DeleteBlog";

function BlogPage() {
  const [blogs, setBlogs] = useState<IBlog[]>([]);
  const [loading, setLoading] = useState(true);

  const { handleAuthError } = useHandleAuthError();

  const fetchPages = useCallback(async () => {
    setLoading(true);
    try {
      const data = (await fetcher.get<{ data: IBlog[] }>({
        endpointPath: "/blogs",
        returnNullIfError: true,
        statusShouldBe: 200,
        fallbackErrorMessage: "Error fetching blogs",
      })) as { data: IBlog[] };

      setBlogs(data?.data ?? []);
    } catch (error) {
      handleAuthError(error as AxiosError);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchPages();
  }, [fetchPages]);

  return (
    <div className="px-4 pt-12">
      <h1 className="text-3xl font-semibold text-zinc-900 mb-4 flex justify-between">
        <span>Blogs</span>
        <span className="text-zinc-800">Total: {blogs.length}</span>
        <Button asChild size="sm">
          <Link href="/admin/blogs/create">
            <FaPlus />
            Create
          </Link>
        </Button>
      </h1>
      {loading ? (
        <div className="flex justify-center items-center h-96">
          <Spinner className="size-6" />
        </div>
      ) : blogs.length === 0 ? (
        <div className="text-zinc-700">No blogs available.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-zinc-300 rounded-md overflow-hidden">
            <thead className="bg-zinc-300">
              <tr>
                <th className="text-left px-4 py-2">Title</th>
                <th className="text-left px-4 py-2">Status</th>
                <th className="text-left px-4 py-2">Created At</th>
                <th className="text-left px-4 py-2">Updated At</th>
                <th className="text-left px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((blog) => (
                <tr
                  key={blog.id}
                  className="border-b border-zinc-200 bg-zinc-100/80 hover:bg-zinc-100"
                >
                  <td className="px-4 py-2">
                    <span>{blog.title}</span>
                  </td>
                  <td className="px-4 py-2 capitalize">
                    <span
                      className={cn("text-sm px-1.5 py-[0.5px] rounded-md")}
                    >
                      {blog.status}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    {new Date(blog.createdAt ?? "").toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2">
                    {new Date(blog.updatedAt ?? "").toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 flex items-center gap-2">
                    <TooltipWrapper delayDuration={500} tooltip="Preview Blog">
                      <Sheet>
                        <SheetTrigger>
                          <Button variant="ghost" className="hover:bg-zinc-200 group" size="icon-sm">
                            <IoMdEye />
                          </Button>
                        </SheetTrigger>
                        <SheetContent className="space-y-4 sm:max-w-[1300px]">
                          <VisuallyHidden.Root>
                            <SheetHeader>
                              <SheetTitle>{blog.title}</SheetTitle>
                              <SheetDescription>
                                {`Preview of blog: ${blog.slug}`}
                              </SheetDescription>
                            </SheetHeader>
                          </VisuallyHidden.Root>
                          <BlogPreview slug={blog.slug} />
                        </SheetContent>
                      </Sheet>
                    </TooltipWrapper>
                    <TooltipWrapper delayDuration={500} tooltip="Edit Blog">
                      <Button
                        variant="ghost"
                        className="hover:bg-zinc-200 group"
                        size="icon-sm"
                        asChild
                      >
                        <Link href={`/admin/blogs/edit/${blog.slug}`}>
                          <MdEdit />
                        </Link>
                      </Button>
                    </TooltipWrapper>
                    <TooltipWrapper delayDuration={500} tooltip="Delete Blog">
                      <DeleteBlog setBlogs={setBlogs} slug={blog.slug}>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="group text-red-600 hover:bg-red-600 hover:text-zinc-100"
                        >
                          <MdDelete />
                        </Button>
                      </DeleteBlog>
                    </TooltipWrapper>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default BlogPage;
