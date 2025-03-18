
import { useState, useRef } from "react";
import { toast } from "sonner";

export interface UseImageUploadResult {
  imageData: string | null;
  isDragging: boolean;
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  processImageFile: (file: File) => void;
  clearImage: () => void;
  handleDragEnter: (e: React.DragEvent) => void;
  handleDragOver: (e: React.DragEvent) => void;
  handleDragLeave: (e: React.DragEvent, containerRef: React.RefObject<HTMLElement>) => void;
  handleDrop: (e: React.DragEvent) => void;
  setIsDragging: (isDragging: boolean) => void;
}

export function useImageUpload(isLoading: boolean, isKeySet: boolean): UseImageUploadResult {
  const [imageData, setImageData] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processImageFile = (file: File) => {
    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image size should be less than 10MB");
      return;
    }
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      toast.error("Please upload an image file");
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
      setImageData(event.target?.result as string);
      toast.success("Image added successfully");
    };
    reader.readAsDataURL(file);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processImageFile(file);
  };

  const clearImage = () => {
    setImageData(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Drag and drop handlers
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isLoading || !isKeySet) return;
    setIsDragging(true);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isLoading || !isKeySet) return;
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = "copy";
    }
  };

  const handleDragLeave = (e: React.DragEvent, containerRef: React.RefObject<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Only set isDragging to false if we're leaving the dropzone and not entering a child element
    if (!containerRef.current?.contains(e.relatedTarget as Node)) {
      setIsDragging(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (isLoading || !isKeySet) return;
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0]; // Take only the first file
      processImageFile(file);
    }
  };

  return {
    imageData,
    isDragging,
    fileInputRef,
    handleImageUpload,
    processImageFile,
    clearImage,
    handleDragEnter,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    setIsDragging
  };
}
