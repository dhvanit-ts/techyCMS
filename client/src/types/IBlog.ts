import * as z from "zod";

const blogFormSchema = z.object({
  title: z
    .string()
    .min(3, "Minimum 3 characters")
    .max(50, "Maximum 50 characters"),
  slug: z.string(),
  content: z.json().optional(),
  featuredImage: z.any().optional(),
  status: z.enum(["draft", "published"]),
  seoTitle: z.string(),
  seoDescription: z.string(),
  metaImage: z.any().optional(),
});

type IBlog = z.infer<typeof blogFormSchema>;
export { blogFormSchema, type IBlog };