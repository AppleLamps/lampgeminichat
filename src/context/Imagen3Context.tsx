import React, { createContext, useContext, useState, useEffect } from "react";
import { getStorageItem, setStorageItem, STORAGE_KEYS } from "@/utils/storage";

const IMAGEN3_TOGGLE_KEY = "IMAGEN3_TOGGLE_ENABLED";

interface Imagen3ContextType {
  imagen3Enabled: boolean;
  setImagen3Enabled: (enabled: boolean) => void;
}

const Imagen3Context = createContext<Imagen3ContextType | undefined>(undefined);

export const Imagen3Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [imagen3Enabled, setImagen3EnabledState] = useState<boolean>(false);

  useEffect(() => {
    const stored = getStorageItem<boolean>(IMAGEN3_TOGGLE_KEY, false);
    setImagen3EnabledState(!!stored);
  }, []);

  const setImagen3Enabled = (enabled: boolean) => {
    setImagen3EnabledState(enabled);
    setStorageItem(IMAGEN3_TOGGLE_KEY, enabled);
  };

  return (
    <Imagen3Context.Provider value={{ imagen3Enabled, setImagen3Enabled }}>
      {children}
    </Imagen3Context.Provider>
  );
};

export const useImagen3 = (): Imagen3ContextType => {
  const context = useContext(Imagen3Context);
  if (context === undefined) {
    throw new Error("useImagen3 must be used within an Imagen3Provider");
  }
  return context;
};
