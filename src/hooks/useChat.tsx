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

  // Main function to send messages and handle images
  const sendMessage = useCallback(async (content: string, imageData?: string) => {
    // Validate input - require at least content or image
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
        console.log("Attaching image to message");
      }
      
      // First, add the user message to the messages array
      setMessages(prev => [...prev, userMessage]);
      
      // Set loading state to true
      setIsLoading(true);
      
      // Determine if this is likely an image-related operation for loading message
      const isImageRelated = 
        !!imageData || // Image is attached
        content.toLowerCase().includes("image") || 
        content.toLowerCase().includes("picture") ||
        content.toLowerCase().includes("photo") ||
        content.toLowerCase().includes("draw") ||
        content.toLowerCase().includes("edit") ||
        content.toLowerCase().includes("create") ||
        content.toLowerCase().includes("generate");
      
      // Add a temporary loading message
      const loadingMessage = imageData 
        ? "Processing your image..." 
        : isImageRelated 
          ? "Generating image..." 
          : "Thinking...";
      
      const thinkingMessage: ChatMessage = {
        role: "assistant",
        content: loadingMessage,
        timestamp: new Date(),
        isGeneratingImage: isImageRelated
      };
      
      // Add thinking message
      setMessages(prev => [...prev, thinkingMessage]);
      
      // Get the current messages including the new user message
      // This is to ensure we're working with the most up-to-date messages
      // But we need to exclude the thinking message
      const currentMessages = messages.filter(msg => 
        !msg.isGeneratingImage && !msg.isEditingImage
      );
      
      // Add the user message we just created
      currentMessages.push(userMessage);
      
      // Initialize Gemini service with API key
      const geminiService = new GeminiService(apiKey);
      
      // Send request to Gemini API
      const response = await geminiService.sendMessage(currentMessages);
      
      // Remove any temporary thinking messages
      setMessages(prev => prev.filter(msg => 
        !msg.isGeneratingImage && !msg.isEditingImage
      ));
      
      if (response) {
        // Add assistant response to chat
        setMessages(prev => {
          // Remove any temporary messages first
          const filteredMessages = prev.filter(msg => 
            !msg.isGeneratingImage && !msg.isEditingImage
          );
          return [...filteredMessages, response];
        });
      } else {
        // Handle the case where there was no valid response
        setMessages(prev => {
          // Remove any temporary messages first
          const filteredMessages = prev.filter(msg => 
            !msg.isGeneratingImage && !msg.isEditingImage
          );
          
          // Add a friendly error message
          return [...filteredMessages, {
            role: "assistant",
            content: imageData 
              ? "I'm having trouble processing that image. Could you try a different image or request?"
              : "I'm having trouble processing that request. Could you try rephrasing it?",
            timestamp: new Date()
          }];
        });
        
        // Show a toast with the error
        toast.error(imageData 
          ? "Image processing failed" 
          : "Failed to process your request"
        );
      }
    } catch (error) {
      console.error("Error in sendMessage:", error);
      toast.error("Failed to send message");
      
      // Add a friendly error message to the chat
      setMessages(prev => {
        // Remove any temporary messages first
        const filteredMessages = prev.filter(msg => 
          !msg.isGeneratingImage && !msg.isEditingImage
        );
        
        return [...filteredMessages, {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again with a different request.",
          timestamp: new Date()
        }];
      });
    } finally {
      // Always set loading to false when done
      setIsLoading(false);
    }
  }, [apiKey, isKeySet, messages]);

  // Function to clear the chat
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