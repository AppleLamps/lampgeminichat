
import React from "react";
import { Image } from "lucide-react";

interface MessageImageProps {
  imageUrl: string;
}

export const MessageImage: React.FC<MessageImageProps> = ({ imageUrl }) => {
  return (
    <div className="mt-3 relative">
      <div className="rounded-md overflow-hidden shadow-md border border-white/10 dark:border-white/5 group-hover:border-white/20 dark:group-hover:border-white/10 transition-all">
        <img 
          src={imageUrl} 
          alt="Generated content" 
          className="w-full h-auto max-h-96 object-contain bg-black/40"
          loading="lazy"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect width='18' height='18' x='3' y='3' rx='2' ry='2'/%3E%3Ccircle cx='9' cy='9' r='2'/%3E%3Cpath d='m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21'/%3E%3C/svg%3E";
            target.className = target.className + " p-8 text-slate-400";
          }}
        />
      </div>
      <a 
        href={imageUrl} 
        download={`gemini-image-${Date.now()}.png`}
        target="_blank" 
        rel="noopener noreferrer"
        className="absolute bottom-2 right-2 bg-black/40 hover:bg-black/60 p-1.5 rounded-full transition-all shadow-lg border border-white/10 hover:border-white/20"
      >
        <Image className="h-4 w-4 text-white" />
        <span className="sr-only">Download image</span>
      </a>
    </div>
  );
};
