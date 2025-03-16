
import React from "react";
import { CheckCheck } from "lucide-react";

interface MessageTimestampProps {
  timestamp: Date;
  isUser: boolean;
}

export const MessageTimestamp: React.FC<MessageTimestampProps> = ({ timestamp, isUser }) => {
  return (
    <div className="flex items-center justify-end mt-2 space-x-1">
      <div className="text-xs text-muted-foreground/70 text-right flex items-center">
        <span className="mr-1">
          {new Date(timestamp).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </span>
        {isUser && <CheckCheck className="h-3 w-3 text-indigo-500/70" />}
      </div>
    </div>
  );
};
