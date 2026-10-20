"use client";

import { ImagePlus, X } from "lucide-react";
import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { useObjectUrl } from "@/hooks/use-object-url";
import { cn } from "@/lib/utils";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE_MB = 5;

function formatFileSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function ImageDropField({
  label,
  caption,
  value,
  onChange,
}: {
  label: string;
  caption?: string;
  value: File | null;
  onChange: (file: File | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const previewUrl = useObjectUrl(value);

  function handleFiles(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError("Only JPG, PNG, or WEBP images are supported");
      return;
    }
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setError(`Image must be ${MAX_FILE_SIZE_MB}MB or smaller`);
      return;
    }

    setError(null);
    onChange(file);
  }

  function handleRemove() {
    setError(null);
    onChange(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium">{label}</span>

      {value && previewUrl ? (
        <div className="flex items-center gap-3 rounded-md border p-3">
          <img
            src={previewUrl}
            alt={value.name}
            className="size-16 shrink-0 rounded-md object-cover"
          />
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-sm font-medium">{value.name}</span>
            <span className="text-xs text-muted-foreground">{formatFileSize(value.size)}</span>
          </div>
          <Button type="button" variant="ghost" size="icon" onClick={handleRemove}>
            <X className="size-4" />
          </Button>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            setIsDragging(false);
            handleFiles(event.dataTransfer.files);
          }}
          className={cn(
            "flex cursor-pointer flex-col items-center gap-2 rounded-md border border-dashed p-6 text-center transition-colors",
            isDragging ? "border-primary bg-accent" : "border-muted-foreground/30 hover:bg-accent/50",
          )}
        >
          <ImagePlus className="size-6 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Drag and drop an image, or <span className="font-medium text-foreground">browse</span>
          </p>
          <p className="text-xs text-muted-foreground">
            JPG, PNG, or WEBP — up to {MAX_FILE_SIZE_MB}MB
          </p>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
        className="hidden"
        onChange={(event) => handleFiles(event.target.files)}
      />

      {error && <p className="text-sm text-destructive">{error}</p>}
      {caption && !error && <p className="text-xs text-muted-foreground">{caption}</p>}
    </div>
  );
}
