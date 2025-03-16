
import React, { createContext, useContext, useState, useEffect } from "react";
import { getStorageItem, setStorageItem, STORAGE_KEYS } from "@/utils/storage";
import { toast } from "sonner";

interface ApiKeyContextType {
  apiKey: string;
  setApiKey: (key: string) => void;
  clearApiKey: () => void;
  isKeySet: boolean;
}

const ApiKeyContext = createContext<ApiKeyContextType | undefined>(undefined);

export const ApiKeyProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [apiKey, setApiKeyState] = useState<string>("");
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize from localStorage on mount
  useEffect(() => {
    const storedKey = getStorageItem<string>(STORAGE_KEYS.API_KEY, "");
    setApiKeyState(storedKey);
    setIsInitialized(true);
  }, []);

  const setApiKey = (key: string) => {
    setApiKeyState(key);
    setStorageItem(STORAGE_KEYS.API_KEY, key);
    if (key) {
      toast.success("API key saved successfully");
    }
  };

  const clearApiKey = () => {
    setApiKeyState("");
    setStorageItem(STORAGE_KEYS.API_KEY, "");
    toast.success("API key removed");
  };

  const value = {
    apiKey,
    setApiKey,
    clearApiKey,
    isKeySet: Boolean(apiKey),
  };

  // Only render children after initialization to prevent flickering
  if (!isInitialized) {
    return null;
  }

  return (
    <ApiKeyContext.Provider value={value}>
      {children}
    </ApiKeyContext.Provider>
  );
};

export const useApiKey = (): ApiKeyContextType => {
  const context = useContext(ApiKeyContext);
  if (context === undefined) {
    throw new Error("useApiKey must be used within an ApiKeyProvider");
  }
  return context;
};
