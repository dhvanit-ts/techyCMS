"use client";

import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { FaNoteSticky } from "react-icons/fa6";
import { IPage } from "@/types/IPage";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import TooltipWrapper from "./TooltipWrapper";
import { IoInformationCircleSharp } from "react-icons/io5";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Spinner } from "./ui/spinner";
import { IoMdCloudUpload } from "react-icons/io";
import fetcher from "@/utils/fetcher";
import { toast } from "sonner";

const formSchema = z.object({
  title: z
    .string()
    .max(50, "Maximum 50 characters")
    .min(3, "Minimum 3 characters"),
  slug: z.string(),
  status: z.enum(["draft", "published"]),
});

function PageSettings({
  children,
  page,
  setPages,
}: {
  children: React.ReactNode;
  page: IPage;
  setPages: Dispatch<SetStateAction<IPage[]>>;
}) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { ...page },
  });

  const { setValue } = form;

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    fetcher.patch({
      endpointPath: `/pages/${page.id}/update`,
      data: values,
      fallbackErrorMessage: "Error saving page",
      statusShouldBe: 201,
      onSuccess: () => {
        setOpen(false);
        setPages((pages) =>
          pages.map((p) => (p.id === page.id ? { ...p, ...values } : p))
        );
        toast.success("Page updated successfully");
      },
      finallyDoThis: () => {
        setIsLoading(false);
      },
    });
  }

  const slugTransform = useCallback((value: string) => {
    if (value && typeof value === "string")
      return value
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

    return "";
  }, []);

  const title = useWatch({ control: form.control, name: "title" });

  useEffect(() => {
    setValue("slug", slugTransform(title || ""), { shouldValidate: true });
  }, [title, slugTransform, setValue]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{page.title}</SheetTitle>
          <SheetDescription>{page.slug}</SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 p-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="your page title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <span>Slug</span>
                    <TooltipWrapper tooltip="This is your auto generated slug based on your title">
                      <Button variant="ghost" size="icon-sm" className="size-5">
                        <IoInformationCircleSharp />
                      </Button>
                    </TooltipWrapper>
                  </FormLabel>
                  <FormControl>
                    <Input
                      readOnly
                      disabled
                      placeholder="your page slug"
                      onInput={(e) => {
                        setValue("slug", slugTransform(e.currentTarget.value), {
                          shouldValidate: true,
                        });
                      }}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a verified email to display" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="draft">
                        <FaNoteSticky className="fill-amber-500" />
                        <span>Draft</span>
                      </SelectItem>
                      <SelectItem value="published">
                        <IoMdCloudUpload className="fill-green-600" />
                        <span>Publish</span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">
              {isLoading && <Spinner />}
              <span>Submit</span>
            </Button>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}

/* <FormField
  control={form.control}
  name="status"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Status</FormLabel>
      <Select
        onValueChange={field.onChange}
        defaultValue={field.value}
      >
        <FormControl>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a verified email to display" />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          <SelectItem value="draft">
            <FaNoteSticky className="fill-amber-500" />
            <span>Draft</span>
          </SelectItem>
          <SelectItem value="published">
          <IoMdCloudUpload className="fill-green-600" />
            <span>Publish</span>
          </SelectItem>
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  )}
/> */

export default PageSettings;
