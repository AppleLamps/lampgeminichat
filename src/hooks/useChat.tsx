
import { useState, useCallback, useEffect } from "react";
import { GeminiService, ChatMessage } from "@/services/geminiService";
import { useApiKey } from "@/context/ApiKeyContext";
import { toast } from "sonner";

export const useChat = () => {
  const { apiKey, isKeySet } = useApiKey();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Initialize with a welcome message
  useEffect(() => {
    setMessages([
      {
        role: "system",
        content: "Welcome to Gemini Chat! I can help with text responses, image generation, and image editing. Try asking me to create an image or help with an existing one.",
        timestamp: new Date()
      }
    ]);
  }, []);

  const sendMessage = useCallback(async (content: string, imageData?: string) => {
    if (!content.trim() && !imageData) return;
    
    // Check if API key is set
    if (!isKeySet || !apiKey) {
      toast.error("Please set your Gemini API key in settings first");
      return;
    }

    try {
      // Create user message
      const userMessage: ChatMessage = {
        role: "user",
        content: content,
        timestamp: new Date(),
      };
      
      // If image data is provided, add it to the message
      if (imageData) {
        userMessage.imageUrl = imageData;
      }
      
      setMessages(prev => [...prev, userMessage]);
      setIsLoading(true);

      // Add a temporary "thinking" message if it's likely to be an image generation request
      const isImageRequest = content.toLowerCase().includes("image") || 
                            content.toLowerCase().includes("picture") ||
                            content.toLowerCase().includes("draw") ||
                            content.toLowerCase().includes("create") ||
                            content.toLowerCase().includes("generate");
      
      if (isImageRequest) {
        const thinkingMessage: ChatMessage = {
          role: "assistant",
          content: isImageRequest ? "Generating image..." : "Thinking...",
          timestamp: new Date(),
          isGeneratingImage: isImageRequest
        };
        
        setMessages(prev => [...prev, thinkingMessage]);
      }

      // Create a copy of messages that includes the new user message
      const updatedMessages = [...messages, userMessage];
      
      // Initialize Gemini service with the API key
      const geminiService = new GeminiService(apiKey);
      
      // Send request to Gemini API
      const response = await geminiService.sendMessage(updatedMessages);
      
      if (response) {
        // Remove the temporary thinking message if it exists
        if (isImageRequest) {
          setMessages(prev => prev.filter(msg => !msg.isGeneratingImage));
        }
        
        // Add assistant response to chat
        setMessages(prev => {
          // Filter out any temporary messages first
          const filteredMessages = prev.filter(msg => !msg.isGeneratingImage && !msg.isEditingImage);
          return [...filteredMessages, response];
        });
      } else {
        // If no response, add a friendly error message
        setMessages(prev => {
          // Filter out any temporary messages first
          const filteredMessages = prev.filter(msg => !msg.isGeneratingImage && !msg.isEditingImage);
          return [...filteredMessages, {
            role: "assistant",
            content: "I'm having trouble processing that request. Could you try rephrasing it or try a different question?",
            timestamp: new Date()
          }];
        });
      }
    } catch (error) {
      console.error("Error in sendMessage:", error);
      toast.error("Failed to send message");
      
      // Add a friendly error message to the chat
      setMessages(prev => {
        // Filter out any temporary messages first
        const filteredMessages = prev.filter(msg => !msg.isGeneratingImage && !msg.isEditingImage);
        return [...filteredMessages, {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again with a different request.",
          timestamp: new Date()
        }];
      });
    } finally {
      setIsLoading(false);
    }
  }, [apiKey, isKeySet, messages]);

  const clearChat = useCallback(() => {
    setMessages([
      {
        role: "system",
        content: "Chat cleared. I can help with text responses, image generation, and image editing. Try asking me to create an image or help with an existing one.",
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
