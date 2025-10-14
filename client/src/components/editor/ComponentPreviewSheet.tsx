import React, { useMemo, useRef, useState } from "react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  ResizablePanel,
  ResizablePanelGroup,
  ResizableHandle,
} from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { IoMdEye } from "react-icons/io";
import { IComponent } from "@/types/IComponent";

export function ComponentPreviewSheet({ component }: { component: IComponent }) {
  // iframe src once
  const iframeSrc = useMemo(
    () =>
      URL.createObjectURL(
        new Blob(
          [
            `<!DOCTYPE html>
            <html>
              <head>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <style>html,body{margin:0;padding:0} ${component.css}</style>
              </head>
              <body>${component.html}</body>
            </html>`,
          ],
          { type: "text/html" }
        )
      ),
    [component.html, component.css]
  );

  const [previewWidth, setPreviewWidth] = useState<number | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const handleResize = (newSize: number) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setPreviewWidth(Math.round(newSize));
    }, 50); // 50ms debounce
  };

  return (
    <Sheet>
      <SheetTrigger>
        <Button variant="ghost" className="hover:bg-zinc-200 group" size="icon-sm">
          <IoMdEye />
        </Button>
      </SheetTrigger>

      <SheetContent className="space-y-4 sm:max-w-[1300px]">
        <SheetHeader>
          <SheetTitle>{component.name}</SheetTitle>
          <SheetDescription>
            Drag the handle to resize the preview box horizontally.
          </SheetDescription>
        </SheetHeader>

        <div className="flex justify-center w-full">
          <ResizablePanelGroup
            direction="horizontal"
            className="max-w-[1200px] w-full rounded-lg border bg-white shadow-sm"
          >
            <ResizablePanel
              defaultSize={70}
              minSize={20}
              onResize={handleResize}
              className="flex items-start justify-center p-4"
            >
              <div className="w-full flex flex-col items-center gap-2">
                <div className="self-end text-sm font-medium text-zinc-600 select-none">
                  {previewWidth ? `Width: ${previewWidth}px` : "Width: —"}
                </div>

                <div className="w-full border rounded overflow-hidden bg-white" style={{ height: 600 }}>
                  <iframe src={iframeSrc} title="Component Preview" className="w-full h-full border-0" />
                </div>
              </div>
            </ResizablePanel>

            <ResizableHandle withHandle />

            <ResizablePanel defaultSize={30} minSize={10} className="p-4">
              <div className="h-full overflow-auto">
                <h3 className="mb-2 font-semibold">Inspector / Notes</h3>
                <p className="text-sm text-zinc-600">
                  Breakpoint hints, props, or anything you want.
                </p>

                <div className="mt-4 space-y-2 text-sm">
                  <div>• Small: {"<"}640px</div>
                  <div>• Medium: 640px — 1024px</div>
                  <div>• Large: {">"}1024px</div>
                </div>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </SheetContent>
    </Sheet>
  );
}
