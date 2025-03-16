import { toast } from "sonner";

// Configuration for the Gemini API
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models";
const TEXT_MODEL = "gemini-2.0-flash";
const IMAGE_GENERATION_MODEL = "gemini-2.0-flash-exp";
const IMAGE_EDITING_MODEL = "gemini-2.0-flash-exp-image-generation";

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

interface GeminiRequest {
  contents: {
    role: string;
    parts: {
      text?: string;
      inlineData?: {
        mimeType: string;
        data: string;
      };
    }[];
  }[];
  generationConfig: {
    temperature: number;
    topK: number;
    topP: number;
    maxOutputTokens: number;
    responseModalities?: string[]; // Critical for image generation
  };
  safetySettings: SafetySetting[];
}

interface GeminiErrorResponse {
  error: {
    code: number;
    message: string;
    status: string;
  };
}

export class GeminiService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async makeApiRequest(url: string, payload: any): Promise<any> {
    try {
      console.log(`Sending request to: ${url}`);
      console.log("Request payload includes responseModalities:", 
        payload.generationConfig.responseModalities ? "Yes" : "No");
      
      const response = await fetch(
        `${url}?key=${this.apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        }
      );

      if (!response.ok) {
        const errorData = await response.json() as GeminiErrorResponse;
        console.error("Gemini API error:", errorData);
        
        if (errorData.error.code === 400) {
          toast.error("Invalid request to Gemini API");
        } else if (errorData.error.code === 401) {
          toast.error("Invalid API key. Please check your settings.");
        } else {
          toast.error(`Error: ${errorData.error.message}`);
        }
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      toast.error("Failed to communicate with Gemini API");
      return null;
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
      "picture of",
      "photo of"
    ];

    return imageGenerationKeywords.some(keyword => 
      message.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  // Improved detection for image editing requests
  private isImageEditingRequest(message: string, messages: ChatMessage[]): boolean {
    // Check if there's a recent image in the conversation (within last 5 messages)
    const hasRecentImage = messages.slice(-5).some(msg => msg.imageUrl);
    
    // If no recent images, it can't be an editing request
    if (!hasRecentImage) return false;
    
    // Expanded list of editing keywords for better detection
    const editingKeywords = [
      "edit", "modify", "change", "update", "transform", "alter", "adjust",
      "make it", "turn it", "convert", "fix", "enhance", "improve", "refine",
      "add", "remove", "put", "take", "replace", "recolor", "colorize"
    ];

    return editingKeywords.some(keyword => 
      message.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  async sendMessage(messages: ChatMessage[]): Promise<ChatMessage | null> {
    // Get the latest user message
    const latestUserMessage = [...messages].reverse().find(msg => msg.role === "user");
    
    if (!latestUserMessage) {
      return null;
    }

    console.log("Processing message:", latestUserMessage.content);
    console.log("Has image URL:", !!latestUserMessage.imageUrl);

    // CASE 1: Handle case where an image is directly attached to the latest message
    if (latestUserMessage.imageUrl) {
      // If there's text with the image, assume it's an edit/caption request
      if (latestUserMessage.content && latestUserMessage.content.trim().length > 0) {
        console.log("Image attached with text, treating as edit request");
        return this.editImage(latestUserMessage.content, latestUserMessage.imageUrl);
      } else {
        // If no text, just acknowledge the image
        return {
          role: "assistant",
          content: "I've received your image. What would you like me to do with it?",
          timestamp: new Date()
        };
      }
    }

    // CASE 2: Determine request type for text-only messages
    const isImageGeneration = this.isImageGenerationRequest(latestUserMessage.content);
    const isImageEditing = this.isImageEditingRequest(latestUserMessage.content, messages);
    
    console.log(`Request type: ${isImageGeneration ? 'Image Generation' : isImageEditing ? 'Image Editing' : 'Text Chat'}`);
    
    // Choose the appropriate action based on the request type
    if (isImageGeneration) {
      return this.generateImage(latestUserMessage.content);
    } else if (isImageEditing) {
      // Find the most recent image to edit
      const imageToEdit = [...messages]
        .reverse()
        .find(msg => msg.imageUrl)?.imageUrl;
      
      if (imageToEdit) {
        return this.editImage(latestUserMessage.content, imageToEdit);
      } else {
        // This shouldn't happen with proper detection, but handle it gracefully
        return {
          role: "assistant",
          content: "I couldn't find a recent image to edit. Could you upload the image again?",
          timestamp: new Date()
        };
      }
    }
    
    // Default to regular text chat for all other cases
    return this.sendTextMessage(messages);
  }

  // Regular text chat with gemini-2.0-flash
  private async sendTextMessage(messages: ChatMessage[]): Promise<ChatMessage | null> {
    try {
      // Format messages for Gemini API
      const formattedMessages = messages.map(msg => ({
        role: msg.role === "system" ? "user" : msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }]
      }));

      // Create request payload
      const payload: GeminiRequest = {
        contents: formattedMessages,
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 4096
        },
        safetySettings: DEFAULT_SAFETY_SETTINGS
      };

      // Call Gemini API
      const data = await this.makeApiRequest(
        `${API_URL}/${TEXT_MODEL}:generateContent`,
        payload
      );
      
      if (!data || !data.candidates || !data.candidates[0]?.content) {
        toast.error("Received invalid response from Gemini API");
        return null;
      }

      // Extract the response text
      const responseText = data.candidates[0].content.parts[0].text;
      
      return {
        role: "assistant",
        content: responseText,
        timestamp: new Date()
      };
    } catch (error) {
      console.error("Error in sendTextMessage:", error);
      return null;
    }
  }

  // Generate an image with gemini-2.0-flash-exp
  private async generateImage(prompt: string): Promise<ChatMessage | null> {
    try {
      console.log("Generating image with prompt:", prompt);
      
      // Create a request for image generation
      const payload: GeminiRequest = {
        contents: [{
          role: "user",
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.8,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 4096,
          responseModalities: ["Text", "Image"]  // Critical for image generation
        },
        safetySettings: DEFAULT_SAFETY_SETTINGS
      };

      // Call Gemini API for image generation
      const data = await this.makeApiRequest(
        `${API_URL}/${IMAGE_GENERATION_MODEL}:generateContent`,
        payload
      );

      if (!data || !data.candidates || !data.candidates[0]?.content) {
        toast.error("Failed to generate image");
        return null;
      }

      // Check if the response contains an image
      const parts = data.candidates[0].content.parts;
      console.log("Response parts:", parts.length);
      
      const imagePart = parts.find((part: any) => part.inlineData?.mimeType?.startsWith('image/'));
      const textPart = parts.find((part: any) => part.text);
      
      if (!imagePart) {
        // If no image, return text response
        console.log("No image in response, returning text");
        return {
          role: "assistant",
          content: textPart?.text || "I tried to generate an image, but couldn't create one.",
          timestamp: new Date()
        };
      }

      // Create image URL from base64 data
      const imageUrl = `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;
      console.log("Image generated successfully");
      
      return {
        role: "assistant",
        content: textPart?.text || "Here's the image I generated for you:",
        imageUrl: imageUrl,
        timestamp: new Date()
      };
    } catch (error) {
      console.error("Error in generateImage:", error);
      return null;
    }
  }

  // Edit an image
  private async editImage(instructions: string, imageUrl: string): Promise<ChatMessage | null> {
    try {
      console.log("Editing image with instructions:", instructions);
      
      // Extract the base64 data from the image URL
      let imageData = "";
      let mimeType = "image/jpeg";
      
      if (imageUrl.startsWith('data:')) {
        // It's already a data URL
        const parts = imageUrl.split(',');
        if (parts.length < 2) {
          throw new Error("Invalid image data URL format");
        }
        
        // Get the MIME type from the data URL
        const mimeMatch = imageUrl.match(/data:([^;]+);base64,/);
        mimeType = mimeMatch ? mimeMatch[1] : "image/jpeg";
        
        // Get the base64 data
        imageData = parts[1];
      } else {
        // Try to fetch the image from a URL
        try {
          const response = await fetch(imageUrl);
          const blob = await response.blob();
          
          // Convert to base64
          const base64 = await this.blobToBase64(blob);
          const parts = base64.split(',');
          if (parts.length < 2) {
            throw new Error("Failed to convert image to base64");
          }
          
          imageData = parts[1];
          mimeType = blob.type || "image/jpeg";
        } catch (error) {
          console.error("Error fetching or converting image:", error);
          toast.error("Failed to process the image");
          return null;
        }
      }

      console.log("Prepared image data for editing, mime type:", mimeType);
      
      // Create request payload with image + text instructions
      const payload: GeminiRequest = {
        contents: [{
          role: "user",
          parts: [
            {
              inlineData: {
                mimeType: mimeType,
                data: imageData
              }
            },
            {
              text: instructions
            }
          ]
        }],
        generationConfig: {
          temperature: 0.8,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 4096,
          responseModalities: ["Text", "Image"]  // Critical for image generation
        },
        safetySettings: DEFAULT_SAFETY_SETTINGS
      };

      // Call Gemini API
      const data = await this.makeApiRequest(
        `${API_URL}/${IMAGE_GENERATION_MODEL}:generateContent`,
        payload
      );

      if (!data || !data.candidates || !data.candidates[0]?.content) {
        toast.error("Failed to edit image");
        return null;
      }

      // Process the response
      const parts = data.candidates[0].content.parts;
      console.log("Response has", parts.length, "parts");
      
      // Extract image and text from response
      const imagePart = parts.find((part: any) => part.inlineData?.mimeType?.startsWith('image/'));
      const textPart = parts.find((part: any) => part.text);
      
      if (!imagePart) {
        // If no image was returned, return just the text explanation
        console.log("No image in edit response, returning text only");
        return {
          role: "assistant",
          content: textPart?.text || "I tried to edit the image, but couldn't complete the task.",
          timestamp: new Date()
        };
      }

      // Create a data URL from the image data
      const editedImageUrl = `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;
      console.log("Image edited successfully");
      
      return {
        role: "assistant",
        content: textPart?.text || "Here's the edited image:",
        imageUrl: editedImageUrl,
        timestamp: new Date()
      };
    } catch (error) {
      console.error("Error in editImage:", error);
      return null;
    }
  }

  // Helper to convert blob to base64
  private blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }
}