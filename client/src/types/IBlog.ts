import * as z from "zod";

const blogFormSchema = z.object({
  title: z
    .string()
    .min(3, "Minimum 3 characters")
    .max(50, "Maximum 50 characters"),
  slug: z.string(),
  content: z.union([z.string(), z.record(z.any(), z.any())]).optional(),
  featuredImage: z.any().optional(),
  status: z.enum(["draft", "published"]),
  seoTitle: z.string(),
  seoDescription: z.string(),
  metaImage: z.any().optional(),
});

type IBlog = z.infer<typeof blogFormSchema> & { id?: number; createdAt?: string; updatedAt?: string; };
export { blogFormSchema, type IBlog };