
import React from "react";
import { cn } from "@/lib/utils";

interface BlurContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  intensity?: "light" | "medium" | "heavy";
  className?: string;
  containerClassName?: string;
  gradient?: "none" | "subtle" | "prominent";
  hoverEffect?: boolean;
}

const BlurContainer = ({
  children,
  intensity = "medium",
  gradient = "none",
  className,
  containerClassName,
  hoverEffect = false,
  ...props
}: BlurContainerProps) => {
  // Map intensity to blur amount
  const blurMap = {
    light: "backdrop-blur-sm bg-white/30 dark:bg-black/20",
    medium: "backdrop-blur-md bg-white/40 dark:bg-black/30",
    heavy: "backdrop-blur-lg bg-white/50 dark:bg-black/40",
  };

  // Map gradient options
  const gradientMap = {
    none: "",
    subtle: "bg-gradient-to-br from-white/40 to-white/20 dark:from-black/40 dark:to-black/20",
    prominent: "bg-gradient-to-br from-white/60 to-white/30 dark:from-black/60 dark:to-black/30",
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border shadow-sm transition-all duration-300",
        gradient !== "none" ? "border-white/10 dark:border-white/5" : "border-white/20 dark:border-white/10",
        hoverEffect && "hover:shadow-md hover:border-white/30 dark:hover:border-white/15 hover:scale-[1.01] transform-gpu",
        containerClassName
      )}
      {...props}
    >
      <div
        className={cn(
          "relative z-10 h-full w-full p-6", 
          blurMap[intensity],
          gradientMap[gradient],
          className
        )}
      >
        {children}
      </div>
    </div>
  );
};

export { BlurContainer };
