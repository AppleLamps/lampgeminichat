
import React from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Bot } from "lucide-react";

interface UserAvatarProps {
  isUser: boolean;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({ isUser }) => {
  return (
    <Avatar 
      className={cn(
        "h-8 w-8 ring-2 transition-all duration-300 shadow-md",
        isUser 
          ? "bg-gradient-to-br from-indigo-500 to-purple-600 ring-indigo-500/20 hover:ring-indigo-500/40" 
          : "bg-gradient-to-br from-primary to-primary/70 ring-primary/20 hover:ring-primary/40"
      )}
    >
      {!isUser && (
        <AvatarImage 
          src="/lovable-uploads/d03f6a93-56ad-44c9-9425-21d55cef2fdf.png"
          alt="AI Avatar"
          className="h-full w-full object-cover"
        />
      )}
      <AvatarFallback className="text-white">
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </AvatarFallback>
    </Avatar>
  );
};
