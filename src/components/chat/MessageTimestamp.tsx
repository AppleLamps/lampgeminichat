
import React from "react";
import { CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface MessageTimestampProps {
  timestamp: Date;
  isUser: boolean;
  className?: string;
}

export const MessageTimestamp: React.FC<MessageTimestampProps> = ({ 
  timestamp, 
  isUser,
  className 
}) => {
  // Format time to be more compact on mobile
  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };
  
  return (
    <div className={cn("flex items-center justify-end mt-2 space-x-1", className)}>
      <div className="text-xs text-muted-foreground/70 text-right flex items-center">
        <span className="mr-1">
          {formatTime(timestamp)}
        </span>
        {isUser && <CheckCheck className="h-3 w-3 text-indigo-500/70" />}
      </div>
    </div>
  );
};
