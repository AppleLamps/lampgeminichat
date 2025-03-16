
import React from "react";
import { BlurContainer } from "@/components/ui/blur-container";
import { ChatMessage as ChatMessageType } from "@/services/geminiService";
import { cn } from "@/lib/utils";

interface SystemMessageProps {
  message: ChatMessageType;
  className?: string;
}

export const SystemMessage: React.FC<SystemMessageProps> = ({ 
  message,
  className 
}) => {
  return (
    <BlurContainer
      intensity="light"
      gradient="subtle"
      hoverEffect
      className={cn(
        "text-center italic text-muted-foreground text-sm py-3 px-6 max-w-md",
        "bg-gradient-to-r from-slate-400/10 via-slate-300/10 to-slate-400/5",
        "dark:from-slate-800/20 dark:via-slate-700/15 dark:to-slate-800/10",
        "border-white/10 dark:border-white/5 animate-scale-in",
        className
      )}
    >
      <div className="text-center">{message.content}</div>
    </BlurContainer>
  );
};
