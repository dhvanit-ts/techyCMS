"use client";

import { useParams, usePathname } from "next/navigation";
import StudioEditor from "@grapesjs/studio-sdk/react";
import type { Editor } from "grapesjs";
import { useEditorStorage } from "@/hooks/useEditorStorage";
import { editorOptions } from "@/components/editor/EditorConfig";
import "@grapesjs/studio-sdk/style";
import { fetchProject, saveProject } from "@/utils/projectApis";

const STORAGE_KEY = "DEMO_PROJECT_ID";

export default function EditorApp() {
  const pathname = usePathname();
  const slug = (useParams().slug as string) || null;
  const { load, save } = useEditorStorage(STORAGE_KEY);

  const onReady = async (editor: Editor) => {
    (window as unknown as { editor?: Editor }).editor = editor;
    if (!slug) return;
    const { html, css } = await fetchProject(slug);
    editor.setComponents(html || "<h1>New Project</h1>");
    if (css) editor.setStyle(css);
    await save(editor);

    // grapes-blocks.js (client-side in editor)
    editor.BlockManager.add("testimonial-block", {
      label: "Testimonial",
      category: "Basic",
      content: {
        type: "default",
        tagName: "div",
        attributes: { class: "gjs-component" },
        // This is the actual HTML that will be saved
        content: `<div class="gjs-component" data-component="Testimonial" data-props='${JSON.stringify(
          {
            author: "Ana",
            text: "Nice work!",
          }
        ).replace(/'/g, "&apos;")}'>
      <blockquote>Ana: Nice work!</blockquote>
    </div>`,
      },
    });
  };

  const onSave = async ({ editor }: { editor: Editor }) => {
    const html = editor.getHtml();
    const css = editor.getCss() || "";
    const isEdit = pathname.includes("edit");
    let newPageSlug: string = slug || "Untitled Page";

    if (!slug) {
      const active = editor.Pages.getSelected();
      if (active) newPageSlug = active.getName() || "Untitled Page";
    }

    await saveProject({ slug: newPageSlug, html, css, isEdit });
    await save(editor);
  };

  const onLoad = async () => {
    const project = await load();
    return {
      project: project || {
        pages: [{ name: "Home", component: "<h1>New Project</h1>" }],
      },
    };
  };

  return (
    <main className="flex h-screen flex-col">
      <div className="flex-1">
        <StudioEditor
          onReady={onReady}
          options={{
            ...editorOptions,
            storage: { type: "self", autosaveChanges: 5, onSave, onLoad },
            licenseKey: "YOUR_LICENSE_KEY",
            gjsOptions: { storageManager: true },
            theme: editorOptions.theme as "light" | "dark",
          }}
        />
      </div>
    </main>
  );
}
