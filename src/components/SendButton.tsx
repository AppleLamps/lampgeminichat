
import React from "react";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";
import LoadingIndicator from "@/components/LoadingIndicator";

interface SendButtonProps {
  disabled: boolean;
  isLoading: boolean;
  isKeySet: boolean;
  hasContent: boolean;
}

const SendButton: React.FC<SendButtonProps> = ({ 
  disabled, 
  isLoading,
  isKeySet,
  hasContent
}) => {
  return (
    <Button 
      type="submit" 
      disabled={disabled}
      className={cn(
        "h-[56px] w-[56px] rounded-full transition-all duration-300",
        hasContent && !isLoading && isKeySet
          ? "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-md hover:shadow-lg transform-gpu hover:scale-105"
          : "bg-muted/80"
      )}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <div className="h-8 w-8 relative">
            <div className="absolute inset-0 rounded-full bg-white/10 animate-pulse-subtle"></div>
            <div className="absolute inset-[3px] rounded-full border-2 border-t-transparent border-white/70 animate-spin"></div>
          </div>
        </div>
      ) : (
        <Send className={cn(
          "h-5 w-5 transition-transform duration-300",
          hasContent && !isLoading && isKeySet && "group-hover:translate-x-1"
        )} />
      )}
      <span className="sr-only">Send message</span>
    </Button>
  );
};

export default SendButton;
