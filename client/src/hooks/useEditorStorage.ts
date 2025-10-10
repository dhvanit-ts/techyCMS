import type { Editor } from "grapesjs";

export const useEditorStorage = (storageKey: string) => {
  const load = async () => {
    const data = sessionStorage.getItem(storageKey);
    return data ? JSON.parse(data) : null;
  };

  const save = async (editor: Editor) => {
    const data = editor.getProjectData();
    sessionStorage.setItem(storageKey, JSON.stringify(data));
  };

  return { load, save };
};
