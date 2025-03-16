import React from 'react';
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { ChatHistory } from "@/hooks/useChatHistory";

interface ChatHistoryListProps {
  chats: ChatHistory[];
  currentChatId: string | null;
  onSelectChat: (id: string) => void;
  onDeleteChat: (id: string, e: React.MouseEvent) => void;
}

export const ChatHistoryList: React.FC<ChatHistoryListProps> = ({
  chats,
  currentChatId,
  onSelectChat,
  onDeleteChat
}) => {
  if (chats.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center">
        <p className="text-muted-foreground mb-2">No chat history found</p>
        <p className="text-xs text-muted-foreground/70">Your chats will appear here</p>
      </div>
    );
  }

  const formatDate = (date: Date) => {
    const now = new Date();
    const chatDate = new Date(date);
    
    // If it's today, show time
    if (chatDate.toDateString() === now.toDateString()) {
      return chatDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // If it's yesterday
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    if (chatDate.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    
    // If it's this year, show month and day
    if (chatDate.getFullYear() === now.getFullYear()) {
      return chatDate.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
    
    // Otherwise show month, day, year
    return chatDate.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="px-2 space-y-2 py-2">
      {chats.map((chat) => (
        <Collapsible key={chat.id} defaultOpen={false}>
          <Card 
            className={cn(
              "relative overflow-hidden transition-all duration-200 p-3 cursor-pointer hover:bg-accent hover:text-accent-foreground group",
              currentChatId === chat.id && "bg-accent/50"
            )}
          >
            <div onClick={() => onSelectChat(chat.id)} className="w-full pr-6">
              <div className="flex justify-between items-start">
                <h3 className="font-medium text-sm truncate">{chat.title}</h3>
                <span className="text-xs text-muted-foreground/70">
                  {formatDate(chat.timestamp)}
                </span>
              </div>
              <CollapsibleTrigger asChild>
                <p className="text-xs text-muted-foreground mt-1 truncate">{chat.preview}</p>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <p className="text-xs text-muted-foreground mt-2 line-clamp-3">
                  {chat.preview}
                </p>
              </CollapsibleContent>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-2.5 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              onClick={(e) => onDeleteChat(chat.id, e)}
            >
              <Trash2 className="h-4 w-4 text-muted-foreground/70" />
              <span className="sr-only">Delete chat</span>
            </Button>
          </Card>
        </Collapsible>
      ))}
    </div>
  );
};
