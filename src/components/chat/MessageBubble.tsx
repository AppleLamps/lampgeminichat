
import React from "react";
import { cn } from "@/lib/utils";
import { BlurContainer } from "@/components/ui/blur-container";
import { MessageContent, containsCodeBlock } from "./MessageContent";
import { MessageImage } from "./MessageImage";
import { MessageTimestamp } from "./MessageTimestamp";
import { ChatMessage as ChatMessageType } from "@/services/geminiService";

interface MessageBubbleProps {
  message: ChatMessageType;
  isUser: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isUser }) => {
  const hasImage = Boolean(message.imageUrl);
  
  return (
    <div className={cn("min-w-[40px] max-w-full")}>
      <BlurContainer
        intensity={isUser ? "medium" : "light"}
        hoverEffect
        className={cn(
          "py-3 px-4 transition-all duration-300 shadow-md",
          isUser 
            ? "bg-gradient-to-br from-indigo-500/15 to-purple-600/10 border-indigo-200/30 hover:border-indigo-200/50" 
            : "bg-gradient-to-br from-primary/15 to-primary/10 border-primary/30 hover:border-primary/50",
          containsCodeBlock(message.content) ? "px-4 py-3" : ""
        )}
      >
        <MessageContent 
          content={message.content} 
          hasCodeBlocks={containsCodeBlock(message.content)} 
        />
        
        {hasImage && message.imageUrl && (
          <MessageImage imageUrl={message.imageUrl} />
        )}
        
        {message.timestamp && (
          <MessageTimestamp 
            timestamp={message.timestamp} 
            isUser={isUser} 
          />
        )}
      </BlurContainer>
    </div>
  );
};
