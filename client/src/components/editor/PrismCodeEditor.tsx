import React from "react";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs";
import "prismjs/components/prism-markup";
import "prismjs/components/prism-css";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism.css";
import { cn } from "@/lib/utils";

function CodeEditor({
  code,
  setCode,
  language = "html",
}: {
  code: string;
  setCode: (code: string) => void;
  language?: "html" | "css" | "javascript";
}) {
  const prismLanguage =
    language === "html"
      ? languages.markup
      : language === "css"
      ? languages.css
      : languages.js;
  return (
    <div>
      <Editor
        value={code}
        onValueChange={setCode}
        highlight={(code) => highlight(code || "", prismLanguage, language)}
        padding={10}
        preClassName="min-h-56"
        textareaClassName="min-h-56"
        placeholder="Inject your code here"
        style={{
          fontFamily: '"Fira code", "Fira Mono", monospace',
          fontSize: 12,
        }}
        className={cn("shadow-md rounded-lg border border-zinc-200 min-h-56")}
      />
    </div>
  );
}

export default CodeEditor;
