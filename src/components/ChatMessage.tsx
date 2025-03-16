
import React from "react";
import { ChatMessage as ChatMessageType } from "@/services/geminiService";
import { cn } from "@/lib/utils";
import { SystemMessage } from "./chat/SystemMessage";
import { MessageBubble } from "./chat/MessageBubble";
import { UserAvatar } from "./chat/UserAvatar";

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
        isSystem ? "my-8 flex justify-center animate-fade-in" : "flex",
        "animate-scale-in"
      )}
    >
      {isSystem ? (
        <SystemMessage message={message} />
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
              <UserAvatar isUser={isUser} />
            </div>
          )}
          
          <MessageBubble message={message} isUser={isUser} />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
