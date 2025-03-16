
import React from "react";
import PromptCard from "./PromptCard";
import { Image, Sparkles, Palette, Wand2, Brush, Mountain, Landmark, Bot } from "lucide-react";

const TryPromptsSection: React.FC = () => {
  const prompts = [
    {
      title: "Fantasy Landscape",
      prompt: "Create a stunning fantasy landscape with floating islands, waterfalls, and a castle in the distance. Use vibrant colors and magical lighting.",
      icon: <Mountain className="h-5 w-5 text-primary" />,
      category: "Landscape"
    },
    {
      title: "Futuristic City",
      prompt: "Generate a detailed futuristic cityscape with flying vehicles, neon lights, and towering skyscrapers under a night sky.",
      icon: <Landmark className="h-5 w-5 text-primary" />,
      category: "Urban"
    },
    {
      title: "Artistic Portrait",
      prompt: "Create a stylized portrait in the style of Picasso with bold colors, abstract shapes, and cubist elements.",
      icon: <Palette className="h-5 w-5 text-primary" />,
      category: "Portrait"
    },
    {
      title: "Fantasy Character",
      prompt: "Design a heroic fantasy warrior character with ornate armor, magical weapons, and a dynamic pose ready for battle.",
      icon: <Wand2 className="h-5 w-5 text-primary" />,
      category: "Character"
    },
    {
      title: "Photorealistic Animal",
      prompt: "Generate a photorealistic image of a majestic tiger walking through a misty jungle at dawn.",
      icon: <Image className="h-5 w-5 text-primary" />,
      category: "Wildlife"
    },
    {
      title: "Digital Artwork",
      prompt: "Create a surreal digital artwork showing a person with galaxy-themed hair looking at floating geometric shapes in a minimalist setting.",
      icon: <Brush className="h-5 w-5 text-primary" />,
      category: "Digital Art"
    }
  ];

  return (
    <section className="py-16 bg-white border-t border-gray-100" id="try-prompts">
      <div className="container px-4 md:px-6 mx-auto max-w-6xl">
        <div className="text-center mb-12 animate-on-scroll">
          <div className="inline-flex items-center justify-center p-1 mb-2 rounded-full bg-primary/5">
            <span className="flex items-center gap-1.5 text-sm font-medium text-primary px-3 py-1">
              <Sparkles className="h-4 w-4" />
              Image Generation
            </span>
          </div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
            Try These Prompts
          </h2>
          <p className="max-w-2xl mx-auto text-gray-500 md:text-xl">
            Get started with these creative prompts to see what Gemini can generate
          </p>
        </div>
        
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {prompts.map((prompt, index) => (
            <div 
              key={index} 
              className="animate-on-scroll" 
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <PromptCard
                title={prompt.title}
                prompt={prompt.prompt}
                icon={prompt.icon}
                category={prompt.category}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TryPromptsSection;
