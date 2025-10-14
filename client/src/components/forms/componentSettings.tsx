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
import { IComponent } from "@/types/IComponent";
import { FiMaximize2, FiMinimize2 } from "react-icons/fi";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Spinner } from "../ui/spinner";
import { v4 as uuidv4 } from "uuid";
import fetcher from "@/utils/fetcher";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import CodeEditor from "../editor/PrismCodeEditor";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

const formSchema = z.object({
  name: z
    .string()
    .min(3, "Minimum 3 characters")
    .max(50, "Maximum 50 characters"),
  category: z.string(),
  html: z.string(),
  css: z.string(),
});

type FormType = UseFormReturn<
  {
    name: string;
    category: string;
    html: string;
    css: string;
  },
  unknown,
  {
    name: string;
    category: string;
    html: string;
    css: string;
  }
>;

interface ComponentSettingsProps {
  children: React.ReactNode;
  component?: IComponent;
  setComponents: Dispatch<SetStateAction<IComponent[]>>;
}

function ComponentSettings({
  children,
  component,
  setComponents,
}: ComponentSettingsProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { ...component },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    const fetcherFn = component ? fetcher.patch : fetcher.post;
    const url = component
      ? `/components/${component.id}/update`
      : `/components`;

    const data = component
      ? { ...values }
      : {
          ...values,
          html: values.html || "<h1>Hello world 👋</h1>",
          css: values.css || "*{margin:0;padding:0;}",
        };

    fetcherFn({
      endpointPath: url,
      data,
      fallbackErrorMessage: "Error saving page",
      statusShouldBe: 201,
      onSuccess: () => {
        setOpen(false);

        const newPage: IComponent = component
          ? { ...(component as IComponent), ...values }
          : {
              id: uuidv4(),
              name: values.name,
              category: "default",
              html: "<h1>Hello world 👋</h1>",
              css: "*{margin:0;padding:0;}",
              createdAt: new Date(),
              updatedAt: new Date(),
            };

        setComponents((prev) => {
          if (component) {
            return prev.map((p) => (p.id === component.id ? newPage : p));
          } else {
            return [...prev, newPage];
          }
        });

        toast.success(`Page ${component ? "updated" : "created"} successfully`);
      },
      finallyDoThis: () => setIsLoading(false),
    });
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{component ? component.name : "New Component"}</SheetTitle>
          <SheetDescription>
            {component ? component.category : "Create a new component"}
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 p-4"
          >
            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Component name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Category */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UI">UI</SelectItem>
                        <SelectItem value="Form">Form</SelectItem>
                        <SelectItem value="Layout">Layout</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <CodeTabs form={form} />

            <Button type="submit">
              {isLoading && <Spinner />}
              {component
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

const CodeTabs = ({ form }: { form: FormType }) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const tabs = ["html", "css"];
  type Name = "name" | "category" | "html" | "css";

  const TabsContentList = () =>
    tabs.map((lang) => (
      <TabsContent value={lang} key={lang}>
        <FormField
          control={form.control}
          name={lang as Name}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="sr-only">{lang.toUpperCase()}</FormLabel>
              <FormControl>
                <CodeEditor code={field.value} setCode={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </TabsContent>
    ));

  const MainTabs = () => (
    <Tabs defaultValue="html" className="w-full">
      <div className="flex justify-between items-center">
        <TabsList>
          {tabs.map((lang) => (
            <TabsTrigger value={lang} key={lang}>
              {lang.toUpperCase()}
            </TabsTrigger>
          ))}
        </TabsList>
        <Button
          onClick={() => setDialogOpen(!dialogOpen)}
          type="button"
          variant="secondary"
          size="icon"
        >
          {dialogOpen ? <FiMinimize2 /> : <FiMaximize2 />}
        </Button>
      </div>
      <TabsContentList />
    </Tabs>
  );

  return (
    <>
      <MainTabs />
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Code Editor</DialogTitle>
          </DialogHeader>
          <MainTabs />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ComponentSettings;
