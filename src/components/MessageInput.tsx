
import React, { useRef, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface MessageInputProps {
  message: string;
  setMessage: (message: string) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  isLoading: boolean;
  isKeySet: boolean;
  isFocused: boolean;
  setIsFocused: (isFocused: boolean) => void;
  imageData: string | null;
}

const MessageInput: React.FC<MessageInputProps> = ({
  message,
  setMessage,
  handleKeyDown,
  isLoading,
  isKeySet,
  isFocused,
  setIsFocused,
  imageData
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, [message]);

  return (
    <div className="relative flex-1 group">
      {!isKeySet && (
        <div className="absolute inset-0 bg-background/80 rounded-md flex items-center justify-center z-10 animate-fade-in">
          <div className="gap-2 bg-gradient-to-r from-indigo-500/10 to-purple-600/10 py-2 px-4 rounded-md shadow-md">
            Set API Key to Start
          </div>
        </div>
      )}
      <Textarea
        ref={textareaRef}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={imageData ? "Describe what you want to do with this image..." : "Type a message or drop an image here..."}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={cn(
          "resize-none py-3 min-h-[56px] max-h-[200px] overflow-y-auto border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent placeholder:text-muted-foreground/50 transition-all",
          isLoading && "opacity-70",
          isFocused ? "pl-4" : "pl-3",
          "shadow-sm focus:shadow-md transition-shadow duration-300"
        )}
        disabled={isLoading || !isKeySet}
      />
      {message.length > 0 && (
        <div className="absolute bottom-1 right-2 text-xs text-muted-foreground/50 pointer-events-none">
          <span className={cn(
            "transition-all duration-300",
            message.length > 500 ? "text-amber-500" : message.length > 250 ? "text-amber-400/70" : "text-muted-foreground/50"
          )}>
            {message.length}
          </span> {message.length === 1 ? 'character' : 'characters'}
        </div>
      )}
    </div>
  );
};

export default MessageInput;
