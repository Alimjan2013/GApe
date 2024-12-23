'use client'
// import Image from "next/image";
import { useState } from "react";
import { Button } from "../ui/button";
import { X } from "lucide-react";
import { createClient } from '@/utils/supabase/client';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onRemove: () => void;
}

export function ImageUpload({ value, onChange, onRemove }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const supabase = createClient();

  const handleUpload = async (file: File) => {
    const fileExt = file.name.split('.').pop() || '';
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `block_user_assets/${fileName}`;

    const { data, error } = await supabase.storage
      .from("GApe_public")
      .upload(filePath, file);

    if (error) {
      console.error('Error:', error);
      return;
    }

    const { data: publicData } = supabase.storage
      .from('GApe_public')
      .getPublicUrl(filePath);
    
    onChange(publicData.publicUrl);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      await handleUpload(file);
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (value) {
      try {
        // Extract the full path after 'GApe_public/'
        const fullPath = value.split('GApe_public/')[1];
        if (fullPath) {
          console.log('Attempting to delete:', fullPath);
          
          const { data, error } = await supabase.storage
            .from('GApe_public')
            .remove([fullPath]);

          if (error) {
            console.error('Error deleting file:', error);
            return;
          }
          
          console.log('File deleted successfully:', data);
          onChange("");
          onRemove();
        } else {
          console.error('Invalid file path:', value);
        }
      } catch (error) {
        console.error('Delete operation failed:', error);
      }
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {value ? (
        <div className="relative w-40 h-40">
          <img
            src={value}
            alt="Upload"
            className="object-cover rounded-md"
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
            disabled={isUploading}
            className="hidden"
            id="image-upload"
          />
          <label htmlFor="image-upload">
            <Button
              variant="outline"
              className="cursor-pointer"
              disabled={isUploading}
              asChild
            >
              <span>{isUploading ? "Uploading..." : "Upload Image"}</span>
            </Button>
          </label>
        </div>
      )}
    </div>
  );
} 