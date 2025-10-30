"use client";

import { useParams, usePathname } from "next/navigation";
import StudioEditor from "@grapesjs/studio-sdk/react";
import type { Editor } from "grapesjs";
import { useEditorStorage } from "@/hooks/useEditorStorage";
import {
  customThemeConfig,
  defaultAssets,
  deviceConfig,
  globalStylesConfig,
  createLayoutConfig,
  pluginsConfig,
} from "@/components/editor/StudioUtils";
import "@grapesjs/studio-sdk/style";
import { fetchProject, saveProject } from "@/utils/projectApis";
import fetcher from "@/utils/fetcher";
import { IComponent } from "@/types/IComponent";
import { useState } from "react";
import { IPage } from "@/types/IPage";

const STORAGE_KEY = "DEMO_PROJECT_ID";

export default function EditorApp() {

  const [page, setPage] = useState<null | IPage>(null);

  const pathname = usePathname();
  const params = useParams();
  const slug = (params?.slug as string) ?? null;
  const { load, save } = useEditorStorage(STORAGE_KEY);

  const fetchComponents = async () => {
    try {
      const data = await fetcher.get<{ data: IComponent[] }>({
        endpointPath: "/components",
        fallbackErrorMessage: "Error fetching components",
      });

      return (data.data ?? []).map((component) => ({
        label: component.name,
        category: component.category,
        content: {
          type: "default",
          tagName: "div",
          attributes: { class: "gjs-component" },
          content: `<div>
        <style>${component.css}</style>
        <div>${component.html}</div>
        </div>`,
        },
      }));
    } catch (error) {
      console.log(error);
    }
  };

  const onReady = async (editor: Editor) => {
    (window as unknown as { editor?: Editor }).editor = editor;
    if (!slug) return;
    const page = await fetchProject(slug);
    editor.setComponents(page.html || "<h1>New Project</h1>");
    if (page.css) editor.setStyle(page.css);
    await save(editor);

    setPage(page);

    const components = await fetchComponents();
    components?.map((component) =>
      editor.BlockManager.add(component.label, component)
    );
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
        pages: [
          {
            name: page?.title,
            component: "<h1>Hello Studio SDK 👋</h1>",
          }],
      },
    };
  };

  const editorOptions = {
    theme: "dark",
    fonts: { enableFontManager: true },
    layout: createLayoutConfig(),
    globalStyles: globalStylesConfig,
    devices: deviceConfig,
    plugins: pluginsConfig,
    project: {
      default: {
        assets: defaultAssets,
        pages: [{ name: page?.title, component: "<h1>Hello Studio SDK 👋</h1>" }],
      },
    },
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
