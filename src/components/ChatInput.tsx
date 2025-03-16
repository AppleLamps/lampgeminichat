
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Settings, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { BlurContainer } from "@/components/ui/blur-container";

interface ChatInputProps {
  onSendMessage: (content: string) => void;
  isLoading: boolean;
  openSettings: () => void;
  isKeySet: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ 
  onSendMessage, 
  isLoading, 
  openSettings,
  isKeySet
}) => {
  const [message, setMessage] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message);
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, [message]);

  return (
    <form
      onSubmit={handleSubmit}
      className="sticky bottom-0 p-4 z-10"
    >
      <BlurContainer 
        intensity="medium"
        gradient={isFocused ? "prominent" : "subtle"}
        hoverEffect
        className={cn(
          "p-3 transition-all duration-500",
          isFocused 
            ? "bg-gradient-to-r from-background/70 via-background/90 to-background/70 shadow-lg border-primary/10 dark:border-primary/20" 
            : "bg-background/50 border-white/10 dark:border-white/5",
          "animate-slide-up"
        )}
        containerClassName={cn(
          "shadow-md hover:shadow-xl dark:shadow-primary/5 hover:shadow-primary/10 dark:hover:shadow-primary/20",
          "transition-all duration-300 ease-in-out",
          "before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-r before:from-primary/5 before:via-transparent before:to-primary/5 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500 before:rounded-2xl",
          "after:content-[''] after:absolute after:inset-0 after:bg-gradient-to-b after:from-white/5 after:to-transparent after:opacity-0 hover:after:opacity-100 after:transition-opacity after:duration-500 after:rounded-2xl"
        )}
      >
        <div className="flex gap-2 items-end max-w-4xl mx-auto">
          <div className="relative flex-1 group">
            {!isKeySet && (
              <div className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-md flex items-center justify-center z-10 animate-fade-in">
                <Button 
                  variant="outline" 
                  onClick={openSettings} 
                  className="gap-2 bg-gradient-to-r from-indigo-500/10 to-purple-600/10 hover:from-indigo-500/20 hover:to-purple-600/20 transition-all duration-300 shadow-md"
                >
                  <Settings className="h-4 w-4" />
                  Set API Key to Start
                </Button>
              </div>
            )}
            <Textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
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
          <Button 
            type="submit" 
            disabled={!message.trim() || isLoading || !isKeySet}
            className={cn(
              "h-[56px] w-[56px] rounded-full transition-all duration-300",
              message.trim() && !isLoading && isKeySet
                ? "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-md hover:shadow-lg transform-gpu hover:scale-105"
                : "bg-muted/80",
              "relative overflow-hidden"
            )}
          >
            {isLoading ? (
              <div className="h-5 w-5 rounded-full border-2 border-t-transparent border-white animate-spin" />
            ) : (
              <Send className={cn(
                "h-5 w-5 transition-transform duration-300",
                message.trim() && !isLoading && isKeySet && "group-hover:translate-x-1"
              )} />
            )}
            <span className="sr-only">Send message</span>
            {message.trim() && !isLoading && isKeySet && (
              <>
                <span className="absolute inset-0 bg-gradient-to-r from-indigo-600/0 via-white/10 to-indigo-600/0 opacity-0 hover:opacity-100 animate-[shine_3s_ease-in-out_infinite] pointer-events-none"></span>
                <span className="absolute inset-0 bg-gradient-to-tr from-indigo-500/0 via-white/5 to-purple-600/0 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></span>
              </>
            )}
          </Button>
        </div>
      </BlurContainer>
    </form>
  );
};

export default ChatInput;
