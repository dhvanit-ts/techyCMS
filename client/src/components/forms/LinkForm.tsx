"use client";

import React, { Dispatch, SetStateAction, useState } from "react";
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

const formSchemaWithoutChild = z.object({
  label: z.string().min(1, "Label is required"),
  href: z.string("Must be a valid URL").optional(),
  target: z.enum(["_self", "_blank", "_parent", "_top"]).optional(),
  rel: z.string().optional(),
  sectionId: z.string().min(1, "Section ID is required"),
  parentId: z.string().optional(),
});

const formSchema = formSchemaWithoutChild.extend({
  children: z.array(formSchemaWithoutChild).optional(),
});

interface ComponentSettingsProps {
  children: React.ReactNode;
  link?: ILink;
  setLinks: Dispatch<SetStateAction<ILink[]>>;
}

function LinkForm({ children, link, setLinks }: ComponentSettingsProps) {
  const [open, setOpen] = useState(false);
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
          rel: "",
          sectionId: "",
          parentId: "",
        },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    const fetcherFn = link ? fetcher.patch : fetcher.post;
    const url = link ? `/components/${link.id}/update` : `/components`;

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
          children: values.children?.map((c) => ({
            id: uuidv4(),
            label: c.label,
            href: c.href,
            target: c.target,
            rel: c.rel,
            sectionId: c.sectionId,
            parentId: c.parentId,
            createdAt: new Date(),
            updatedAt: new Date(),
          })),
          createdAt: link ? link.createdAt : new Date(),
          updatedAt: new Date(),
        };

        setLinks((prev) =>
          link
            ? prev.map((p) => (p.id === link.id ? newLink : p))
            : [...prev, newLink]
        );

        toast.success(`Component ${link ? "updated" : "created"} successfully`);
      },
      finallyDoThis: () => setIsLoading(false),
    });
  };

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

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 p-4"
          >
            {/* Label */}
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
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
                  <FormLabel>URL</FormLabel>
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
                      <SelectTrigger>
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
                  <FormLabel>Parent ID (optional)</FormLabel>
                  <FormControl>
                    <Select {...field}>
                      <SelectTrigger>
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
      </SheetContent>
    </Sheet>
  );
}

export default LinkForm;
