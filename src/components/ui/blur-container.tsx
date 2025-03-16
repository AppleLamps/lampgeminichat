
import React from "react";
import { cn } from "@/lib/utils";

interface BlurContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  intensity?: "light" | "medium" | "heavy";
  className?: string;
  containerClassName?: string;
}

const BlurContainer = ({
  children,
  intensity = "medium",
  className,
  containerClassName,
  ...props
}: BlurContainerProps) => {
  // Map intensity to blur amount
  const blurMap = {
    light: "backdrop-blur-sm bg-white/50 dark:bg-black/30",
    medium: "backdrop-blur-md bg-white/60 dark:bg-black/40",
    heavy: "backdrop-blur-lg bg-white/70 dark:bg-black/50",
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-white/20 shadow-sm",
        containerClassName
      )}
      {...props}
    >
      <div
        className={cn(
          "relative z-10 h-full w-full p-6", 
          blurMap[intensity],
          className
        )}
      >
        {children}
      </div>
    </div>
  );
};

export { BlurContainer };
