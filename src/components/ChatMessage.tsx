
import React from "react";
import { ChatMessage as ChatMessageType } from "@/services/geminiService";
import { cn } from "@/lib/utils";
import { User, Bot } from "lucide-react";
import { BlurContainer } from "@/components/ui/blur-container";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface ChatMessageProps {
  message: ChatMessageType;
  isSequential?: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ 
  message, 
  isSequential = false 
}) => {
  const isUser = message.role === "user";
  const isSystem = message.role === "system";
  
  return (
    <div
      className={cn(
        "w-full transition-all",
        isUser ? "justify-end" : "justify-start",
        isSequential ? "mt-2" : "mt-6",
        isSystem ? "my-8 flex justify-center animate-fade-in" : "flex"
      )}
    >
      {isSystem ? (
        <BlurContainer
          intensity="light"
          className="text-center italic text-muted-foreground text-sm py-3 px-6 max-w-md bg-gradient-to-r from-slate-400/5 to-slate-50/5 dark:from-slate-800/10 dark:to-slate-800/5 animate-scale-in"
        >
          <div className="text-center">{message.content}</div>
        </BlurContainer>
      ) : (
        <div 
          className={cn(
            "flex max-w-[85%] group",
            isUser ? "flex-row-reverse ml-auto" : "flex-row",
          )}
        >
          {!isSequential && (
            <div 
              className={cn(
                "flex self-end mb-1",
                isUser ? "ml-3" : "mr-3"
              )}
            >
              <Avatar 
                className={cn(
                  "h-8 w-8 ring-2 transition-all duration-300",
                  isUser 
                    ? "bg-gradient-to-br from-indigo-500 to-purple-600 ring-indigo-500/20" 
                    : "bg-gradient-to-br from-emerald-500 to-teal-600 ring-emerald-500/20"
                )}
              >
                <AvatarFallback className="text-white">
                  {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </AvatarFallback>
              </Avatar>
            </div>
          )}
          
          <div 
            className={cn(
              "min-w-[40px] max-w-full"
            )}
          >
            <BlurContainer
              intensity={isUser ? "medium" : "light"}
              className={cn(
                "py-3 px-4 transition-all duration-300",
                isUser 
                  ? "bg-gradient-to-br from-indigo-500/10 to-purple-600/5 border-indigo-200/20" 
                  : "bg-gradient-to-br from-emerald-500/10 to-teal-600/5 border-emerald-200/20"
              )}
            >
              <div className="whitespace-pre-wrap break-words">
                {message.content}
              </div>
              
              {message.timestamp && (
                <div className="text-xs text-muted-foreground/70 mt-2 text-right">
                  {new Date(message.timestamp).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              )}
            </BlurContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
