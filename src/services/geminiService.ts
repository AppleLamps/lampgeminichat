
import { toast } from "sonner";

// Configuration for the Gemini API
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models";
const MODEL = "gemini-1.5-pro";

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp?: Date;
}

interface GeminiTextRequest {
  contents: {
    role: string;
    parts: {
      text: string;
    }[];
  }[];
  generationConfig: {
    temperature: number;
    topK: number;
    topP: number;
    maxOutputTokens: number;
  };
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

  async sendMessage(messages: ChatMessage[]): Promise<ChatMessage | null> {
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
        }
      };

      // Call Gemini API
      const response = await fetch(
        `${API_URL}/${MODEL}:generateContent?key=${this.apiKey}`,
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
        
        // Handle common API errors
        if (errorData.error.code === 400) {
          toast.error("Invalid request to Gemini API");
        } else if (errorData.error.code === 401) {
          toast.error("Invalid API key. Please check your settings.");
        } else {
          toast.error(`Error: ${errorData.error.message}`);
        }
        return null;
      }

      const data = await response.json();
      
      if (!data.candidates || !data.candidates[0]?.content) {
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
      console.error("Error calling Gemini API:", error);
      toast.error("Failed to communicate with Gemini API");
      return null;
    }
  }
}
