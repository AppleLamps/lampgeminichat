
import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import { ApiKeyProvider } from "@/context/ApiKeyContext";
import { setupScrollAnimations } from "@/utils/animations";
import { BlurContainer } from "@/components/ui/blur-container";
import SettingsDialog from "@/components/SettingsDialog";

const Index = () => {
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Setup scroll animations
  useEffect(() => {
    const observer = setupScrollAnimations();
    return () => {
      if (observer) {
        document.querySelectorAll('.animate-on-scroll').forEach((el) => {
          observer.unobserve(el);
        });
      }
    };
  }, []);

  return (
    <ApiKeyProvider>
      <div className="min-h-screen bg-white overflow-hidden">
        <Navbar />
        <main className="relative">
          <HeroSection onOpenSettings={() => setSettingsOpen(true)} />
          
          {/* Features Section */}
          <section id="features" className="py-20 bg-gray-50">
            <div className="container px-4 md:px-6">
              <div className="text-center max-w-3xl mx-auto mb-12 animate-on-scroll">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Beautifully Simple Features
                </h2>
                <p className="mt-4 text-gray-500 md:text-xl">
                  Designed with minimalism and functionality in mind, our features prioritize 
                  both security and user experience.
                </p>
              </div>
              
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {/* Feature 1 */}
                <BlurContainer className="p-6 animate-on-scroll" intensity="light">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <svg className="h-6 w-6 text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Secure Storage</h3>
                  <p className="text-gray-500">
                    Your API key is stored only in your browser's local storage and never transmitted 
                    to any server or third party.
                  </p>
                </BlurContainer>
                
                {/* Feature 2 */}
                <BlurContainer className="p-6 animate-on-scroll" intensity="light">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <svg className="h-6 w-6 text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Intuitive Interface</h3>
                  <p className="text-gray-500">
                    A clean, minimalist design that makes setting up and managing your API key 
                    straightforward and hassle-free.
                  </p>
                </BlurContainer>
                
                {/* Feature 3 */}
                <BlurContainer className="p-6 animate-on-scroll" intensity="light">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <svg className="h-6 w-6 text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3M12 12l8-4.5M12 12v9M12 12l-8-4.5M16 5.25L8 9.75" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Privacy Focused</h3>
                  <p className="text-gray-500">
                    We prioritize your privacy with a design that ensures your API key remains 
                    under your control at all times.
                  </p>
                </BlurContainer>
              </div>
            </div>
          </section>
          
          {/* How It Works Section */}
          <section id="how-it-works" className="py-20">
            <div className="container px-4 md:px-6">
              <div className="grid gap-12 md:grid-cols-2 items-center">
                <div className="animate-on-scroll">
                  <BlurContainer className="overflow-hidden rounded-2xl p-1 lg:p-2">
                    <div className="aspect-video overflow-hidden rounded-xl bg-muted/50 p-2">
                      <div className="rounded-lg bg-white shadow-lg p-6 h-full flex flex-col">
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center space-x-2">
                            <div className="h-3 w-3 rounded-full bg-red-500" />
                            <div className="h-3 w-3 rounded-full bg-yellow-500" />
                            <div className="h-3 w-3 rounded-full bg-green-500" />
                          </div>
                          <div className="text-xs font-medium text-gray-500">Settings</div>
                        </div>
                        <div className="space-y-4 flex-1">
                          <div className="space-y-2">
                            <div className="text-sm font-medium">Gemini API Key</div>
                            <div className="h-10 w-full rounded-md border border-gray-200 bg-gray-50"></div>
                          </div>
                          <div className="text-xs text-gray-500">
                            Your API key is stored securely in local storage
                          </div>
                          <div className="flex-1"></div>
                          <div className="flex justify-end space-x-2">
                            <div className="h-9 w-20 rounded-md bg-gray-100"></div>
                            <div className="h-9 w-16 rounded-md bg-black"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </BlurContainer>
                </div>
                
                <div className="space-y-6 animate-on-scroll">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                    How It Works
                  </h2>
                  <p className="text-gray-500 md:text-xl">
                    Setting up and using your Gemini API key is simple, secure, and fast.
                  </p>
                  
                  <div className="space-y-6 mt-8">
                    <div className="flex gap-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full border border-primary bg-primary/10 text-sm font-medium">
                        1
                      </div>
                      <div className="space-y-1.5">
                        <h3 className="text-xl font-semibold">Get Your API Key</h3>
                        <p className="text-muted-foreground">
                          Visit Google AI Studio to create and obtain your Gemini API key.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full border border-primary bg-primary/10 text-sm font-medium">
                        2
                      </div>
                      <div className="space-y-1.5">
                        <h3 className="text-xl font-semibold">Enter Your Key</h3>
                        <p className="text-muted-foreground">
                          Open settings and paste your API key into the secure input field.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full border border-primary bg-primary/10 text-sm font-medium">
                        3
                      </div>
                      <div className="space-y-1.5">
                        <h3 className="text-xl font-semibold">Start Using Gemini</h3>
                        <p className="text-muted-foreground">
                          Your API key is securely stored and ready to use with Gemini.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          {/* About Section */}
          <section id="about" className="py-20 bg-gray-50">
            <div className="container px-4 md:px-6">
              <div className="mx-auto max-w-3xl text-center animate-on-scroll">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                  About Gemini Key Cache
                </h2>
                <p className="mt-4 text-gray-500 md:text-xl">
                  Designed with simplicity, privacy, and elegance as our core principles.
                </p>
                
                <BlurContainer className="mt-12 text-left" intensity="light">
                  <h3 className="text-xl font-semibold mb-4">Our Philosophy</h3>
                  <p className="text-gray-500 mb-6">
                    Gemini Key Cache was built on the belief that technology should be both beautiful and 
                    functional, with an unwavering commitment to user privacy and data security. We've 
                    created a tool that embodies the principle of "less but better" — focusing only on 
                    what's essential and executing it flawlessly.
                  </p>
                  <p className="text-gray-500">
                    Every design decision prioritizes your security, privacy, and user experience,
                    resulting in an application that's as elegant as it is useful.
                  </p>
                </BlurContainer>
              </div>
            </div>
          </section>
          
          {/* Footer */}
          <footer className="border-t border-gray-200 py-12 md:py-16">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="flex flex-col items-center md:items-start gap-4 md:gap-2">
                  <div className="text-xl font-medium mb-2 md:mb-0">Gemini Key Cache</div>
                  <p className="text-center md:text-left text-gray-500 text-sm md:mt-1">
                    Secure, local storage for your Google Gemini API key.
                  </p>
                </div>
                
                <div className="mt-6 md:mt-0">
                  <p className="text-sm text-gray-500">
                    &copy; {new Date().getFullYear()} Gemini Key Cache. All rights reserved.
                  </p>
                </div>
              </div>
            </div>
          </footer>
        </main>
        
        <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
      </div>
    </ApiKeyProvider>
  );
};

export default Index;
