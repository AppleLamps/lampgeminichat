
import React from 'react';
import { Button } from "@/components/ui/button";
import { PanelLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarToggleProps {
  isOpen: boolean;
  onClick: () => void;
  className?: string;
}

export const SidebarToggle: React.FC<SidebarToggleProps> = ({ 
  isOpen, 
  onClick,
  className
}) => {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onClick}
      title={isOpen ? "Hide sidebar" : "Show sidebar"}
      className={cn(
        "h-8 w-8 rounded-full transition-all duration-300",
        className
      )}
    >
      <PanelLeft className={cn(
        "h-4 w-4 transition-all duration-300", 
        !isOpen && "rotate-180"
      )} />
      <span className="sr-only">
        {isOpen ? "Hide sidebar" : "Show sidebar"}
      </span>
    </Button>
  );
};
