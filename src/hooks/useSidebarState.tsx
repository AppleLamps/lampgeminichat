
import { useState, useEffect } from 'react';
import { getStorageItem, setStorageItem } from '@/utils/storage';

const SIDEBAR_STATE_KEY = 'gemini-sidebar-state';

export const useSidebarState = (defaultOpen = true) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  // Load sidebar state from localStorage on mount
  useEffect(() => {
    const storedState = getStorageItem<boolean>(SIDEBAR_STATE_KEY, defaultOpen);
    setIsOpen(storedState);
  }, [defaultOpen]);
  
  // Save sidebar state to localStorage whenever it changes
  useEffect(() => {
    setStorageItem(SIDEBAR_STATE_KEY, isOpen);
  }, [isOpen]);
  
  const toggleSidebar = () => {
    setIsOpen(prev => !prev);
  };
  
  return {
    isOpen,
    setIsOpen,
    toggleSidebar
  };
};
