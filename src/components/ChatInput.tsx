
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

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
      className="border-t bg-background/95 backdrop-blur sticky bottom-0 p-4"
    >
      <div className="flex gap-2 items-end max-w-3xl mx-auto">
        <div className="relative flex-1">
          {!isKeySet && (
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-md flex items-center justify-center z-10">
              <Button variant="outline" onClick={openSettings} className="gap-2">
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
            className={cn(
              "resize-none py-3 min-h-[56px] max-h-[200px] overflow-y-auto focus-visible:ring-primary/50",
              isLoading && "opacity-70"
            )}
            disabled={isLoading || !isKeySet}
          />
        </div>
        <Button 
          type="submit" 
          disabled={!message.trim() || isLoading || !isKeySet}
          className="h-[56px] w-[56px] rounded-full"
        >
          <Send className="h-5 w-5" />
          <span className="sr-only">Send message</span>
        </Button>
      </div>
    </form>
  );
};

export default ChatInput;
