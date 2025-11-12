"use client"

import FileUpload from '@/components/FileUpload';
import { SimpleEditor } from '@/components/tiptap-templates/simple/simple-editor'
import { Button } from '@/components/ui/button';
import { Field, FieldContent, FieldLabel } from '@/components/ui/field';
import { Form } from '@/components/ui/form'
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { blogFormSchema, IBlog } from '@/types/IBlog';
import fetcher from '@/utils/fetcher';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useCallback, useEffect, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form';
import { JSONContent } from "@tiptap/react"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import buildImageUrl, { normalizeImageUrl } from '@/utils/buildImageUrl';
import { useRouter } from 'next/navigation';

function BlogForm({ blog }: { blog?: IBlog }) {
    const [loading, setLoading] = useState(false);

    type FormValues = IBlog;
    const router = useRouter();

    const form = useForm<FormValues>({
        resolver: zodResolver(blogFormSchema),
        defaultValues: blog ? { ...blog, featuredImage: buildImageUrl("1762771971643-vip.8927dc8.svg"), content: typeof blog.content === "string" ? JSON.parse(blog.content) : blog.content } : undefined,
        mode: "onBlur",
    });

    const { setValue } = form;

    const onSubmit = async (data: IBlog) => {
        setLoading(true);

        const formData = new FormData();

        formData.append("title", data.title);
        formData.append("slug", data.slug);
        formData.append("status", data.status);
        formData.append("seoTitle", data.seoTitle);
        formData.append("seoDescription", data.seoDescription);
        formData.append("content", JSON.stringify(data.content));
        formData.append("metaImage", normalizeImageUrl(data.metaImage));
        formData.append("featuredImage", normalizeImageUrl(data.featuredImage));

        setLoading(true);
        const fetcherFn = blog ? fetcher.patch : fetcher.post;
        await fetcherFn({
            endpointPath: blog ? `/blogs/${blog.id}` : "/blogs",
            data: formData,
            statusShouldBe: blog ? 200 : 201,
            fallbackErrorMessage: blog ? "Error updating blog page" : "Error creating blog page",
            finallyDoThis: () => {
                setLoading(false);
                router.push(`/admin/blogs`);
            }
        })
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
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='flex flex-col xl:flex-row px-4 sm:px-0 justify-center my-12'
            >
                <div
                    className="space-y-8 sm:p-4 mx-auto xl:mx-0 max-w-3xl"
                >
                    <Field>
                        <FieldLabel htmlFor="title">Title</FieldLabel>
                        <FieldContent>
                            <Input id='title' placeholder="Title" {...form.register("title")} />
                        </FieldContent>
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="slug">Slug</FieldLabel>
                        <FieldContent>
                            <Input id='slug' readOnly placeholder='your slug will get generated and appeared here' {...form.register("slug")} />
                        </FieldContent>
                    </Field>
                    <div className='border border-zinc-400/50 rounded-xl sm:overflow-hidden'>
                        <SimpleEditor setContent={content => form.setValue("content", content)} content={form.watch("content") as JSONContent} />
                    </div>
                    <Field>
                        <FieldLabel htmlFor="seoTitle">SEO Title</FieldLabel>
                        <FieldContent>
                            <Input id='seoTitle' placeholder='SEO Title' {...form.register("seoTitle")} />
                        </FieldContent>
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="seoDescription">SEO Description</FieldLabel>
                        <FieldContent>
                            <Input id='seoDescription' placeholder='SEO Description' {...form.register("seoDescription")} />
                        </FieldContent>
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="seoDescription">Status</FieldLabel>
                        <FieldContent>
                            <Select value={form.watch("status")} onValueChange={v => setValue("status", v as "draft" | "published")}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a page" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="draft">Draft</SelectItem>
                                        <SelectItem value="published">Published</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </FieldContent>
                    </Field>
                </div>
                <div className="space-y-8 p-4 mx-auto xl:mx-0 max-w-3xl">
                    <div className='gap-8 flex xl:flex-col'>
                        <div className='space-y-2'>
                            <h3>Featured Image</h3>
                            <FileUpload
                                initialFiles={blog ? [
                                    {
                                        id: "featured-image",
                                        name: "featuredImage",
                                        size: 1540,
                                        type: "image/svg+xml",
                                        url: buildImageUrl(blog?.featuredImage),
                                    }
                                ] : []}
                                onFileChange={(file) => {
                                    setValue("featuredImage", file)
                                }}
                            />
                        </div>
                        <div className='space-y-2'>
                            <h3>Meta Image</h3>
                            <FileUpload
                                initialFiles={blog ? [
                                    {
                                        id: "meta-image",
                                        name: 'metaImage',
                                        size: 1540,
                                        type: "image/svg+xml",
                                        url: buildImageUrl(blog?.metaImage),
                                    },
                                ] : []}
                                onFileChange={(file) => {
                                    setValue("metaImage", file)
                                }}
                            />
                        </div>
                    </div>
                    <div className='space-y-2'>
                        <Button disabled={loading} type='submit'>
                            {loading ? <><Spinner /> {blog ? "Updating..." : "Saving..."}</> : (blog ? "Update" : "Save")}
                        </Button>
                    </div>
                </div>
                <p>
                    {form.formState.errors.root?.message}
                </p>
            </form>
        </Form>
    )
}

export default BlogForm