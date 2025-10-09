"use client";

import type { Editor } from "grapesjs";
import StudioEditor, {
  ProjectData,
  ProjectDataResult,
  WithEditorProps,
} from "@grapesjs/studio-sdk/react";
import "@grapesjs/studio-sdk/style";
import postcss from "postcss";

import {
  customThemeConfig,
  defaultAssets,
  deviceConfig,
  globalStylesConfig,
  layoutConfig,
  pluginsConfig,
} from "@/components/editor/studioUtils";
import "@grapesjs/studio-sdk/style";
import fetcher from "@/utils/fetcher";

const loadFromSessionStorage = async (projectId: string) => {
  const projectString = sessionStorage.getItem(projectId);
  return projectString ? JSON.parse(projectString) : null;
};

const saveToLocalStorage = async (editor: Editor, id) => {
  const projectData = editor.getProjectData();
  sessionStorage.setItem(id, JSON.stringify(projectData));
};

const fetchProjectFromDB = async () => {
  try {
    const data = (await fetcher.get<{ data: { html: string; css: string } }>({
      endpointPath: "/pages/my-website",
      fallbackErrorMessage: "Error fetching project",
    })) as { data: { html: string; css: string } };

    try {
      postcss.parse(data.data.css);
    } catch {
      console.log("Invalid CSS, resetting to empty string");
      return { html: "", css: "" };
    }

    return data.data;
  } catch (error) {
    console.log(error);
    return { html: "", css: "" };
  }
};

function App() {
  const onReady = async (editor: Editor) => {
    (window as unknown as { editor?: Editor }).editor = editor;

    const projectFromDB = (await fetchProjectFromDB()) as {
      html: string;
      css: string;
    };
    editor.setComponents(projectFromDB.html || "<h1>New Project</h1>");
    
    if (projectFromDB.css) {
      editor.setStyle(projectFromDB.css);
    }

    if (projectFromDB) saveToLocalStorage(editor, "DEMO_PROJECT_ID");
  };

  const onSave = async ({
    editor,
    project,
  }: {
    editor: Editor;
    project: ProjectData;
  }) => {
    const html = editor.getHtml();
    const css = editor.getCss();

    const js = editor.getJs ? editor.getJs() : "";

    const exportData = {
      projectId: "DEMO_PROJECT_ID",
      html,
      css,
      js,
      assets: project.assets || [],
      pages: project.pages,
      updatedAt: new Date().toISOString(),
    };

    console.log("Exporting project data:", exportData);

    try {
      saveToLocalStorage(editor, "DEMO_PROJECT_ID");

      const res = await fetch("/api/save-project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(exportData),
      });

      if (!res.ok) throw new Error(`Failed to save project: ${res.statusText}`);

      console.log("✅ Project successfully saved to backend!");
    } catch (err) {
      console.error("❌ Error saving project:", err);
    }
  };

  const onLoad: (
    props: WithEditorProps
  ) => Promise<ProjectDataResult> = async () => {
    const project = await loadFromSessionStorage("DEMO_PROJECT_ID");
    console.log("Project loaded", { project });

    // If the project doesn't exist (eg. first load), let's return a new one.
    return {
      project: project || {
        pages: [{ name: "Home", component: "<h1>New project</h1>" }],
      },
    };
  };

  return (
    <main className="flex h-screen flex-col justify-between gap-2">
      <div className="flex-1 w-full h-full overflow-hidden">
        <StudioEditor
          onReady={onReady}
          options={{
            fonts: {
              enableFontManager: true,
            },
            storage: {
              type: "self",
              autosaveChanges: 5,
              onSave,
              onLoad,
            },
            licenseKey: "YOUR_LICENSE_KEY",
            gjsOptions: {
              storageManager: true,
            },
            theme: "dark",
            // customTheme: customThemeConfig,
            layout: layoutConfig,
            globalStyles: globalStylesConfig,
            devices: deviceConfig,
            plugins: pluginsConfig,
            project: {
              default: {
                assets: defaultAssets,
                pages: [
                  {
                    name: "Home",
                    component: `<h1 style="padding: 2rem; text-align: center; font-family: system-ui">
                      Hello Studio SDK 👋
                    </h1>`,
                  },
                ],
              },
            },
          }}
        />
      </div>
    </main>
  );
}

export default App;
