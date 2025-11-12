import { IBlog } from "@/types/IBlog";
import fetcher from "@/utils/fetcher";

const fetchBlog = async (slug: string) => {
  try {
    const { data } = await fetcher.get<{ data: IBlog }>({
      endpointPath: `/blogs/${slug}`,
      fallbackErrorMessage: "Error fetching blog",
    });

    return data;
  } catch (err) {
    console.error("❌ Fetch failed:", err);
    return {
      seoDescription: "",
      seoTitle: "",
      html: "",
      css: "",
      title: "",
      slug: "",
      status: "draft",
      metadata: {},
    } as IBlog;
  }
};

const saveBlog = async ({
  slug,
  html,
  css,
  isEdit,
}: {
  slug: string;
  html: string;
  css: string;
  isEdit: boolean;
}) => {
  const payload = {
    title: "My Blog",
    slug,
    html,
    css,
    status: "published",
    metadata: {},
  };

  const fetchFn = isEdit ? fetcher.patch : fetcher.post;

  await fetchFn({
    endpointPath: `/pages${isEdit ? `/${slug}/update` : ""}`,
    data: payload,
    fallbackErrorMessage: "Error saving blog",
    statusShouldBe: 201,
  });
};

export { fetchBlog, saveBlog };
