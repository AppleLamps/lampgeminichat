
import React from "react";
import { Link } from "react-router-dom";
import { BlurContainer } from "@/components/ui/blur-container";
import { Button } from "@/components/ui/button";
import { MessageSquare, ArrowRight } from "lucide-react";

interface PromptCardProps {
  title: string;
  prompt: string;
  icon: React.ReactNode;
  category?: string;
}

const PromptCard: React.FC<PromptCardProps> = ({ title, prompt, icon, category }) => {
  // Create a URL-encoded version of the prompt for the chat link
  const encodedPrompt = encodeURIComponent(prompt);
  
  return (
    <BlurContainer 
      className="relative p-6 h-full flex flex-col transition-all duration-300"
      intensity="light"
      gradient="subtle"
      hoverEffect
    >
      <div className="flex justify-between items-start mb-3">
        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
          {icon}
        </div>
        {category && (
          <span className="text-xs font-medium text-primary/80 bg-primary/5 px-2 py-1 rounded-full">
            {category}
          </span>
        )}
      </div>
      
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      
      <p className="text-sm text-muted-foreground flex-grow mb-4">
        {prompt}
      </p>
      
      <Link to={`/chat?prompt=${encodedPrompt}`} className="mt-auto">
        <Button variant="ghost" size="sm" className="w-full group hover:bg-primary/10">
          <MessageSquare className="h-4 w-4 mr-2" />
          Try this prompt
          <ArrowRight className="h-4 w-4 ml-auto transition-transform group-hover:translate-x-0.5" />
        </Button>
      </Link>
    </BlurContainer>
  );
};

export default PromptCard;
