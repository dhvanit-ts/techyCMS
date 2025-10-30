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
  className,
}: {
  code: string;
  setCode?: (code: string) => void;
  language?: "html" | "css" | "javascript";
  className?: string;
}) {

  const prismLanguage =
    language === "html"
      ? languages.markup
      : language === "css"
      ? languages.css
      : languages.js;

  return (
    <div className={cn("border border-zinc-200 rounded-lg shadow-md max-h-[500px] overflow-auto", className)}>
      <Editor
        value={code}
        onValueChange={setCode || (() => {})}
        highlight={(code) => highlight(code || "", prismLanguage, language)}
        padding={10}
        style={{
          fontFamily: '"Fira Code", "Fira Mono", monospace',
          fontSize: 12,
          minHeight: 200,
        }}
        textareaClassName="w-full outline-none"
        preClassName="w-full m-0 o"
        placeholder="Inject your code here"
      />
    </div>
  );
}

export default CodeEditor;
