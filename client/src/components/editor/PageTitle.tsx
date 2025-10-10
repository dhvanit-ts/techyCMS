"use client";

import { Editor } from "@grapesjs/studio-sdk-plugins/dist/types.js";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const PageTitle = ({ editor }: { editor: Editor }) => {
  const [pageName, setPageName] = useState<string>("Untitled Page");

  const { slug } = useParams();

  useEffect(() => {
    if (!editor) return;

    const page = editor.Pages.getSelected();
    if (page && slug && slug !== page.getName()) {
      page.set("name", slug as string, {
        silent: false,
      });
      setPageName(slug as string)
    }

    // Listen for page changes
    const onPageChange = (page: { getName: () => string }) => {
      setPageName(page.getName() || "Untitled Page");
    };

    editor.on("page:select", onPageChange);
    return () => {
      editor.off("page:select", onPageChange);
    };
  }, [editor, slug]);

  return (
    <div className="flex items-center gap-2 px-3">
      <h2
        className="text-sm font-medium text-gray-400"
      >
        {pageName}
      </h2>
    </div>
  );
};

export default PageTitle;
