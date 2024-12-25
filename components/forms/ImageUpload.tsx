'use client'

import { useState } from "react";
import { Button } from "../ui/button";
import { X } from "lucide-react";

interface ImageUploadProps {
  value?: string;
  onChange: (value: { file?: File; url?: string } | string) => void;
}

export function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(value);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);
    onChange({ file, url: localPreview });
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setPreviewUrl(undefined);
    onChange(""); // Just clear the value
  };

  return (
    <div className="flex flex-col gap-4">
      {previewUrl ? (
        <div className="relative w-40 h-40">
          <img
            src={previewUrl}
            alt="Upload"
            className="object-cover rounded-md w-full h-full"
          />
          <Button
            onClick={handleRemove}
            variant="destructive"
            size="icon"
            className="absolute -top-2 -right-2 h-6 w-6"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id="image-upload"
          />
          <label htmlFor="image-upload">
            <Button
              variant="outline"
              className="cursor-pointer"
              asChild
            >
              <span>Upload Image</span>
            </Button>
          </label>
        </div>
      )}
    </div>
  );
} 