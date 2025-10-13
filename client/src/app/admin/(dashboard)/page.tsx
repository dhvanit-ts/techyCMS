"use client";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import useHandleAuthError from "@/hooks/useHandleAuthError";
import { IPage } from "@/types/IPage";
import fetcher from "@/utils/fetcher";
import { AxiosError } from "axios";
import Link from "next/link";
import { MdDelete, MdEdit } from "react-icons/md";
import { IoMdSettings } from "react-icons/io";
import { useCallback, useEffect, useState } from "react";
import TooltipWrapper from "@/components/TooltipWrapper";
import { cn } from "@/lib/utils";
import PageSettings from "@/components/PageSettings";

export default function Home() {
  const [pages, setPages] = useState<IPage[]>([]);
  const [loading, setLoading] = useState(true);

  const { handleAuthError } = useHandleAuthError();

  const fetchPages = useCallback(async () => {
    setLoading(true);
    try {
      const data = (await fetcher.get<{ data: IPage[] }>({
        endpointPath: "/pages",
        returnNullIfError: true,
        statusShouldBe: 200,
        fallbackErrorMessage: "Error fetching pages",
      })) as { data: IPage[] };

      setPages(data?.data ?? []);
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
    <div className="font-sans max-w-screen overflow-x-auto bg-zinc-200 text-zinc-900 min-h-screen">
      {/* Header */}
      <div className="h-12 flex items-center justify-center w-full bg-orange-600 text-zinc-300">
        <div className="flex justify-between items-center w-full max-w-7xl px-3">
          <Link
            href="/"
            className="text-xl font-semibold text-zinc-200 hover:cursor-pointer hover:text-zinc-100"
          >
            TechyCMS
          </Link>
          <Button variant="secondary" asChild>
            <Link href="/admin/auth/signin">Login</Link>
          </Button>
        </div>
      </div>

      {/* Pages Table */}
      <div className="px-4 pt-12">
        <h1 className="text-3xl font-semibold text-zinc-900 mb-4 flex justify-between">
          <span>Pages</span>
          <span className="text-zinc-800">Total: {pages.length}</span>
        </h1>

        {loading ? (
          <div className="flex justify-center items-center h-96">
            <Spinner className="size-6" />
          </div>
        ) : pages.length === 0 ? (
          <div className="text-zinc-700">No pages available.</div>
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
                {pages.map((page) => (
                  <tr
                    key={page.id}
                    className="border-b border-zinc-200 bg-zinc-100/80 hover:bg-zinc-100"
                  >
                    <td className="px-4 py-2">
                      <Link
                        href={`/pages/${page.slug}`}
                        className="text-blue-600 hover:underline"
                      >
                        {page.title}
                      </Link>
                    </td>
                    <td className="px-4 py-2 capitalize">
                      <span
                        className={cn(
                          "text-sm px-1.5 py-[0.5px] rounded-md",
                          page.status === "published"
                            ? "text-green-200 font-semibold bg-green-600"
                            : "text-red-200 font-semibold bg-yellow-600"
                        )}
                      >
                        {page.status}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      {new Date(page.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2">
                      {new Date(page.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2 flex items-center gap-2">
                      <TooltipWrapper delayDuration={500} tooltip="Edit Page">
                        <Button
                          variant="ghost"
                          className="hover:bg-zinc-200"
                          size="icon-sm"
                          asChild
                        >
                          <Link href={`/admin/pages/edit/${page.slug}`}>
                            <MdEdit />
                          </Link>
                        </Button>
                      </TooltipWrapper>
                      <TooltipWrapper
                        delayDuration={500}
                        tooltip="Page settings"
                      >
                        <PageSettings page={page} setPages={setPages}>
                          <Button
                            variant="ghost"
                            className="hover:bg-zinc-200 cursor-pointer group"
                            size="icon-sm"
                          >
                            <IoMdSettings className="group-hover:rotate-90 duration-700" />
                          </Button>
                        </PageSettings>
                      </TooltipWrapper>
                      <TooltipWrapper delayDuration={500} tooltip="Delete Page">
                        <Button variant="destructive" size="icon-sm" className="group" asChild>
                          <Link href={`/admin/pages/${page.slug}`}>
                            <MdDelete />
                          </Link>
                        </Button>
                      </TooltipWrapper>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
