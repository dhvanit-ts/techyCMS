"use client";

import { StudioCommands } from "@grapesjs/studio-sdk";
import { Editor } from "@grapesjs/studio-sdk-plugins/dist/types.js";
import { useEffect, useState } from "react";

const PageTitle = ({ editor }: { editor: Editor }) => {
  const [pageName, setPageName] = useState<string>("Untitled Page");
  const [isEditing, setEditing] = useState<boolean>(false);

  useEffect(() => {
    if (!editor) return;

    // Get initial page name
    const active = editor.Pages.getSelected();
    if (active) setPageName(active.getName() || "Untitled Page");

    // Listen for page changes
    const onPageChange = (page: unknown) => {
      if (typeof page === "object" && page !== null && "getName" in page) {
        setPageName(
          (page as { getName: () => string }).getName() || "Untitled Page"
        );
      }
    };

    editor.on("page:select", onPageChange);
    return () => {
      editor.off("page:select", onPageChange);
    };
  }, [editor]);

  return (
    <div className="flex items-center gap-2 px-3">
      {isEditing ? (
        <input
          type="text"
          className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={pageName}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              editor.runCommand(StudioCommands.setPageSettings, {
                title: pageName,
              });
              setEditing(false);
            }
          }}
          onChange={(e) => setPageName(e.target.value)}
        />
      ) : (
        <h2
          onClick={() => setEditing(true)}
          className="text-sm font-medium text-gray-700"
        >
          {pageName}
        </h2>
      )}
    </div>
  );
};

export default PageTitle;
