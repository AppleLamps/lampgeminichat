
import React, { useState, useEffect } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Sidebar, 
  SidebarHeader, 
  SidebarContent, 
  SidebarFooter,
  SidebarSeparator,
  SidebarInput
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { MessageSquarePlus, Search, X } from "lucide-react";
import { ChatHistoryList } from "./ChatHistoryList";
import { useSidebarState } from "@/hooks/useSidebarState";
import { useChatHistory, ChatHistory } from "@/hooks/useChatHistory";

interface ChatSidebarProps {
  onSelectChat: (chatId: string) => void;
  onNewChat: () => void;
  currentMessages: any[];
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({ 
  onSelectChat, 
  onNewChat,
  currentMessages
}) => {
  const { isOpen } = useSidebarState();
  const { 
    chatHistory, 
    currentChatId, 
    searchChats, 
    deleteChat 
  } = useChatHistory();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredChats, setFilteredChats] = useState<ChatHistory[]>(chatHistory);
  
  // Update filtered chats when search query or chat history changes
  useEffect(() => {
    setFilteredChats(searchQuery ? searchChats(searchQuery) : chatHistory);
  }, [searchQuery, chatHistory, searchChats]);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const clearSearch = () => {
    setSearchQuery("");
  };
  
  const handleSelectChat = (id: string) => {
    onSelectChat(id);
  };
  
  const handleDeleteChat = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteChat(id);
  };
  
  const handleNewChat = () => {
    onNewChat();
    clearSearch();
  };

  return (
    <Sidebar 
      data-sidebar="chat-sidebar" 
      className="border-r border-border/50"
      collapsible={isOpen ? "none" : "offcanvas"}
    >
      <SidebarHeader>
        <div className="flex items-center justify-between px-2 py-2">
          <h2 className="text-lg font-semibold text-primary">Chat History</h2>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleNewChat}
            className="h-8 w-8 rounded-full"
            title="New Chat"
          >
            <MessageSquarePlus className="h-5 w-5" />
            <span className="sr-only">New Chat</span>
          </Button>
        </div>
        <div className="relative">
          <SidebarInput 
            type="text" 
            placeholder="Search chats..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="bg-muted/40 pl-8 pr-8"
          />
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground/70" />
          {searchQuery && (
            <button 
              className="absolute right-2.5 top-2.5 h-5 w-5 rounded-full bg-muted-foreground/30 flex items-center justify-center text-background"
              onClick={clearSearch}
            >
              <X className="h-3.5 w-3.5" />
              <span className="sr-only">Clear search</span>
            </button>
          )}
        </div>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent className="px-0">
        <ScrollArea className="h-[calc(100vh-180px)]">
          <ChatHistoryList 
            chats={filteredChats} 
            currentChatId={currentChatId}
            onSelectChat={handleSelectChat}
            onDeleteChat={handleDeleteChat}
          />
        </ScrollArea>
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter>
        {currentMessages.length > 0 && currentChatId === null && (
          <div className="px-3 py-2 text-xs text-muted-foreground/70 italic">
            Current chat not saved
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
};
