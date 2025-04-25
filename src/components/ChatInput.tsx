
import React, { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { BlurContainer } from "@/components/ui/blur-container";
import UploadImageButton from "@/components/UploadImageButton";
import ImagePreview from "@/components/ImagePreview";
import DragDropOverlay from "@/components/DragDropOverlay";
import MessageInput from "@/components/MessageInput";
import SendButton from "@/components/SendButton";
import { useImageUpload } from "@/hooks/useImageUpload";

interface ChatInputProps {
  onSendMessage: (content: string, imageData?: string) => void;
  isLoading: boolean;
  openSettings: () => void;
  isKeySet: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isLoading,
  openSettings,
  isKeySet
}) => {
  const [message, setMessage] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const dropZoneRef = useRef<HTMLFormElement>(null);

  const {
    imageData,
    isDragging,
    fileInputRef,
    handleImageUpload,
    clearImage,
    handleDragEnter,
    handleDragOver,
    handleDragLeave,
    handleDrop
  } = useImageUpload(isLoading, isKeySet);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((message.trim() || imageData) && !isLoading) {
      onSendMessage(message, imageData || undefined);
      setMessage("");
      clearImage();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Create a wrapper for handleDragLeave that includes the ref
  const handleDragLeaveWithRef = (e: React.DragEvent) => {
    handleDragLeave(e, dropZoneRef);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="sticky bottom-0 p-4 z-10"
      ref={dropZoneRef}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeaveWithRef}
      onDrop={handleDrop}
    >
      {/* Subtle gradient shadow above the input */}
      <div className="absolute left-0 right-0 h-24 bottom-full pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
      </div>

      <BlurContainer
        intensity="medium"
        gradient={isFocused || isDragging ? "subtle" : "none"}
        hoverEffect
        className={cn(
          "p-3 transition-all duration-500 bg-background/70",
          isFocused || isDragging
            ? "shadow-lg border-primary/10 dark:border-primary/20"
            : "border-white/10 dark:border-white/5",
          isDragging && "ring-2 ring-primary/30 dark:ring-primary/40",
          "animate-slide-up relative"
        )}
        containerClassName={cn(
          "shadow-lg hover:shadow-xl dark:shadow-primary/5 hover:shadow-primary/10 dark:hover:shadow-primary/20",
          "transition-all duration-300 ease-in-out",
          isFocused ? "translate-y-0" : "translate-y-1"
        )}
      >
        {/* Subtle glow effect when focused */}
        {isFocused && (
          <div className="absolute -inset-0.5 bg-primary/5 rounded-2xl blur-xl -z-10 animate-pulse-subtle"></div>
        )}

        {/* Drag overlay */}
        <DragDropOverlay isDragging={isDragging} />

        {/* Image preview */}
        <ImagePreview imageData={imageData!} onClear={clearImage} />

        <div className="flex gap-2 items-end max-w-4xl mx-auto">
          {/* Message input */}
          <MessageInput
            message={message}
            setMessage={setMessage}
            handleKeyDown={handleKeyDown}
            isLoading={isLoading}
            isKeySet={isKeySet}
            isFocused={isFocused}
            setIsFocused={setIsFocused}
            imageData={imageData}
          />

          {/* Hidden file input */}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageUpload}
            className="hidden"
            id="image-upload"
            disabled={isLoading || !isKeySet}
          />

          {/* Upload image button */}
          <UploadImageButton
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading || !isKeySet}
          />

          {/* Send button */}
          <SendButton
            disabled={(!message.trim() && !imageData) || isLoading || !isKeySet}
            isLoading={isLoading}
            isKeySet={isKeySet}
            hasContent={Boolean(message.trim() || imageData)}
          />
        </div>
      </BlurContainer>
    </form>
  );
};

export default ChatInput;
