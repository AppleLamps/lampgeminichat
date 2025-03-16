
import React, { useRef, useEffect, useState } from "react";
import { useChat } from "@/hooks/useChat";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import { Button } from "@/components/ui/button";
import { Trash2, Settings, Bot, Sparkles } from "lucide-react";
import SettingsDialog from "@/components/SettingsDialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { BlurContainer } from "@/components/ui/blur-container";
import { cn } from "@/lib/utils";

const Chat: React.FC = () => {
  const { messages, isLoading, sendMessage, clearChat, isKeySet } = useChat();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll events to apply header effects
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    setScrolled(target.scrollTop > 20);
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-background via-background/95 to-background/90">
      <header 
        className={cn(
          "border-b sticky top-0 z-40 transition-all duration-500",
          scrolled 
            ? "bg-background/90 backdrop-blur-xl shadow-sm border-white/10" 
            : "bg-transparent backdrop-blur-sm border-transparent"
        )}
      >
        <div className="flex justify-between items-center max-w-4xl mx-auto p-4">
          <div className="flex items-center gap-2">
            <div className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full transition-all duration-300",
              "bg-gradient-to-br from-primary/20 to-primary/5 shadow-sm",
              scrolled ? "scale-90" : "scale-100"
            )}>
              <Bot className={cn(
                "transition-all duration-300",
                scrolled ? "h-4 w-4" : "h-5 w-5"
              )} />
            </div>
            <h1 className={cn(
              "font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent transition-all duration-300",
              scrolled ? "text-lg" : "text-xl"
            )}>
              Gemini Chat
              <span className="ml-1.5 hidden sm:inline-flex items-center text-xs font-normal bg-primary/10 text-primary/90 px-1.5 py-0.5 rounded-full">
                <Sparkles className="h-3 w-3 mr-0.5" /> AI
              </span>
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => clearChat()}
              title="Clear chat"
              className="rounded-full hover:bg-primary/10 transition-colors hover:scale-105 transform-gpu"
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Clear chat</span>
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setSettingsOpen(true)}
              title="Settings"
              className="rounded-full hover:bg-primary/10 transition-colors hover:scale-105 transform-gpu"
            >
              <Settings className="h-4 w-4" />
              <span className="sr-only">Settings</span>
            </Button>
          </div>
        </div>
      </header>

      {!isKeySet && (
        <Alert variant="destructive" className="m-4 max-w-4xl mx-auto animate-fade-in">
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
          
          {isLoading && (
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
                <span className="text-sm text-emerald-600/90 dark:text-emerald-400/90">Thinking...</span>
              </BlurContainer>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      <ChatInput 
        onSendMessage={sendMessage} 
        isLoading={isLoading} 
        openSettings={() => setSettingsOpen(true)}
        isKeySet={isKeySet}
      />

      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </div>
  );
};

export default Chat;
