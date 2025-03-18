
import React from "react";
import { Button } from "@/components/ui/button";
import { Image } from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadImageButtonProps {
  onClick: () => void;
  disabled: boolean;
}

const UploadImageButton: React.FC<UploadImageButtonProps> = ({ 
  onClick, 
  disabled 
}) => {
  return (
    <Button 
      type="button" 
      variant="outline"
      size="icon"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "h-[56px] w-[56px] rounded-full transition-all duration-300 bg-muted/50 border-white/10 dark:border-white/5",
        "hover:bg-primary/10 hover:border-primary/20"
      )}
      title="Upload image"
    >
      <Image className="h-5 w-5" />
      <span className="sr-only">Upload image</span>
    </Button>
  );
};

export default UploadImageButton;
