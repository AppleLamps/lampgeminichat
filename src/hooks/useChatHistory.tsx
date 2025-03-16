
import { useState, useEffect, useCallback } from 'react';
import { ChatMessage } from '@/services/geminiService';
import { getStorageItem, setStorageItem } from '@/utils/storage';

export interface ChatHistory {
  id: string;
  title: string;
  preview: string;
  timestamp: Date;
  messages: ChatMessage[];
}

const CHAT_HISTORY_KEY = 'gemini-chat-history';
const CURRENT_CHAT_ID_KEY = 'gemini-current-chat-id';

export const useChatHistory = () => {
  // State for storing chat history
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  
  // Load chat history from localStorage on mount
  useEffect(() => {
    const storedHistory = getStorageItem<ChatHistory[]>(CHAT_HISTORY_KEY, []);
    const storedCurrentChatId = getStorageItem<string | null>(CURRENT_CHAT_ID_KEY, null);
    
    setChatHistory(storedHistory.map(chat => ({
      ...chat,
      timestamp: new Date(chat.timestamp)
    })));
    
    setCurrentChatId(storedCurrentChatId);
  }, []);
  
  // Save chat history to localStorage whenever it changes
  useEffect(() => {
    setStorageItem(CHAT_HISTORY_KEY, chatHistory);
  }, [chatHistory]);
  
  // Save current chat ID to localStorage whenever it changes
  useEffect(() => {
    setStorageItem(CURRENT_CHAT_ID_KEY, currentChatId);
  }, [currentChatId]);
  
  // Get a chat by ID
  const getChatById = useCallback((id: string) => {
    return chatHistory.find(chat => chat.id === id) || null;
  }, [chatHistory]);
  
  // Save current chat
  const saveChat = useCallback((messages: ChatMessage[], existingId?: string) => {
    if (messages.length === 0) return null;
    
    // Generate title from first user message or use default
    const firstUserMessage = messages.find(m => m.role === 'user');
    const title = firstUserMessage 
      ? firstUserMessage.content.substring(0, 30) + (firstUserMessage.content.length > 30 ? '...' : '')
      : 'New Chat';
    
    // Generate preview from last message
    const lastMessage = messages[messages.length - 1];
    const preview = lastMessage.content.substring(0, 40) + (lastMessage.content.length > 40 ? '...' : '');
    
    // Create new chat or update existing
    const id = existingId || `chat-${Date.now()}`;
    const newChat: ChatHistory = {
      id,
      title,
      preview,
      timestamp: new Date(),
      messages,
    };
    
    setChatHistory(prevHistory => {
      // If updating existing chat, remove it first
      const filteredHistory = existingId 
        ? prevHistory.filter(chat => chat.id !== existingId)
        : prevHistory;
        
      // Add new/updated chat at the beginning
      return [newChat, ...filteredHistory];
    });
    
    setCurrentChatId(id);
    return id;
  }, []);
  
  // Delete a chat
  const deleteChat = useCallback((id: string) => {
    setChatHistory(prevHistory => prevHistory.filter(chat => chat.id !== id));
    
    // If we deleted the current chat, set current to null
    if (currentChatId === id) {
      setCurrentChatId(null);
    }
  }, [currentChatId]);
  
  // Start a new chat
  const startNewChat = useCallback(() => {
    setCurrentChatId(null);
  }, []);
  
  // Search chats
  const searchChats = useCallback((query: string): ChatHistory[] => {
    if (!query.trim()) return chatHistory;
    
    const lowerQuery = query.toLowerCase();
    return chatHistory.filter(
      chat => 
        chat.title.toLowerCase().includes(lowerQuery) || 
        chat.preview.toLowerCase().includes(lowerQuery)
    );
  }, [chatHistory]);
  
  return {
    chatHistory,
    currentChatId,
    getChatById,
    saveChat,
    deleteChat,
    startNewChat,
    searchChats
  };
};
