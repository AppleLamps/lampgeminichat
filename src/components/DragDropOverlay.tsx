
import React from "react";
import { Upload } from "lucide-react";

interface DragDropOverlayProps {
  isDragging: boolean;
}

const DragDropOverlay: React.FC<DragDropOverlayProps> = ({ isDragging }) => {
  if (!isDragging) return null;
  
  return (
    <div className="absolute inset-0 bg-primary/5 dark:bg-primary/10 rounded-lg backdrop-blur-sm flex items-center justify-center z-20 animate-fade-in">
      <div className="flex flex-col items-center gap-2 p-6 text-primary/70 dark:text-primary/80">
        <Upload className="h-8 w-8 animate-bounce duration-1000 opacity-80" />
        <p className="text-sm font-medium">Drop image here</p>
      </div>
    </div>
  );
};

export default DragDropOverlay;
