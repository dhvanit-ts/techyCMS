import { IPage } from "@/types/IPage";
import fetcher from "@/utils/fetcher";
import { validateCss } from "@/utils/validateCss";
import DOMPurify from "isomorphic-dompurify";

const fetchProject = async (slug: string) => {
  try {
    const { data } = await fetcher.get<{ data: IPage }>({
      endpointPath: `/pages/${slug}`,
      fallbackErrorMessage: "Error fetching project",
    });

    if (!validateCss(data.css)) {
      console.warn("Invalid CSS, resetting");
      data.css = "";
    }

    return {
      ...data,
      html: DOMPurify.sanitize(data.html, { USE_PROFILES: { html: true } }),
      css: DOMPurify.sanitize(data.css),
    };
  } catch (err) {
    console.error("❌ Fetch failed:", err);
    return {
      html: "",
      css: "",
      title: "",
      slug: "",
      status: "draft",
      metadata: {},
    } as IPage;
  }
};

const saveProject = async ({
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
    title: "My Project",
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
    fallbackErrorMessage: "Error saving project",
    statusShouldBe: 201,
  });
};

export { fetchProject, saveProject };
