import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { ApiKeyProvider } from "@/context/ApiKeyContext";
import { setupScrollAnimations } from "@/utils/animations";
import { BlurContainer } from "@/components/ui/blur-container";
import SettingsDialog from "@/components/SettingsDialog";
import { Button } from "@/components/ui/button";
import { MessageSquare, Bot, Sparkles, BrainCircuit, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { useApiKey } from "@/context/ApiKeyContext";
import HeroSection from "@/components/HeroSection";
import TryPromptsSection from "@/components/TryPromptsSection";

const Index = () => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { isKeySet } = useApiKey();

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
          
          <TryPromptsSection />
          
          <section id="features" className="py-20 bg-gray-50">
            <div className="container px-4 md:px-6">
              <div className="text-center max-w-3xl mx-auto mb-12 animate-on-scroll">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Chat with Gemini's Latest AI
                </h2>
                <p className="mt-4 text-gray-500 md:text-xl">
                  Harness the power of Google's advanced AI model with our elegant and responsive interface.
                </p>
              </div>
              
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <BlurContainer className="p-6 animate-on-scroll" intensity="light">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <BrainCircuit className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Advanced AI Model</h3>
                  <p className="text-gray-500">
                    Powered by Google's Gemini AI model, capable of understanding complex queries and generating 
                    detailed, accurate responses.
                  </p>
                </BlurContainer>
                
                <BlurContainer className="p-6 animate-on-scroll" intensity="light">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <MessageSquare className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Natural Conversations</h3>
                  <p className="text-gray-500">
                    Engage in natural, flowing conversations with AI that understands context and provides 
                    coherent responses.
                  </p>
                </BlurContainer>
                
                <BlurContainer className="p-6 animate-on-scroll" intensity="light">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Sparkles className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Private & Secure</h3>
                  <p className="text-gray-500">
                    Your API key is stored locally and your conversations remain private. 
                    Chat with peace of mind.
                  </p>
                </BlurContainer>
              </div>
            </div>
          </section>
          
          <section id="how-it-works" className="py-20">
            <div className="container px-4 md:px-6">
              <div className="grid gap-12 md:grid-cols-2 items-center">
                <div className="animate-on-scroll">
                  <BlurContainer className="overflow-hidden rounded-2xl p-1 lg:p-2">
                    <div className="aspect-video overflow-hidden rounded-xl bg-muted/50 p-2">
                      <div className="rounded-lg bg-white shadow-lg p-6 h-full flex flex-col">
                        <div className="flex items-center space-x-2 mb-4">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Bot className="h-5 w-5 text-primary" />
                          </div>
                          <div className="font-medium">Gemini AI Chat</div>
                        </div>
                        <div className="space-y-4 flex-1">
                          <div className="bg-muted/10 p-3 rounded-md">
                            <p className="text-sm">Hello! How can I assist you today?</p>
                          </div>
                          <div className="bg-primary/10 p-3 rounded-md ml-auto max-w-[75%]">
                            <p className="text-sm">What are the latest advancements in renewable energy?</p>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <div className="w-6 h-6 flex justify-center items-center">
                              <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></div>
                            </div>
                            <span className="text-xs">Gemini is thinking...</span>
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
                    Getting started with Gemini AI Chat is simple and straightforward.
                  </p>
                  
                  <div className="space-y-6 mt-8">
                    <div className="flex gap-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full border border-primary bg-primary/10 text-sm font-medium">
                        1
                      </div>
                      <div className="space-y-1.5">
                        <h3 className="text-xl font-semibold">Set Up Your API Key</h3>
                        <p className="text-muted-foreground">
                          Add your Gemini API key from Google AI Studio in the settings.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full border border-primary bg-primary/10 text-sm font-medium">
                        2
                      </div>
                      <div className="space-y-1.5">
                        <h3 className="text-xl font-semibold">Start a Conversation</h3>
                        <p className="text-muted-foreground">
                          Navigate to the chat page and start asking questions or having a conversation.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full border border-primary bg-primary/10 text-sm font-medium">
                        3
                      </div>
                      <div className="space-y-1.5">
                        <h3 className="text-xl font-semibold">Get Intelligent Responses</h3>
                        <p className="text-muted-foreground">
                          Receive thoughtful, accurate responses powered by Google's Gemini AI.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <Link to="/chat">
                      <Button className="gap-2">
                        <MessageSquare className="h-4 w-4" />
                        Try It Now
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          <section id="about" className="py-20 bg-gray-50">
            <div className="container px-4 md:px-6">
              <div className="mx-auto max-w-3xl text-center animate-on-scroll">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                  About Gemini Chat
                </h2>
                <p className="mt-4 text-gray-500 md:text-xl">
                  A beautiful interface to interact with Google's powerful Gemini AI model.
                </p>
                
                <BlurContainer className="mt-12 text-left" intensity="light">
                  <h3 className="text-xl font-semibold mb-4">Our Philosophy</h3>
                  <p className="text-gray-500 mb-6">
                    Gemini Chat was built on the belief that AI should be accessible, beautiful, and 
                    functional. We've created a minimalist interface that puts your conversation with 
                    Gemini AI front and center, while handling the technical details in the background.
                  </p>
                  <p className="text-gray-500">
                    Every design decision prioritizes the quality of your AI interactions,
                    resulting in an application that's as elegant as it is useful.
                  </p>
                </BlurContainer>
              </div>
            </div>
          </section>
          
          <section className="py-16 bg-primary/5">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center justify-center text-center max-w-3xl mx-auto animate-on-scroll">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl mb-4">
                  Ready to Chat with Gemini?
                </h2>
                <p className="text-gray-500 md:text-xl mb-8">
                  Experience the future of AI conversation today.
                </p>
                <Link to="/chat">
                  <Button size="lg" className="gap-2 rounded-full">
                    <MessageSquare className="h-4 w-4" />
                    Start Chatting Now
                  </Button>
                </Link>
              </div>
            </div>
          </section>
          
          <footer className="border-t border-gray-200 py-12 md:py-16">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="flex flex-col items-center md:items-start gap-4 md:gap-2">
                  <div className="text-xl font-medium mb-2 md:mb-0">Gemini Chat</div>
                  <p className="text-center md:text-left text-gray-500 text-sm md:mt-1">
                    Intelligent conversations powered by Google's Gemini AI.
                  </p>
                </div>
                
                <div className="mt-6 md:mt-0">
                  <p className="text-sm text-gray-500">
                    &copy; {new Date().getFullYear()} Gemini Chat. All rights reserved.
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
