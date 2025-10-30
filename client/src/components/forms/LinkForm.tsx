"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ILink } from "@/types/ILink";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import fetcher from "@/utils/fetcher";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import useLinkStore from "@/store/linkStore";
import useHandleAuthError from "@/hooks/useHandleAuthError";
import { AxiosError } from "axios";
import { IPage } from "@/types/IPage";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";

const formSchemaWithoutChild = z.object({
  label: z.string().min(1, "Label is required"),
  href: z.string("Must be a valid URL").optional(),
  target: z.enum(["_self", "_blank", "_parent", "_top"]).optional(),
  rel: z.string().optional(),
  sectionId: z.string().min(1, "Section ID is required"),
  parentId: z.string().optional(),
  active: z.boolean().optional().refine((value) => value !== undefined, {
    message: "Active is required",
    path: ["active"],
  }),
});

const formSchema = formSchemaWithoutChild.extend({
  children: z.array(formSchemaWithoutChild).optional(),
});

interface ComponentSettingsProps {
  children: React.ReactNode;
  link?: ILink;
  setLinks: (links: ILink[]) => void;
}

function LinkForm({ children, link, setLinks }: ComponentSettingsProps) {
  const [open, setOpen] = useState(false);
  const [selectedPageId, setSelectedPageId] = useState<string>("");
  const [pages, setPages] = useState<IPage[]>([]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{link ? "Edit Link" : "New Link"}</SheetTitle>
          <SheetDescription>
            {link ? "Update this link’s settings" : "Create a new link"}
          </SheetDescription>
        </SheetHeader>
        <div className="p-4">
          <Label className="mb-2" htmlFor="select-page">Select a Page</Label>
          <Select onValueChange={setSelectedPageId} value={selectedPageId}>
            <SelectTrigger className="w-full" id="select-page">
              <SelectValue placeholder="Select a page" />
            </SelectTrigger>
            <SelectContent>
              {pages.map((page) => (
                <SelectItem key={page.id} value={page.id}>
                  {page.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <LinkFormHandler setLinks={setLinks} link={link} setOpen={setOpen} setPages={setPages} selectedPage={pages.find((page) => page.id === selectedPageId) ?? null} />
        </div>
      </SheetContent>
    </Sheet>
  );
}

const LinkFormHandler = ({ link, setLinks, setOpen, setPages, selectedPage }: Omit<ComponentSettingsProps, "children"> & { setOpen: React.Dispatch<React.SetStateAction<boolean>>, setPages: React.Dispatch<React.SetStateAction<IPage[]>>, selectedPage: IPage | null }) => {
  const [isLoading, setIsLoading] = useState(false);

  const links = useLinkStore((s) => s.links);

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: link
      ? (link as unknown as FormValues)
      : {
        label: "",
        href: "",
        target: "_self",
        rel: "noopener noreferrer",
        sectionId: "",
        parentId: "",
        active: true,
      },
  });

  useEffect(() => {
    if (selectedPage) {
      form.setValue("href", `http://localhost:5173/pages/${selectedPage.slug}`);
      form.setValue("label", selectedPage.title);
    }
  }, [form, selectedPage])

  const { handleAuthError } = useHandleAuthError();

  const fetchPages = useCallback(async () => {
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
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchPages();
  }, [fetchPages]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    const fetcherFn = link ? fetcher.patch : fetcher.post;
    const url = link ? `/links/${link.id}/update` : `/links`;

    const data = { ...values };

    fetcherFn({
      endpointPath: url,
      data,
      fallbackErrorMessage: "Error saving component",
      statusShouldBe: 201,
      onSuccess: () => {
        setOpen(false);

        const newLink: ILink = {
          id: link ? link.id : uuidv4(),
          label: values.label,
          href: values.href,
          target: values.target,
          rel: values.rel,
          sectionId: values.sectionId,
          parentId: values.parentId,
          active: values.active ?? true,
          children: values.children?.map((c) => ({
            id: uuidv4(),
            label: c.label,
            href: c.href,
            target: c.target,
            rel: c.rel,
            active: c.active ?? true,
            sectionId: c.sectionId,
            parentId: c.parentId,
            createdAt: new Date(),
            updatedAt: new Date(),
          })),
          createdAt: link ? link.createdAt : new Date(),
          updatedAt: new Date(),
        };

        const updatedLinks = link
          ? links.map((p) => (p.id === link.id ? newLink : p))
          : [...links, newLink];
        setLinks(updatedLinks);

        toast.success(`Component ${link ? "updated" : "created"} successfully`);
      },
      finallyDoThis: () => setIsLoading(false),
    });
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, (errors) =>
          console.log(errors)
        )}
        className="space-y-6 py-4"
      >
        {/* Label */}
        <FormField
          control={form.control}
          name="label"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Label</FormLabel>
              <FormControl>
                <Input placeholder="My awesome link" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Href */}
        <FormField
          control={form.control}
          name="href"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Target */}
        <FormField
          control={form.control}
          name="target"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Open Target</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select target" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="_self">Same Tab (_self)</SelectItem>
                    <SelectItem value="_blank">New Tab (_blank)</SelectItem>
                    <SelectItem value="_parent">
                      Parent Frame (_parent)
                    </SelectItem>
                    <SelectItem value="_top">Top Window (_top)</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* rel */}
        <FormField
          control={form.control}
          name="rel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rel Attribute</FormLabel>
              <FormControl>
                <Input placeholder="noopener noreferrer" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* parentId */}
        <FormField
          control={form.control}
          name="parentId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Parent Link</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select parent" />
                  </SelectTrigger>
                  <SelectContent>
                    {links.map((link) => (
                      <SelectItem key={link.id} value={link.id}>
                        {link.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* active */}
        <FormField
          control={form.control}
          name="active"
          defaultValue={true}
          render={({ field }) => (
            <FormItem className="flex gap-3">
              <FormLabel required htmlFor="active">Active</FormLabel>
              <FormControl>
                <Switch
                  id="active"
                  onCheckedChange={field.onChange}
                  checked={field.value}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* sectionId */}
        <FormField
          control={form.control}
          name="sectionId"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Section</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select section" />
                  </SelectTrigger>
                  <SelectContent>
                    {sections.map((section) => (
                      <SelectItem key={section.id} value={section.id}>
                        {section.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.formState.errors.parentId && (
          <p className="text-red-500">
            {form.formState.errors.parentId.message}
          </p>
        )}

        {form.formState.errors.href && (
          <p className="text-red-500">
            {form.formState.errors.href.message}
          </p>
        )}

        <Button type="submit" disabled={isLoading}>
          {isLoading && <Spinner />}
          {link
            ? isLoading
              ? "Updating..."
              : "Update"
            : isLoading
              ? "Creating..."
              : "Create"}
        </Button>
      </form>
    </Form>
  )
}

const sections = [
  {
    id: "dad30d28-a2b0-4052-a59b-45c56592f27b",
    label: "Header",
  },
  {
    id: "5edb327f-a0bc-4764-9362-5a414e91a4b6",
    label: "Footer",
  }
]

export default LinkForm;
