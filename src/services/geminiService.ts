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

export type MessageContent = string | { text: string; image?: { data: string } };

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

interface GenerationConfig {
  temperature: number;
  topK: number;
  topP: number;
  maxOutputTokens: number;
  responseModalities?: string[]; // Add this for image generation
}

interface GeminiTextRequest {
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
  generationConfig: GenerationConfig;
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
      // Format messages for Gemini API
      const formattedMessages = messages.map(msg => ({
        role: msg.role === "system" ? "user" : msg.role,
        parts: [{ text: msg.content }]
      }));

      // Create request payload
      const payload: GeminiTextRequest = {
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
      const payload = {
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
      
      if (!imagePart) {
        // If no image, return text response
        const textPart = parts.find((part: any) => part.text);
        console.log("No image in response, returning text");
        return {
          role: "assistant",
          content: textPart?.text || "I generated an image, but couldn't retrieve it properly.",
          timestamp: new Date()
        };
      }

      // Create image URL from base64 data
      const imageUrl = `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;
      console.log("Image generated successfully");
      
      return {
        role: "assistant",
        content: "Here's the image I generated for you:",
        imageUrl: imageUrl,
        timestamp: new Date()
      };
    } catch (error) {
      console.error("Error in generateImage:", error);
      return null;
    }
  }

  // Edit an image with gemini-2.0-flash-exp-image-generation
  private async editImage(instructions: string, imageUrl: string): Promise<ChatMessage | null> {
    try {
      console.log("Editing image with instructions:", instructions);
      
      // Convert the image URL to base64 if it's not already
      let imageData = imageUrl;
      if (imageUrl.startsWith('data:')) {
        // Already base64, extract the data part
        imageData = imageUrl.split(',')[1];
      } else {
        // Fetch the image and convert to base64
        try {
          const response = await fetch(imageUrl);
          const blob = await response.blob();
          imageData = await this.blobToBase64(blob);
          imageData = imageData.split(',')[1]; // Remove the data:image/... prefix
        } catch (error) {
          console.error("Error converting image to base64:", error);
          toast.error("Failed to process the image for editing");
          return null;
        }
      }

      // Create request payload for image editing
      const payload = {
        contents: [{
          role: "user",
          parts: [
            {
              inlineData: {
                mimeType: this.getMimeTypeFromUrl(imageUrl),
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

      // Call Gemini API for image editing
      const data = await this.makeApiRequest(
        `${API_URL}/${IMAGE_EDITING_MODEL}:generateContent`,
        payload
      );

      if (!data || !data.candidates || !data.candidates[0]?.content) {
        toast.error("Failed to edit image");
        return null;
      }

      // Check if the response contains an image
      const parts = data.candidates[0].content.parts;
      const imagePart = parts.find((part: any) => part.inlineData?.mimeType?.startsWith('image/'));
      
      if (!imagePart) {
        // If no image, return text response
        const textPart = parts.find((part: any) => part.text);
        console.log("No image in edit response, returning text");
        return {
          role: "assistant",
          content: textPart?.text || "I tried to edit the image, but couldn't complete the task.",
          timestamp: new Date()
        };
      }

      // Create image URL from base64 data
      const editedImageUrl = `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;
      console.log("Image edited successfully");
      
      return {
        role: "assistant",
        content: "Here's the edited image:",
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

  // Helper to get MIME type from URL
  private getMimeTypeFromUrl(url: string): string {
    if (url.startsWith('data:')) {
      const matches = url.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,/);
      return matches ? matches[1] : 'image/jpeg';
    }
    
    const extension = url.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg';
      case 'png':
        return 'image/png';
      case 'gif':
        return 'image/gif';
      case 'webp':
        return 'image/webp';
      default:
        return 'image/jpeg';
    }
  }
}