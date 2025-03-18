
import React from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface ImagePreviewProps {
  imageData: string;
  onClear: () => void;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ imageData, onClear }) => {
  if (!imageData) return null;
  
  return (
    <div className="mb-3 relative rounded-md overflow-hidden border border-primary/20 max-w-xs mx-auto">
      <img 
        src={imageData} 
        alt="Uploaded image" 
        className="max-h-48 max-w-full object-contain mx-auto" 
      />
      <Button
        type="button"
        variant="destructive"
        size="icon"
        className="absolute top-1 right-1 h-6 w-6 rounded-full opacity-90 hover:opacity-100"
        onClick={onClear}
      >
        <X className="h-3 w-3" />
        <span className="sr-only">Remove image</span>
      </Button>
    </div>
  );
};

export default ImagePreview;
