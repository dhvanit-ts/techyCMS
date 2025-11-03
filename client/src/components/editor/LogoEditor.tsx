/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { useState, useCallback } from "react";
import { Image, X, Download, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";

export default function LogoEditor() {
  const [image, setImage] = useState<string | ArrayBuffer | null>(null);
  const [zoom, setZoom] = useState([1]);
  const [border, setBorder] = useState(false);
  const [borderColor, setBorderColor] = useState("#000000");
  const [bgEnabled, setBgEnabled] = useState(false);
  const [bgColor, setBgColor] = useState("#ffffff");
  const [saving, setSaving] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result);
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result);
    reader.readAsDataURL(file);
  };

  const openFileDialog = () => {
    document.getElementById("file-input")?.click();
  };

  const handleSave = useCallback(async () => {
    if (!image) return;
    setSaving(true);

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = 400;
    canvas.width = size;
    canvas.height = size;

    const img = new window.Image();
    img.src = image as string;
    await img.decode();

    if (bgEnabled) {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, size, size);
    }

    ctx.drawImage(
      img,
      size * (1 - zoom[0]) / 2,
      size * (1 - zoom[0]) / 2,
      size * zoom[0],
      size * zoom[0]
    );

    if (border) {
      ctx.strokeStyle = borderColor;
      ctx.lineWidth = 10;
      ctx.strokeRect(0, 0, size, size);
    }

    const finalImage = canvas.toDataURL("image/png");

    const link = document.createElement("a");
    link.download = "logo.png";
    link.href = finalImage;
    link.click();

    setSaving(false);
  }, [image, zoom, border, borderColor, bgEnabled, bgColor]);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {!image ? (
        <div className="border border-dashed border-input rounded-lg">
          <div
            role="button"
            onClick={openFileDialog}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            data-dragging={isDragging || undefined}
            className="relative flex min-h-64 flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed border-zinc-400 p-4 transition-colors hover:bg-accent/50 data-[dragging=true]:bg-accent/50 cursor-pointer"
          >
            <input
              id="file-input"
              type="file"
              accept="image/*"
              onChange={onFileChange}
              className="sr-only"
              aria-label="Upload file"
            />
            <div className="flex flex-col items-center justify-center px-4 py-3 text-center">
              <div
                className="mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border bg-background"
                aria-hidden="true"
              >
                <Image className="size-4 opacity-60" />
              </div>
              <p className="mb-1.5 text-sm font-medium">
                Drop your logo here or click to browse
              </p>
              <p className="text-xs text-muted-foreground">
                PNG, JPG, or SVG files supported
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {/* Preview */}
          <div>
            <div className="border border-dashed border-zinc-400 rounded-xl">
              <div className="relative">
                <div className="relative flex min-h-64 flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed border-input p-4">
                  <div className="absolute inset-0">
                    <img
                      src={image as string}
                      alt="Logo preview"
                      className="size-full object-contain"
                      style={{
                        transform: `scale(${zoom[0]})`,
                        backgroundColor: bgEnabled ? bgColor : "transparent"
                      }}
                    />
                    {border && (
                      <div
                        className="absolute inset-0 pointer-events-none"
                        style={{ border: `10px solid ${borderColor}` }}
                      />
                    )}
                  </div>
                </div>
                <div className="absolute top-4 right-4">
                  <Button
                    size="icon"
                    variant="secondary"
                    className="size-8 rounded-full bg-black/60 text-white hover:bg-black/80"
                    onClick={() => setImage(null)}
                    aria-label="Remove logo"
                  >
                    <X className="size-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="zoom-slider">Zoom</Label>
              <Slider
                id="zoom-slider"
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onValueChange={setZoom}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground text-right">
                {zoom[0].toFixed(1)}x
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 h-8">
                  <Checkbox
                    id="border"
                    checked={border}
                    onCheckedChange={(checked) => setBorder(checked === true)}
                  />
                  <Label htmlFor="border" className="text-sm font-normal">
                    Border
                  </Label>
                </div>
                {border && (
                  <div className="relative group">
                    <div 
                      className="size-8 rounded-full border border-zinc-200 shadow-sm overflow-hidden cursor-pointer hover:scale-110 transition-transform duration-200"
                      style={{ backgroundColor: borderColor }}
                    >
                      <input
                        type="color"
                        value={borderColor}
                        onChange={(e) => setBorderColor(e.target.value)}
                        className="opacity-0 cursor-pointer w-full h-full"
                      />
                    </div>
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/80 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                      {borderColor.toUpperCase()}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 h-8">
                  <Checkbox
                    id="background"
                    checked={bgEnabled}
                    onCheckedChange={(checked) => setBgEnabled(checked === true)}
                  />
                  <Label htmlFor="background" className="text-sm font-normal">
                    Background
                  </Label>
                </div>
                {bgEnabled && (
                  <div className="relative group">
                    <div 
                      className="size-8 rounded-full border border-zinc-200 shadow-sm overflow-hidden cursor-pointer hover:scale-110 transition-transform duration-200"
                      style={{ backgroundColor: bgColor }}
                    >
                      <input
                        type="color"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="opacity-0 cursor-pointer w-full h-full"
                      />
                    </div>
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/80 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                      {bgColor.toUpperCase()}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <Button
                onClick={handleSave}
                disabled={saving}
                className="w-full"
              >
                {saving ? (
                  <>
                    <RefreshCw className="mr-2 size-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 size-4" />
                    Download Logo
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => setImage(null)}
                className="w-full"
              >
                Upload Different Image
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}