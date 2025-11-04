/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { useState, useCallback, useRef, useEffect } from "react";
import { Image, X, Download, RefreshCw, Crop } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import ReactCrop, { Crop as CropType, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

function useDebounce<T>(value: T, delay: number = 200): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function LogoEditor({
  setLogo,
}: {
  setLogo: (logo: string) => void;
}) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [image, setImage] = useState<string | ArrayBuffer | null>(null);
  
  // Immediate states for UI feedback
  const [immediateZoom, setImmediateZoom] = useState([1]);
  const [immediateBorderWidth, setImmediateBorderWidth] = useState([10]);
  const [immediateBorderRadius, setImmediateBorderRadius] = useState([0]);
  const [immediateBorderColor, setImmediateBorderColor] = useState("#000000");
  const [immediateBgColor, setImmediateBgColor] = useState("#ffffff");
  
  // Debounced states for actual updates
  const zoom = useDebounce(immediateZoom);
  const borderWidth = useDebounce(immediateBorderWidth);
  const borderRadius = useDebounce(immediateBorderRadius);
  const borderColor = useDebounce(immediateBorderColor);
  const bgColor = useDebounce(immediateBgColor);
  
  const [border, setBorder] = useState(false);
  const [bgEnabled, setBgEnabled] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [crop, setCrop] = useState<CropType>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [isCropping, setIsCropping] = useState(false);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result);
    reader.readAsDataURL(file);
    handleSetImage(e);
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

  const handleSetImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result && typeof reader.result === "string") {
          setLogo(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = useCallback(async () => {
    if (!image || !imgRef.current) return;
    setSaving(true);

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = 400;
    canvas.width = size;
    canvas.height = size;

    // Apply background if enabled
    if (bgEnabled) {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, size, size);
    }

    // Save the current context state
    ctx.save();

    // Create a rounded rectangle path if border radius is set
    if (borderRadius[0] > 0) {
      const radius = (borderRadius[0] / 100) * size;
      ctx.beginPath();
      ctx.moveTo(radius, 0);
      ctx.lineTo(size - radius, 0);
      ctx.quadraticCurveTo(size, 0, size, radius);
      ctx.lineTo(size, size - radius);
      ctx.quadraticCurveTo(size, size, size - radius, size);
      ctx.lineTo(radius, size);
      ctx.quadraticCurveTo(0, size, 0, size - radius);
      ctx.lineTo(0, radius);
      ctx.quadraticCurveTo(0, 0, radius, 0);
      ctx.closePath();
      ctx.clip();
    }

    // Draw the image with crop if active
    if (completedCrop) {
      const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
      const scaleY = imgRef.current.naturalHeight / imgRef.current.height;
      
      ctx.drawImage(
        imgRef.current,
        completedCrop.x * scaleX,
        completedCrop.y * scaleY,
        completedCrop.width * scaleX,
        completedCrop.height * scaleY,
        0,
        0,
        size,
        size
      );
    } else {
      // Draw with zoom if no crop
      ctx.drawImage(
        imgRef.current,
        size * (1 - zoom[0]) / 2,
        size * (1 - zoom[0]) / 2,
        size * zoom[0],
        size * zoom[0]
      );
    }

    // Restore the context state
    ctx.restore();

    // Draw border if enabled
    if (border) {
      ctx.strokeStyle = borderColor;
      ctx.lineWidth = borderWidth[0];
      if (borderRadius[0] > 0) {
        const radius = (borderRadius[0] / 100) * size;
        ctx.beginPath();
        ctx.moveTo(radius, 0);
        ctx.lineTo(size - radius, 0);
        ctx.quadraticCurveTo(size, 0, size, radius);
        ctx.lineTo(size, size - radius);
        ctx.quadraticCurveTo(size, size, size - radius, size);
        ctx.lineTo(radius, size);
        ctx.quadraticCurveTo(0, size, 0, size - radius);
        ctx.lineTo(0, radius);
        ctx.quadraticCurveTo(0, 0, radius, 0);
        ctx.closePath();
        ctx.stroke();
      } else {
        ctx.strokeRect(0, 0, size, size);
      }
    }

    const finalImage = canvas.toDataURL("image/png");

    const link = document.createElement("a");
    link.download = "logo.png";
    link.href = finalImage;
    link.click();

    setSaving(false);
  }, [image, zoom, border, borderColor, borderWidth, bgEnabled, bgColor, borderRadius, completedCrop]);

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
                    {isCropping ? (
                      <ReactCrop
                        crop={crop}
                        onChange={(c) => setCrop(c)}
                        onComplete={(c) => setCompletedCrop(c)}
                        aspect={1}
                        className="size-full"
                      >
                        <img
                          ref={imgRef}
                          src={image as string}
                          alt="Logo preview"
                          className="size-full object-contain"
                          style={{
                            backgroundColor: bgEnabled ? immediateBgColor : "transparent"
                          }}
                        />
                      </ReactCrop>
                    ) : (
                      <div
                        className="size-full"
                        style={{
                          borderRadius: `${immediateBorderRadius[0]}%`
                        }}
                      >
                        <img
                          ref={imgRef}
                          src={image as string}
                          alt="Logo preview"
                          className="size-full object-contain"
                          style={{
                            transform: `scale(${immediateZoom[0]})`,
                            backgroundColor: bgEnabled ? immediateBgColor : "transparent",
                            borderRadius: `${immediateBorderRadius[0]}%`
                          }}
                        />
                        {border && (
                          <div
                            className="absolute inset-0 pointer-events-none"
                            style={{
                              border: `${immediateBorderWidth[0]}px solid ${immediateBorderColor}`,
                              borderRadius: `${immediateBorderRadius[0]}%`
                            }}
                          />
                        )}
                      </div>
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
                value={immediateZoom}
                onValueChange={setImmediateZoom}
                className="w-full"
                disabled={isCropping}
              />
              <p className="text-xs text-muted-foreground text-right">
                {immediateZoom[0].toFixed(1)}x
              </p>
            </div>

            <div className="space-y-3">
              <Label htmlFor="border-radius">Border Radius</Label>
              <Slider
                id="border-radius"
                min={0}
                max={50}
                step={1}
                value={immediateBorderRadius}
                onValueChange={setImmediateBorderRadius}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground text-right">
                {immediateBorderRadius[0]}%
              </p>
            </div>

            <div className="space-y-4">
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
                        style={{ backgroundColor: immediateBorderColor }}
                      >
                        <input
                          type="color"
                          value={immediateBorderColor}
                          onChange={(e) => setImmediateBorderColor(e.target.value)}
                          className="opacity-0 cursor-pointer w-full h-full"
                        />
                      </div>
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/80 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                        {immediateBorderColor.toUpperCase()}
                      </div>
                    </div>
                  )}
                </div>
                
                {border && (
                  <div className="space-y-2">
                    <Label htmlFor="border-thickness" className="text-sm font-normal">
                      Border Thickness
                    </Label>
                    <Slider
                      id="border-thickness"
                      min={1}
                      max={20}
                      step={1}
                      value={immediateBorderWidth}
                      onValueChange={setImmediateBorderWidth}
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground text-right">
                      {immediateBorderWidth[0]}px
                    </p>
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
                      style={{ backgroundColor: immediateBgColor }}
                    >
                      <input
                        type="color"
                        value={immediateBgColor}
                        onChange={(e) => setImmediateBgColor(e.target.value)}
                        className="opacity-0 cursor-pointer w-full h-full"
                      />
                    </div>
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/80 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                      {immediateBgColor.toUpperCase()}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsCropping(!isCropping);
                  if (isCropping && completedCrop) {
                    // When exiting crop mode, if there was a crop, apply it
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    if (!ctx || !imgRef.current) return;

                    const pixelRatio = window.devicePixelRatio;
                    const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
                    const scaleY = imgRef.current.naturalHeight / imgRef.current.height;

                    canvas.width = completedCrop.width * pixelRatio * scaleX;
                    canvas.height = completedCrop.height * pixelRatio * scaleY;

                    ctx.drawImage(
                      imgRef.current,
                      completedCrop.x * scaleX,
                      completedCrop.y * scaleY,
                      completedCrop.width * scaleX,
                      completedCrop.height * scaleY,
                      0,
                      0,
                      canvas.width,
                      canvas.height
                    );

                    // Convert the cropped canvas to data URL and set as new image
                    const croppedImage = canvas.toDataURL('image/png');
                    setImage(croppedImage);
                    setCrop(undefined);
                    setCompletedCrop(undefined);
                  }
                }}
                className="w-full"
              >
                <Crop className="mr-2 size-4" />
                {isCropping ? 'Apply Crop' : 'Crop Image'}
              </Button>
              
              <Button
                onClick={handleSave}
                disabled={saving || isCropping}
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
                onClick={() => {
                  setImage(null);
                  setCrop(undefined);
                  setCompletedCrop(undefined);
                  setIsCropping(false);
                }}
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