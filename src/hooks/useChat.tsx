
import { useState, useCallback, useEffect } from "react";
import { GeminiService, ChatMessage } from "@/services/geminiService";
import { useApiKey } from "@/context/ApiKeyContext";
import { useImagen3 } from "@/context/Imagen3Context";
import { toast } from "sonner";

export const useChat = () => {
  const { apiKey, isKeySet } = useApiKey();
  const { imagen3Enabled } = useImagen3();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState<string | null>(null);
  
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
      
      // Add the user message to the chat
      setMessages(prev => [...prev, userMessage]);
      
      // Set loading state
      setIsLoading(true);
      
      // Enhanced loading message detection - ensure all sample prompts get proper feedback
      let tempLoadingMessage = "Thinking...";
      
      // Image generation indicators in the message
      const imageGenerationIndicators = [
        "image", "picture", "photo", "draw", "edit", "create", "generate",
        "design", "craft", "render", "compose", "depict", "illustrate",
        "character", "landscape", "portrait", "scene", "fantasy", "artwork",
        "warrior", "hero", "photorealistic"
      ];
      
      // Check if any image generation keywords are in the message
      const containsImageKeyword = imageGenerationIndicators.some(keyword => 
        content.toLowerCase().includes(keyword)
      );
      
      // Set appropriate loading message
      if (imageData) {
        tempLoadingMessage = "Processing your image...";
      } else if (containsImageKeyword) {
        tempLoadingMessage = "Generating image...";
      }
      
      // Set the loading message for UI display - but don't add it to messages array
      setLoadingMessage(tempLoadingMessage);
      
      // Get the current messages for the API call - exclude any temporary messages
      const currentMessages = messages.filter(msg => 
        !msg.isGeneratingImage && !msg.isEditingImage
      );
      
      // Add the user message we just created
      currentMessages.push(userMessage);
      
      // Initialize Gemini service with API key
      const geminiService = new GeminiService(apiKey);

      let response;
      // If Imagen 3 is enabled and this is an image generation request, use Imagen 3 (to be implemented)
      if (imagen3Enabled && !imageData && containsImageKeyword) {
        // Placeholder: Imagen 3 logic will be implemented in GeminiService and called here
        if (typeof geminiService.generateImageWithImagen3 === "function") {
          response = await geminiService.generateImageWithImagen3(content);
        } else {
          response = await geminiService.sendMessage(currentMessages);
        }
      } else {
        // Default: use Gemini
        response = await geminiService.sendMessage(currentMessages);
      }
      
      // Clear loading message
      setLoadingMessage(null);
      
      if (response) {
        // Add assistant response to chat
        setMessages(prev => [...prev, response]);
      } else {
        // Handle the case where there was no valid response
        const errorMessage: ChatMessage = {
          role: "assistant",
          content: imageData 
            ? "I'm having trouble processing that image. Could you try a different image or request?"
            : "I'm having trouble processing that request. Could you try rephrasing it?",
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, errorMessage]);
        
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
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again with a different request.",
        timestamp: new Date()
      }]);
      
      // Clear loading message
      setLoadingMessage(null);
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
    setLoadingMessage(null);
    setIsLoading(false);
  }, []);

  return {
    messages,
    isLoading,
    loadingMessage,
    sendMessage,
    clearChat,
    isKeySet
  };
};
