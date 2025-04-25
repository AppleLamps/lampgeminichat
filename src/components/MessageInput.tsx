
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
      {/* API key not set overlay */}
      {!isKeySet && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-md flex items-center justify-center z-10 animate-fade-in">
          <div className="gap-2 bg-gradient-to-r from-indigo-500/10 to-purple-600/10 py-2 px-4 rounded-md shadow-md border border-indigo-200/20 dark:border-indigo-500/20">
            Set API Key to Start
          </div>
        </div>
      )}

      {/* Subtle background for the textarea */}
      <div className={cn(
        "absolute inset-0 rounded-md transition-all duration-300",
        isFocused
          ? "bg-gradient-to-r from-background/80 to-background/60 shadow-inner"
          : "bg-background/40"
      )}></div>

      <Textarea
        ref={textareaRef}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={imageData
          ? "Describe what you want to do with this image..."
          : "Type a message or drop an image here..."
        }
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={cn(
          "resize-none py-3 min-h-[56px] max-h-[200px] overflow-y-auto border-0",
          "focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent",
          "placeholder:text-muted-foreground/50 transition-all duration-300",
          "shadow-sm focus:shadow-md",
          isLoading && "opacity-70",
          isFocused ? "pl-4" : "pl-3",
          "relative z-10"
        )}
        disabled={isLoading || !isKeySet}
      />

      {/* Character count */}
      <div
        className={cn(
          "absolute bottom-1 right-2 text-xs transition-all duration-300",
          "pointer-events-none flex items-center gap-1",
          message.length > 0 ? "opacity-100" : "opacity-0"
        )}
      >
        <div className={cn(
          "px-1.5 py-0.5 rounded-full transition-all duration-300",
          message.length > 500
            ? "bg-amber-500/10 text-amber-500"
            : message.length > 250
              ? "bg-amber-400/10 text-amber-400/70"
              : "bg-muted-foreground/10 text-muted-foreground/50"
        )}>
          {message.length}
        </div>
        <span className="text-muted-foreground/40">
          {message.length === 1 ? 'character' : 'characters'}
        </span>
      </div>

      {/* Placeholder text when focused but empty */}
      {isFocused && !message && !isLoading && (
        <div className="absolute bottom-2 right-2 text-xs text-muted-foreground/30 pointer-events-none animate-fade-in">
          Press Enter to send
        </div>
      )}
    </div>
  );
};

export default MessageInput;
