import { toast } from "sonner";

// Configuration for the Gemini API
const TEXT_MODEL = "gemini-2.0-flash";
const IMAGE_GENERATION_MODEL = "gemini-2.0-flash-exp";

export type MessageRole = "user" | "assistant" | "system";

export interface ChatMessage {
  role: MessageRole;
  content: string;
  timestamp?: Date;
  imageUrl?: string;
  isGeneratingImage?: boolean;
  isEditingImage?: boolean;
}

// Safety settings interface
interface SafetySetting {
  category: string;
  threshold: string;
}

// Default safety settings to use with all requests
const DEFAULT_SAFETY_SETTINGS: SafetySetting[] = [
  { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
  { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
  { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" },
  { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
  { category: "HARM_CATEGORY_CIVIC_INTEGRITY", threshold: "BLOCK_NONE" }
];

export class GeminiService {
  private apiKey: string;
  private genAI: any; // GoogleGenerativeAI instance
  
  constructor(apiKey: string) {
    this.apiKey = apiKey;
    // We'll dynamically import the Google Generative AI library
    this.initializeGenAI();
  }
  
  private async initializeGenAI() {
    try {
      // Dynamic import for browser compatibility
      const { GoogleGenerativeAI } = await import('@google/generative-ai');
      this.genAI = new GoogleGenerativeAI(this.apiKey);
      console.log("GoogleGenerativeAI initialized successfully");
    } catch (error) {
      console.error("Failed to initialize GoogleGenerativeAI:", error);
      toast.error("Failed to initialize Gemini API client");
    }
  }

  // Detect if the message is requesting image generation
  private isImageGenerationRequest(message: string): boolean {
    const imageGenerationKeywords = [
      "generate an image", 
      "create an image", 
      "make an image",
      "draw",
      "generate a picture",
      "create a picture",
      "show me a picture",
      "visualize",
      "image of",
      "picture of"
    ];

    return imageGenerationKeywords.some(keyword => 
      message.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  // Detect if the message is requesting image editing
  private isImageEditingRequest(message: string, messages: ChatMessage[]): boolean {
    const hasRecentImage = messages.slice(-5).some(msg => msg.imageUrl);
    
    const editingKeywords = [
      "edit this image",
      "modify this image",
      "change this image",
      "update this image",
      "transform this image",
      "alter this image",
      "adjust the image",
      "make the image"
    ];

    return hasRecentImage && editingKeywords.some(keyword => 
      message.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  async sendMessage(messages: ChatMessage[]): Promise<ChatMessage | null> {
    // Ensure the GoogleGenerativeAI client is initialized
    if (!this.genAI) {
      await this.initializeGenAI();
      if (!this.genAI) {
        toast.error("Gemini API client not initialized");
        return null;
      }
    }
    
    // Get the latest user message
    const latestUserMessage = [...messages].reverse().find(msg => msg.role === "user");
    
    if (!latestUserMessage) {
      return null;
    }

    // Determine the type of request
    const isImageGeneration = this.isImageGenerationRequest(latestUserMessage.content);
    const isImageEditing = this.isImageEditingRequest(latestUserMessage.content, messages);
    
    console.log(`Request type: ${isImageGeneration ? 'Image Generation' : isImageEditing ? 'Image Editing' : 'Text Chat'}`);
    
    // Choose the appropriate model and method based on the request type
    if (isImageGeneration) {
      return this.generateImage(latestUserMessage.content);
    } else if (isImageEditing) {
      const imageToEdit = [...messages].reverse().find(msg => msg.imageUrl)?.imageUrl;
      if (imageToEdit) {
        return this.editImage(latestUserMessage.content, imageToEdit);
      }
    }
    
    // Default to regular text chat
    return this.sendTextMessage(messages);
  }

  // Regular text chat with gemini-2.0-flash
  private async sendTextMessage(messages: ChatMessage[]): Promise<ChatMessage | null> {
    try {
      // Get the model for text chat
      const model = this.genAI.getGenerativeModel({ model: TEXT_MODEL });
      
      // Format messages for Gemini API
      const formattedMessages = messages.map(msg => ({
        role: msg.role === "system" ? "user" : msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }]
      }));
      
      // Create a chat session
      const chat = model.startChat({
        history: formattedMessages.slice(0, -1), // All messages except the last one
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 4096
        },
        safetySettings: DEFAULT_SAFETY_SETTINGS
      });
      
      // Send the latest message
      const latestMessage = formattedMessages[formattedMessages.length - 1];
      const result = await chat.sendMessage(latestMessage.parts);
      const response = result.response;
      
      if (!response || !response.candidates || !response.candidates[0]?.content) {
        toast.error("Received invalid response from Gemini API");
        return null;
      }

      // Extract the response text
      const responseText = response.candidates[0].content.parts[0].text;
      
      return {
        role: "assistant",
        content: responseText,
        timestamp: new Date()
      };
    } catch (error) {
      console.error("Error in sendTextMessage:", error);
      toast.error("Error getting response from Gemini");
      return null;
    }
  }

  // Generate an image with gemini-2.0-flash-exp
  private async generateImage(prompt: string): Promise<ChatMessage | null> {
    try {
      console.log("Generating image with prompt:", prompt);
      
      // Get the model for image generation
      const model = this.genAI.getGenerativeModel({
        model: IMAGE_GENERATION_MODEL,
        generationConfig: {
          temperature: 0.8,
          topK: 40,
          topP: 0.95,
          responseModalities: ["Text", "Image"] // Critical for image generation
        },
        safetySettings: DEFAULT_SAFETY_SETTINGS
      });
      
      // Send the message to generate an image
      const result = await model.generateContent(prompt);
      const response = result.response;
      
      if (!response || !response.candidates || !response.candidates[0]?.content) {
        toast.error("Failed to generate image");
        return null;
      }

      let textResponse = null;
      let imageData = null;
      let mimeType = "image/png";

      // Process the response to find text and image parts
      const parts = response.candidates[0].content.parts;
      console.log("Number of parts in response:", parts.length);
      
      for (const part of parts) {
        if (part.inlineData) {
          // Found image data
          imageData = part.inlineData.data;
          mimeType = part.inlineData.mimeType || "image/png";
          console.log("Image data received, length:", imageData.length);
        } else if (part.text) {
          // Found text data
          textResponse = part.text;
          console.log("Text response received:", textResponse?.substring(0, 50) + "...");
        }
      }
      
      if (!imageData) {
        // If no image was found, return just the text
        return {
          role: "assistant",
          content: textResponse || "I tried to generate an image, but couldn't create one.",
          timestamp: new Date()
        };
      }
      
      // Create a data URL for the image
      const imageUrl = `data:${mimeType};base64,${imageData}`;
      console.log("Image generated successfully");
      
      return {
        role: "assistant",
        content: textResponse || "Here's the image I generated for you:",
        imageUrl: imageUrl,
        timestamp: new Date()
      };
    } catch (error) {
      console.error("Error in generateImage:", error);
      toast.error("Failed to generate image");
      return null;
    }
  }

  // Edit an image
  private async editImage(instructions: string, imageUrl: string): Promise<ChatMessage | null> {
    try {
      console.log("Editing image with instructions:", instructions);
      
      // Convert the image URL to base64 if it's not already
      let imageData = imageUrl;
      let mimeType = "image/jpeg";
      
      if (imageUrl.startsWith('data:')) {
        // Already base64, extract the data part
        const imgParts = imageUrl.split(',');
        if (imgParts.length < 2) {
          throw new Error("Invalid image data URL format");
        }
        
        imageData = imgParts[1];
        mimeType = imageUrl.includes("image/png") ? "image/png" : "image/jpeg";
      } else {
        // Fetch the image and convert to base64
        try {
          const response = await fetch(imageUrl);
          const blob = await response.blob();
          const reader = new FileReader();
          
          // Convert blob to base64
          const base64 = await new Promise<string>((resolve, reject) => {
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });
          
          const base64Parts = base64.split(',');
          if (base64Parts.length < 2) {
            throw new Error("Failed to convert image to base64");
          }
          
          imageData = base64Parts[1];
          mimeType = base64.includes("image/png") ? "image/png" : "image/jpeg";
        } catch (error) {
          console.error("Error converting image to base64:", error);
          toast.error("Failed to process the image for editing");
          return null;
        }
      }
      
      // Get the model for image editing
      const model = this.genAI.getGenerativeModel({
        model: IMAGE_GENERATION_MODEL,
        generationConfig: {
          temperature: 0.8,
          topK: 40,
          topP: 0.95,
          responseModalities: ["Text", "Image"] // Critical for image generation
        },
        safetySettings: DEFAULT_SAFETY_SETTINGS
      });
      
      // Prepare the message parts
      const messageParts = [
        {
          inlineData: {
            data: imageData,
            mimeType: mimeType
          }
        },
        { text: instructions }
      ];
      
      // Send the message to edit the image
      const result = await model.generateContent(messageParts);
      const response = result.response;
      
      if (!response || !response.candidates || !response.candidates[0]?.content) {
        toast.error("Failed to edit image");
        return null;
      }

      let textResponse = null;
      let editedImageData = null;
      let editedMimeType = "image/png";

      // Process the response to find text and image parts
      const parts = response.candidates[0].content.parts;
      console.log("Number of parts in edit response:", parts.length);
      
      for (const part of parts) {
        if (part.inlineData) {
          // Found image data
          editedImageData = part.inlineData.data;
          editedMimeType = part.inlineData.mimeType || "image/png";
          console.log("Edited image data received, length:", editedImageData.length);
        } else if (part.text) {
          // Found text data
          textResponse = part.text;
          console.log("Text response received:", textResponse?.substring(0, 50) + "...");
        }
      }
      
      if (!editedImageData) {
        // If no image was found, return just the text
        return {
          role: "assistant",
          content: textResponse || "I tried to edit the image, but couldn't create a new version.",
          timestamp: new Date()
        };
      }
      
      // Create a data URL for the edited image
      const editedImageUrl = `data:${editedMimeType};base64,${editedImageData}`;
      console.log("Image edited successfully");
      
      return {
        role: "assistant",
        content: textResponse || "Here's the edited image:",
        imageUrl: editedImageUrl,
        timestamp: new Date()
      };
    } catch (error) {
      console.error("Error in editImage:", error);
      toast.error("Failed to edit image");
      return null;
    }
  }
}