"use client";

import { useState } from "react";
import { generateReactHelpers } from "@uploadthing/react";
import { OurFileRouter } from "@/lib/uploadthing";
import { ImagePlus, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const { useUploadThing } = generateReactHelpers<OurFileRouter>();

interface Props {
  value: string;
  onChange: (url: string) => void;
  name?: string;
}

export function ImageUploader({ value, onChange, name = "coverImageUrl" }: Props) {
  const [isDragging, setIsDragging] = useState(false);

  const { startUpload, isUploading } = useUploadThing("eventCoverImage", {
    onClientUploadComplete: (res) => {
      if (res?.[0]?.url) onChange(res[0].url);
    },
  });

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    startUpload([file]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className="space-y-2">
      {/* Hidden value for form submission */}
      <input type="hidden" name={name} value={value} />

      {value ? (
        /* Preview */
        <div className="relative rounded-xl overflow-hidden bg-stone-100 aspect-video w-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Cover" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-2 right-2 w-7 h-7 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        /* Drop zone */
        <label
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={cn(
            "flex flex-col items-center justify-center gap-3 w-full aspect-video rounded-xl border-2 border-dashed cursor-pointer transition-colors",
            isDragging
              ? "border-rose-700 bg-rose-50"
              : "border-stone-200 bg-stone-50 hover:border-stone-300 hover:bg-stone-100"
          )}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleInput}
            className="sr-only"
            disabled={isUploading}
          />
          {isUploading ? (
            <>
              <Loader2 className="w-8 h-8 text-rose-700 animate-spin" />
              <p className="text-sm text-zinc-500">Uploading...</p>
            </>
          ) : (
            <>
              <div className="w-12 h-12 rounded-xl bg-white border border-stone-200 flex items-center justify-center shadow-sm">
                <ImagePlus className="w-6 h-6 text-zinc-400" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-zinc-700">
                  Drop an image or <span className="text-rose-700">browse</span>
                </p>
                <p className="text-xs text-zinc-400 mt-0.5">PNG, JPG, WEBP up to 4MB</p>
              </div>
            </>
          )}
        </label>
      )}
    </div>
  );
}
