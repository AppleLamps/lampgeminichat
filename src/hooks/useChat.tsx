
import { useState, useCallback } from "react";
import { GeminiService, ChatMessage } from "@/services/geminiService";
import { useApiKey } from "@/context/ApiKeyContext";
import { toast } from "sonner";

export const useChat = () => {
  const { apiKey, isKeySet } = useApiKey();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Initialize with a welcome message
  useState(() => {
    setMessages([
      {
        role: "system",
        content: "Welcome to Gemini Chat! How can I help you today?",
        timestamp: new Date()
      }
    ]);
  });

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;
    
    // Check if API key is set
    if (!isKeySet || !apiKey) {
      toast.error("Please set your Gemini API key in settings first");
      return;
    }

    try {
      // Add user message to chat
      const userMessage: ChatMessage = {
        role: "user",
        content,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, userMessage]);
      setIsLoading(true);

      // Create a copy of messages that includes the new user message
      const updatedMessages = [...messages, userMessage];
      
      // Initialize Gemini service with the API key
      const geminiService = new GeminiService(apiKey);
      
      // Send request to Gemini API
      const response = await geminiService.sendMessage(updatedMessages);
      
      if (response) {
        // Add assistant response to chat
        setMessages(prev => [...prev, response]);
      }
    } catch (error) {
      console.error("Error in sendMessage:", error);
      toast.error("Failed to send message");
    } finally {
      setIsLoading(false);
    }
  }, [apiKey, isKeySet, messages]);

  const clearChat = useCallback(() => {
    setMessages([
      {
        role: "system",
        content: "Chat cleared. How can I help you today?",
        timestamp: new Date()
      }
    ]);
  }, []);

  return {
    messages,
    isLoading,
    sendMessage,
    clearChat,
    isKeySet
  };
};
