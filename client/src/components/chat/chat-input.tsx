"use client";

import React, { useState, useRef, KeyboardEvent } from "react";
import { Button } from "@/components/ui/button/button";
import { Send, Mic, MicOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onStartRecording?: () => void;
  onStopRecording?: () => void;
  isRecording?: boolean;
  isLoading?: boolean;
  placeholder?: string;
}

/**
 * ChatInput Component
 * Text input with send button and voice recording
 * Supports Enter to send, Shift+Enter for new line
 */
export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  onStartRecording,
  onStopRecording,
  isRecording = false,
  isLoading = false,
  placeholder = "输入消息...",
}) => {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim());
      setMessage("");
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    // Auto-resize textarea
    e.target.style.height = "auto";
    e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`;
  };

  const handleVoiceToggle = () => {
    if (isRecording && onStopRecording) {
      onStopRecording();
    } else if (!isRecording && onStartRecording) {
      onStartRecording();
    }
  };

  return (
    <div className="border-t border-[var(--border-subtle)] bg-[var(--surface-elevated)] p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-end gap-2">
          {/* Voice Recording Button */}
          {(onStartRecording || onStopRecording) && (
            <Button
              variant={isRecording ? "primary" : "secondary"}
              size="icon"
              onClick={handleVoiceToggle}
              disabled={isLoading}
              className={cn(
                "flex-shrink-0",
                isRecording && "animate-pulse"
              )}
            >
              {isRecording ? (
                <MicOff className="w-5 h-5" />
              ) : (
                <Mic className="w-5 h-5" />
              )}
            </Button>
          )}

          {/* Text Input */}
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={isLoading || isRecording}
              rows={1}
              className={cn(
                "w-full resize-none rounded-[var(--radius-md)]",
                "border border-[var(--border-default)]",
                "bg-[var(--surface-base)]",
                "text-[var(--text-primary)]",
                "px-4 py-3 pr-12",
                "focus:outline-none focus:ring-2 focus:ring-[var(--interactive-primary)] focus:border-transparent",
                "placeholder:text-[var(--text-tertiary)]",
                "transition-all duration-200",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
              style={{
                minHeight: "48px",
                maxHeight: "200px",
              }}
            />
          </div>

          {/* Send Button */}
          <Button
            variant="primary"
            size="icon"
            onClick={handleSend}
            disabled={!message.trim() || isLoading || isRecording}
            isLoading={isLoading}
            className="flex-shrink-0"
          >
            {!isLoading && <Send className="w-5 h-5" />}
          </Button>
        </div>

        {/* Hint Text */}
        {!isRecording && (
          <p className="mt-2 text-xs text-[var(--text-tertiary)] text-center">
            按 Enter 发送，Shift + Enter 换行
          </p>
        )}
        {isRecording && (
          <p className="mt-2 text-xs text-[var(--interactive-primary)] text-center animate-pulse">
            正在录音...
          </p>
        )}
      </div>
    </div>
  );
};
