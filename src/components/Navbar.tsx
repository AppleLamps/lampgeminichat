
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Settings, Key, MessageSquare } from "lucide-react";
import SettingsDialog from "./SettingsDialog";
import { useApiKey } from "@/context/ApiKeyContext";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { isKeySet } = useApiKey();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out py-4 px-4 md:px-8",
          isScrolled
            ? "bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm"
            : "bg-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-medium transition-colors hover:text-black flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                <img 
                  src="/lovable-uploads/d03f6a93-56ad-44c9-9425-21d55cef2fdf.png" 
                  alt="Gemini Chat Logo" 
                  className="h-full w-full object-cover" 
                />
              </div>
              Gemini Chat
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <a
              href="#features"
              className="text-sm font-medium text-gray-600 hover:text-black transition-colors"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-sm font-medium text-gray-600 hover:text-black transition-colors"
            >
              How It Works
            </a>
            <a
              href="#about"
              className="text-sm font-medium text-gray-600 hover:text-black transition-colors"
            >
              About
            </a>
            <Link
              to="/chat"
              className="text-sm font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
            >
              <MessageSquare className="h-4 w-4" />
              Chat
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSettingsOpen(true)}
              className={cn(
                "gap-1.5 rounded-full px-4 transition-all",
                isKeySet
                  ? "text-green-600 bg-green-50 hover:bg-green-100 hover:text-green-700"
                  : "text-amber-600 bg-amber-50 hover:bg-amber-100 hover:text-amber-700"
              )}
            >
              <Key className="h-4 w-4" />
              {isKeySet ? "API Key Set" : "Set API Key"}
            </Button>
            <Link to="/chat">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full"
              >
                <MessageSquare className="h-4 w-4" />
                <span className="sr-only">Chat</span>
              </Button>
            </Link>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setSettingsOpen(true)}
              className="rounded-full"
            >
              <Settings className="h-4 w-4" />
              <span className="sr-only">Settings</span>
            </Button>
          </div>
        </div>
      </header>

      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </>
  );
};

export default Navbar;
