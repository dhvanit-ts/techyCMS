"use client";

import ComponentSettings from "@/components/forms/componentSettings";
import TooltipWrapper from "@/components/TooltipWrapper";
import { Button } from "@/components/ui/button";
import useHandleAuthError from "@/hooks/useHandleAuthError";
import { cn } from "@/lib/utils";
import { IComponent } from "@/types/IComponent";
import fetcher from "@/utils/fetcher";
import { AxiosError } from "axios";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { IoMdSettings } from "react-icons/io";
import { MdDelete, MdEdit } from "react-icons/md";
import { ComponentPreviewSheet } from "@/components/editor/ComponentPreviewSheet";
import { Spinner } from "@/components/ui/spinner";
import DeleteComponent from "@/components/forms/DeleteComponent";

function ComponentsPage() {
  const [components, setComponents] = useState<IComponent[]>([]);
  const [loading, setLoading] = useState(true);

  const { handleAuthError } = useHandleAuthError();

  const fetchPages = useCallback(async () => {
    setLoading(true);
    try {
      const data = (await fetcher.get<{ data: IComponent[] }>({
        endpointPath: "/components",
        returnNullIfError: true,
        statusShouldBe: 200,
        fallbackErrorMessage: "Error fetching components",
      })) as { data: IComponent[] };

      setComponents(data?.data ?? []);
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
        <span>Components</span>
        <span className="text-zinc-800">Total: {components.length}</span>
        <ComponentSettings setComponents={setComponents}>
          <Button>
            <FaPlus />
            Create
          </Button>
        </ComponentSettings>
      </h1>
      {loading ? (
        <div className="flex justify-center items-center h-96">
          <Spinner className="size-6" />
        </div>
      ) : components.length === 0 ? (
        <div className="text-zinc-700">No components available.</div>
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
              {components.map((component) => (
                <tr
                  key={component.id}
                  className="border-b border-zinc-200 bg-zinc-100/80 hover:bg-zinc-100"
                >
                  <td className="px-4 py-2">
                    <span>{component.name}</span>
                  </td>
                  <td className="px-4 py-2 capitalize">
                    <span
                      className={cn("text-sm px-1.5 py-[0.5px] rounded-md")}
                    >
                      {component.category}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    {new Date(component.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2">
                    {new Date(component.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 flex items-center gap-2">
                    <TooltipWrapper delayDuration={500} tooltip="Preview Page">
                      <ComponentPreviewSheet component={component} />
                    </TooltipWrapper>
                    <TooltipWrapper delayDuration={500} tooltip="Edit Page">
                      <Button
                        variant="ghost"
                        className="hover:bg-zinc-200 group"
                        size="icon-sm"
                        asChild
                      >
                        <Link href={`/admin/pages/edit/${component.name}`}>
                          <MdEdit />
                        </Link>
                      </Button>
                    </TooltipWrapper>
                    <TooltipWrapper delayDuration={500} tooltip="Page settings">
                      <ComponentSettings
                        component={component}
                        setComponents={setComponents}
                      >
                        <Button
                          variant="ghost"
                          className="hover:bg-zinc-200 cursor-pointer group"
                          size="icon-sm"
                        >
                          <IoMdSettings className="group-hover:rotate-90 duration-700" />
                        </Button>
                      </ComponentSettings>
                    </TooltipWrapper>
                    <TooltipWrapper delayDuration={500} tooltip="Delete Page">
                      <DeleteComponent setComponents={setComponents} id={component.id} name={component.name}>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="group text-red-600 hover:bg-red-600 hover:text-zinc-100"
                        >
                          <MdDelete />
                        </Button>
                      </DeleteComponent>
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

export default ComponentsPage;
