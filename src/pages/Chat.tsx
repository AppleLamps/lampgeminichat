import React, { useRef, useEffect, useState } from "react";
import { useChat } from "@/hooks/useChat";
import { useChatHistory } from "@/hooks/useChatHistory";
import { useSidebarState } from "@/hooks/useSidebarState";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { SidebarToggle } from "@/components/chat/SidebarToggle";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Trash2, Settings, MessageSquare } from "lucide-react";
import SettingsDialog from "@/components/SettingsDialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { BlurContainer } from "@/components/ui/blur-container";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const Chat: React.FC = () => {
  const { 
    messages, 
    isLoading, 
    loadingMessage, 
    sendMessage, 
    clearChat, 
    isKeySet 
  } = useChat();
  
  const {
    currentChatId,
    saveChat,
    getChatById,
    startNewChat
  } = useChatHistory();
  
  const { isOpen, toggleSidebar } = useSidebarState();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    setScrolled(target.scrollTop > 20);
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading, loadingMessage]);
  
  useEffect(() => {
    if (currentChatId) {
      const chat = getChatById(currentChatId);
      if (chat) {
        clearChat();
        setTimeout(() => {
          chat.messages.forEach((msg, index) => {
            if (index === 0 && msg.role === 'system') {
              return;
            }
            
            if (msg.role === 'user') {
              const userContent = msg.content;
              const userImageUrl = msg.imageUrl;
              
              if (index === chat.messages.length - 1 && msg.role === 'user') {
                sendMessage(userContent, userImageUrl);
              }
            }
          });
        }, 100);
      }
    }
  }, [currentChatId, getChatById, clearChat, sendMessage]);
  
  useEffect(() => {
    if (messages.length > 1) {
      if (currentChatId) {
        saveChat(messages, currentChatId);
      }
    }
  }, [messages, currentChatId, saveChat]);
  
  const handleSendMessage = async (content: string, imageData?: string) => {
    await sendMessage(content, imageData);
  };
  
  const handleClearChat = () => {
    clearChat();
    startNewChat();
    toast.info("Chat cleared");
  };
  
  const handleSelectChat = (chatId: string) => {
    if (messages.length > 1 && !currentChatId) {
      saveChat(messages);
    }
    
    const chat = getChatById(chatId);
    if (chat) {
      clearChat();
    }
  };
  
  const handleNewChat = () => {
    if (messages.length > 1 && !currentChatId) {
      saveChat(messages);
    }
    
    clearChat();
    startNewChat();
  };

  return (
    <SidebarProvider defaultOpen={isOpen}>
      <div className="flex min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90">
        <ChatSidebar 
          onSelectChat={handleSelectChat}
          onNewChat={handleNewChat}
          currentMessages={messages}
        />
        
        <div className="flex flex-col flex-1 w-0 min-h-screen relative">
          <header 
            className={cn(
              "border-b sticky top-0 z-40 transition-all duration-500",
              scrolled 
                ? "bg-gradient-to-r from-background/80 via-background/90 to-background/80 backdrop-blur-xl shadow-md border-white/10 dark:border-white/5" 
                : "bg-transparent backdrop-blur-sm border-transparent"
            )}
          >
            <div className="flex justify-between items-center max-w-4xl mx-auto p-4">
              <div className="flex items-center gap-2">
                <SidebarToggle 
                  isOpen={isOpen} 
                  onClick={toggleSidebar}
                  className="mr-1"
                />
                <div className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full transition-all duration-300 overflow-hidden",
                  "bg-gradient-to-br from-primary/20 to-primary/5 shadow-sm",
                  "before:content-[''] before:absolute before:inset-0 before:rounded-full before:bg-primary/5 before:blur-xl before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300",
                  scrolled ? "scale-90" : "scale-100"
                )}>
                  <img 
                    src="/lovable-uploads/d03f6a93-56ad-44c9-9425-21d55cef2fdf.png" 
                    alt="Gemini Chat Logo" 
                    className="h-full w-full object-cover" 
                  />
                </div>
                <h1 className={cn(
                  "font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent transition-all duration-300",
                  scrolled ? "text-lg" : "text-xl"
                )}>
                  Gemini Chat
                  <span className="ml-1.5 hidden sm:inline-flex items-center text-xs font-normal bg-primary/10 text-primary/90 px-1.5 py-0.5 rounded-full">
                    <div className="h-3 w-3 mr-0.5 overflow-hidden rounded-full">
                      <img src="/lovable-uploads/d03f6a93-56ad-44c9-9425-21d55cef2fdf.png" alt="" className="h-full w-full object-cover" />
                    </div>
                    AI
                  </span>
                </h1>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleClearChat}
                  title="Clear chat"
                  className="rounded-full hover:bg-primary/10 transition-colors hover:scale-105 transform-gpu relative overflow-hidden group"
                >
                  <Trash2 className="h-4 w-4 transition-transform group-hover:scale-110 duration-300" />
                  <span className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 rounded-full transition-opacity duration-300"></span>
                  <span className="sr-only">Clear chat</span>
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setSettingsOpen(true)}
                  title="Settings"
                  className="rounded-full hover:bg-primary/10 transition-colors hover:scale-105 transform-gpu relative overflow-hidden group"
                >
                  <Settings className="h-4 w-4 transition-transform group-hover:rotate-45 duration-300" />
                  <span className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 rounded-full transition-opacity duration-300"></span>
                  <span className="sr-only">Settings</span>
                </Button>
              </div>
            </div>
          </header>

          {!isKeySet && (
            <Alert variant="destructive" className="m-4 max-w-4xl mx-auto animate-fade-in bg-destructive/5">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Please set your Gemini API key in settings to start chatting.
              </AlertDescription>
            </Alert>
          )}

          <div 
            className="flex-1 overflow-y-auto px-4 py-6 smooth-scroll" 
            onScroll={handleScroll}
          >
            <div className="max-w-4xl mx-auto space-y-5">
              {messages.map((message, index) => (
                <ChatMessage 
                  key={index} 
                  message={message} 
                  isSequential={index > 0 && messages[index-1].role === message.role}
                />
              ))}
              
              {isLoading && loadingMessage && (
                <div className="flex justify-start animate-fade-in">
                  <BlurContainer 
                    intensity="light" 
                    gradient="subtle"
                    hoverEffect
                    className="px-4 py-3 flex items-center gap-2 w-fit max-w-[80%] bg-gradient-to-r from-emerald-500/5 to-teal-600/10 border-emerald-200/20 shadow-md"
                  >
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-emerald-500/60 rounded-full animate-bounce [animation-delay:0ms]"></span>
                      <span className="w-2 h-2 bg-emerald-500/60 rounded-full animate-bounce [animation-delay:150ms]"></span>
                      <span className="w-2 h-2 bg-emerald-500/60 rounded-full animate-bounce [animation-delay:300ms]"></span>
                    </div>
                    <span className="text-sm text-emerald-600/90 dark:text-emerald-400/90">{loadingMessage}</span>
                  </BlurContainer>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </div>

          <ChatInput 
            onSendMessage={handleSendMessage}
            isLoading={isLoading} 
            openSettings={() => setSettingsOpen(true)}
            isKeySet={isKeySet}
          />

          <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Chat;
