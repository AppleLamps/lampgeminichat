
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
        className={cn(
          "p-3 transition-all duration-300",
          isFocused ? "bg-gradient-to-r from-background/70 via-background/90 to-background/70 shadow-lg" : "bg-background/50"
        )}
      >
        <div className="flex gap-2 items-end max-w-4xl mx-auto">
          <div className="relative flex-1">
            {!isKeySet && (
              <div className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-md flex items-center justify-center z-10 animate-fade-in">
                <Button 
                  variant="outline" 
                  onClick={openSettings} 
                  className="gap-2 bg-gradient-to-r from-indigo-500/10 to-purple-600/10 hover:from-indigo-500/20 hover:to-purple-600/20 transition-all duration-300"
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
                "resize-none py-3 min-h-[56px] max-h-[200px] overflow-y-auto border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent placeholder:text-muted-foreground/50",
                isLoading && "opacity-70"
              )}
              disabled={isLoading || !isKeySet}
            />
          </div>
          <Button 
            type="submit" 
            disabled={!message.trim() || isLoading || !isKeySet}
            className={cn(
              "h-[56px] w-[56px] rounded-full transition-all duration-300",
              message.trim() && !isLoading && isKeySet
                ? "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-md hover:shadow-lg"
                : "bg-muted/80"
            )}
          >
            {isLoading ? (
              <div className="h-5 w-5 rounded-full border-2 border-t-transparent border-white animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
            <span className="sr-only">Send message</span>
          </Button>
        </div>
      </BlurContainer>
    </form>
  );
};

export default ChatInput;
