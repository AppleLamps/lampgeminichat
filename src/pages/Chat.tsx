import React, { useRef, useEffect, useState } from "react";
import { useChat } from "@/hooks/useChat";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import { Button } from "@/components/ui/button";
import { Trash2, Settings, ArrowLeft, ArrowDown, Sparkles } from "lucide-react";
import SettingsDialog from "@/components/SettingsDialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { BlurContainer } from "@/components/ui/blur-container";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import LoadingIndicator from "@/components/LoadingIndicator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const Chat: React.FC = () => {
  const { messages, isLoading, loadingMessage, sendMessage, clearChat, isKeySet } = useChat();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [hasNewMessages, setHasNewMessages] = useState(false);
  const location = useLocation();

  // Handle scroll events in the chat container
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    const isScrolledToBottom = Math.abs((target.scrollHeight - target.scrollTop) - target.clientHeight) < 50;

    setScrolled(target.scrollTop > 20);
    setShowScrollButton(!isScrolledToBottom && messages.length > 2);

    if (isScrolledToBottom) {
      setHasNewMessages(false);
    }
  };

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current && chatContainerRef.current) {
      const isScrolledToBottom =
        Math.abs((chatContainerRef.current.scrollHeight - chatContainerRef.current.scrollTop) -
        chatContainerRef.current.clientHeight) < 50;

      if (isScrolledToBottom || messages.length <= 2) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      } else if (messages.length > 0) {
        setHasNewMessages(true);
      }
    }
  }, [messages, isLoading, loadingMessage]);

  // Handle URL prompt parameter
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const promptParam = queryParams.get('prompt');

    if (promptParam && !isLoading && messages.length <= 1) {
      sendMessage(promptParam);
      window.history.replaceState({}, '', `${location.pathname}`);
    }
  }, [location, sendMessage, isLoading, messages.length]);

  // Scroll to bottom function
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      setHasNewMessages(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-background via-background/95 to-background/90">
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
            <Link to="/">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-primary/10 transition-colors hover:scale-105 transform-gpu relative overflow-hidden group mr-2"
                title="Back to home"
              >
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5 duration-300" />
                <span className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 rounded-full transition-opacity duration-300"></span>
                <span className="sr-only">Back to home</span>
              </Button>
            </Link>
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
              onClick={() => clearChat()}
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

      {/* Main chat container */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto px-4 py-6 smooth-scroll relative"
        onScroll={handleScroll}
      >
        {/* Background pattern */}
        <div className="absolute inset-0 pointer-events-none opacity-5">
          <div className="absolute inset-0 bg-grid-pattern-light dark:bg-grid-pattern-dark"></div>
        </div>

        {/* Welcome message when no messages */}
        {messages.length === 0 && !isLoading && (
          <div className="h-full flex flex-col items-center justify-center max-w-md mx-auto text-center px-4 py-10 animate-fade-in">
            <div className="w-16 h-16 mb-6 rounded-full bg-primary/10 flex items-center justify-center">
              <Sparkles className="h-8 w-8 text-primary/70" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Welcome to Gemini Chat</h2>
            <p className="text-muted-foreground mb-6">
              Start a conversation with Gemini AI. Ask questions, get creative responses, or upload an image to analyze.
            </p>
            <div className="w-full max-w-sm p-4 rounded-lg bg-primary/5 border border-primary/10">
              <p className="text-sm font-medium mb-2">Try asking:</p>
              <ul className="text-sm text-muted-foreground space-y-2 text-left">
                <li className="cursor-pointer hover:text-primary transition-colors p-2 rounded-md hover:bg-primary/5">
                  "Write a short story about a robot learning to paint"
                </li>
                <li className="cursor-pointer hover:text-primary transition-colors p-2 rounded-md hover:bg-primary/5">
                  "Explain quantum computing in simple terms"
                </li>
                <li className="cursor-pointer hover:text-primary transition-colors p-2 rounded-md hover:bg-primary/5">
                  "What are some healthy breakfast ideas?"
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Messages container */}
        <div className="max-w-4xl mx-auto space-y-5">
          {messages.map((message, index) => (
            <ChatMessage
              key={index}
              message={message}
              isSequential={index > 0 && messages[index-1].role === message.role}
            />
          ))}

          {/* Loading indicator */}
          {isLoading && loadingMessage && (
            <div className="flex justify-start animate-fade-in">
              <BlurContainer
                intensity="light"
                gradient="subtle"
                hoverEffect
                className="px-4 py-3 flex items-center gap-2 w-fit max-w-[80%] bg-gradient-to-r from-emerald-500/5 to-teal-600/10 border-emerald-200/20 shadow-md"
              >
                <LoadingIndicator message={loadingMessage} />
              </BlurContainer>
            </div>
          )}

          {/* Invisible element for scrolling to bottom */}
          <div ref={messagesEndRef} className="h-4" />
        </div>

        {/* Scroll to bottom button */}
        {showScrollButton && (
          <div className="absolute bottom-6 right-6 z-10 animate-bounce-in">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    onClick={scrollToBottom}
                    className={cn(
                      "rounded-full shadow-lg transition-all duration-300 h-10 w-10",
                      hasNewMessages
                        ? "bg-primary hover:bg-primary/90"
                        : "bg-muted/80 hover:bg-muted"
                    )}
                  >
                    <ArrowDown className="h-5 w-5" />
                    {hasNewMessages && (
                      <span className="absolute top-0 right-0 h-3 w-3 rounded-full bg-primary-foreground animate-pulse-subtle"></span>
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p>{hasNewMessages ? "New messages" : "Scroll to bottom"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
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
