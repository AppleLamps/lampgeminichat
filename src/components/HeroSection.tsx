
import React from "react";
import { Button } from "@/components/ui/button";
import { BlurContainer } from "@/components/ui/blur-container";
import { cn } from "@/lib/utils";
import { Key, Settings } from "lucide-react";
import { useApiKey } from "@/context/ApiKeyContext";

interface HeroSectionProps {
  onOpenSettings: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onOpenSettings }) => {
  const { isKeySet } = useApiKey();

  return (
    <section className="relative overflow-hidden pt-32 pb-24 md:min-h-screen md:flex md:items-center">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_30%_20%,rgba(200,210,240,0.25),rgba(255,255,255,0)_25%),radial-gradient(circle_at_80%_60%,rgba(200,240,230,0.35),rgba(255,255,255,0)_30%)]"></div>
      
      {/* Content */}
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 md:grid-cols-2 md:gap-12 lg:grid-cols-[1fr_450px] items-center">
          <div className="flex flex-col justify-center space-y-4 animate-slide-up">
            <div className="space-y-2">
              <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-medium animate-fade-in">
                Welcome to Gemini Key Cache
              </div>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Secure Local Storage for Your Gemini API Key
              </h1>
              <p className="max-w-[600px] text-gray-500 md:text-xl">
                A beautifully designed solution to locally store and manage your Google Gemini API key with 
                simplicity, security, and elegance.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button 
                size="lg" 
                onClick={onOpenSettings}
                className="gap-2 rounded-full"
              >
                <Settings className="h-4 w-4" />
                Configure Settings
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className={cn(
                  "gap-2 rounded-full",
                  isKeySet 
                    ? "border-green-200 bg-green-50 text-green-700 hover:bg-green-100" 
                    : "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100"
                )}
                onClick={onOpenSettings}
              >
                <Key className="h-4 w-4" />
                {isKeySet ? "API Key Set" : "Set API Key"}
              </Button>
            </div>
          </div>
          
          {/* Feature visualization */}
          <div className="animate-fade-in [animation-delay:300ms]">
            <BlurContainer className="p-6 md:p-8 relative" intensity="light">
              <div className="absolute top-0 right-0 -mt-3 -mr-3 animate-pulse">
                <div className="h-6 w-6 rounded-full bg-green-400 shadow-lg shadow-green-400/30"></div>
              </div>
              
              <h3 className="text-xl font-semibold mb-4">Your API Key is Secure</h3>
              <div className="space-y-4">
                <div className="rounded-md bg-muted/50 p-3 flex items-start gap-3">
                  <div className="mt-0.5 h-5 w-5 shrink-0 rounded-full bg-green-500/20 flex items-center justify-center">
                    <svg className="h-3 w-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Stored Locally</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Your API key never leaves your browser and is stored only in local storage.
                    </p>
                  </div>
                </div>
                
                <div className="rounded-md bg-muted/50 p-3 flex items-start gap-3">
                  <div className="mt-0.5 h-5 w-5 shrink-0 rounded-full bg-green-500/20 flex items-center justify-center">
                    <svg className="h-3 w-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Easy Management</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Set, view, or remove your API key with a simple and elegant interface.
                    </p>
                  </div>
                </div>
                
                <div className="rounded-md bg-muted/50 p-3 flex items-start gap-3">
                  <div className="mt-0.5 h-5 w-5 shrink-0 rounded-full bg-green-500/20 flex items-center justify-center">
                    <svg className="h-3 w-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Privacy Focused</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      No tracking, no telemetry, and no data collection of any kind.
                    </p>
                  </div>
                </div>
              </div>
            </BlurContainer>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
