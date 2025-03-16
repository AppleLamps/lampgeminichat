
import React from "react";
import { ChatMessage as ChatMessageType } from "@/services/geminiService";
import { cn } from "@/lib/utils";
import { User, Bot } from "lucide-react";
import { BlurContainer } from "@/components/ui/blur-container";

interface ChatMessageProps {
  message: ChatMessageType;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === "user";
  const isSystem = message.role === "system";
  
  return (
    <div
      className={cn(
        "flex w-full mb-4",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div 
        className={cn(
          "flex max-w-[80%] md:max-w-[70%]",
          isUser ? "flex-row-reverse" : "flex-row",
          isSystem ? "col-span-2 max-w-full justify-center" : ""
        )}
      >
        {!isSystem && (
          <div 
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full",
              isUser ? "bg-primary text-primary-foreground ml-2" : "bg-muted text-muted-foreground mr-2"
            )}
          >
            {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
          </div>
        )}
        
        <BlurContainer
          intensity={isSystem ? "light" : "medium"}
          className={cn(
            "py-2 px-3",
            isUser ? "bg-primary/10" : "bg-muted/10",
            isSystem ? "text-center italic text-muted-foreground text-sm" : ""
          )}
        >
          <div className="whitespace-pre-wrap break-words">
            {message.content}
          </div>
          
          {message.timestamp && (
            <div className="text-xs text-muted-foreground mt-1 text-right">
              {new Date(message.timestamp).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </div>
          )}
        </BlurContainer>
      </div>
    </div>
  );
};

export default ChatMessage;
