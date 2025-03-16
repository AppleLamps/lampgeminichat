
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Settings, Image, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { BlurContainer } from "@/components/ui/blur-container";
import { toast } from "sonner";

interface ChatInputProps {
  onSendMessage: (content: string, imageData?: string) => void;
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
  const [imageData, setImageData] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((message.trim() || imageData) && !isLoading) {
      onSendMessage(message, imageData || undefined);
      setMessage("");
      setImageData(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
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
    };
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setImageData(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
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
        gradient={isFocused ? "subtle" : "none"}
        hoverEffect
        className={cn(
          "p-3 transition-all duration-500 bg-background/70",
          isFocused 
            ? "shadow-lg border-primary/10 dark:border-primary/20" 
            : "border-white/10 dark:border-white/5",
          "animate-slide-up"
        )}
        containerClassName={cn(
          "shadow-md hover:shadow-xl dark:shadow-primary/5 hover:shadow-primary/10 dark:hover:shadow-primary/20",
          "transition-all duration-300 ease-in-out"
        )}
      >
        {imageData && (
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
              onClick={clearImage}
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Remove image</span>
            </Button>
          </div>
        )}
        
        <div className="flex gap-2 items-end max-w-4xl mx-auto">
          <div className="relative flex-1 group">
            {!isKeySet && (
              <div className="absolute inset-0 bg-background/80 rounded-md flex items-center justify-center z-10 animate-fade-in">
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
              placeholder={imageData ? "Describe what you want to do with this image..." : "Type a message or ask for an image..."}
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
          
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageUpload}
            className="hidden"
            id="image-upload"
            disabled={isLoading || !isKeySet}
          />
          
          <Button 
            type="button" 
            variant="outline"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading || !isKeySet}
            className={cn(
              "h-[56px] w-[56px] rounded-full transition-all duration-300 bg-muted/50 border-white/10 dark:border-white/5",
              "hover:bg-primary/10 hover:border-primary/20"
            )}
            title="Upload image"
          >
            <Image className="h-5 w-5" />
            <span className="sr-only">Upload image</span>
          </Button>
          
          <Button 
            type="submit" 
            disabled={(!message.trim() && !imageData) || isLoading || !isKeySet}
            className={cn(
              "h-[56px] w-[56px] rounded-full transition-all duration-300",
              (message.trim() || imageData) && !isLoading && isKeySet
                ? "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-md hover:shadow-lg transform-gpu hover:scale-105"
                : "bg-muted/80"
            )}
          >
            {isLoading ? (
              <div className="h-5 w-5 rounded-full border-2 border-t-transparent border-white animate-spin" />
            ) : (
              <Send className={cn(
                "h-5 w-5 transition-transform duration-300",
                (message.trim() || imageData) && !isLoading && isKeySet && "group-hover:translate-x-1"
              )} />
            )}
            <span className="sr-only">Send message</span>
          </Button>
        </div>
      </BlurContainer>
    </form>
  );
};

export default ChatInput;
