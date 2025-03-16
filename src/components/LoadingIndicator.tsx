
import React from "react";
import { cn } from "@/lib/utils";

interface LoadingIndicatorProps {
  message?: string;
  variant?: "default" | "minimal" | "dots";
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ 
  message = "Thinking...", 
  variant = "default" 
}) => {
  if (variant === "minimal") {
    return (
      <div className="flex items-center space-x-1.5">
        <div className="relative h-2 w-2">
          <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative rounded-full h-2 w-2 bg-emerald-500"></span>
        </div>
        <span className="text-sm text-emerald-600/90 dark:text-emerald-400/90">{message}</span>
      </div>
    );
  }
  
  if (variant === "dots") {
    return (
      <div className="flex items-center gap-2">
        <div className="flex gap-1">
          <span className="w-2 h-2 bg-emerald-500/60 rounded-full animate-bounce [animation-delay:0ms]"></span>
          <span className="w-2 h-2 bg-emerald-500/60 rounded-full animate-bounce [animation-delay:150ms]"></span>
          <span className="w-2 h-2 bg-emerald-500/60 rounded-full animate-bounce [animation-delay:300ms]"></span>
        </div>
        <span className="text-sm text-emerald-600/90 dark:text-emerald-400/90">{message}</span>
      </div>
    );
  }
  
  // Enhanced default animation - more visually distinctive typing animation
  return (
    <div className="flex items-center">
      <div className="relative flex items-center min-w-[48px] h-6">
        <div className="absolute inset-0 flex items-center">
          {[...Array(3)].map((_, i) => (
            <div 
              key={i} 
              className={cn(
                "h-2 w-2 mx-0.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400",
                "animate-pulse-slow opacity-0",
                i === 0 ? "animation-delay-0" : i === 1 ? "animation-delay-500" : "animation-delay-1000"
              )}
              style={{
                animationDelay: `${i * 300}ms`,
                animationDuration: '1.5s',
                opacity: 0,
                animation: 'pulse-slow 1.5s ease-in-out infinite',
                animationFillMode: 'both'
              }}
            />
          ))}
        </div>
        <div 
          className="bg-gradient-to-r from-emerald-500/40 to-teal-400/40 rounded-full absolute inset-0 blur-xl opacity-20 animate-pulse"
          style={{ animationDuration: '2s' }}
        />
      </div>
      <span className="ml-2 text-sm text-emerald-600/90 dark:text-emerald-400/90">
        {message}
      </span>
    </div>
  );
};

export default LoadingIndicator;
