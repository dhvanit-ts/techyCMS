import React from "react";
import Editor from "@monaco-editor/react";

function CodeEditor({
  code,
  setCode,
  language = "html",
}: {
  code: string;
  setCode: (code: string) => void;
  language?: "html" | "css" | "javascript";
}) {
  return (
    <Editor
      height="400px"
      language={language}
      value={code}
      onChange={(value) => setCode(value || "")}
      options={{
        tabCompletion: "on",
        wordWrap: "on",
      }}
    />
  );
}

export default CodeEditor;
