"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Bot, User, Volume2 } from "lucide-react";
import { Text } from "@/components/ui/text/text";
import { Button } from "@/components/ui/button/button";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface MessageBubbleProps {
  message: Message;
  isStreaming?: boolean;
  onPlayAudio?: (text: string) => void;
}

/**
 * MessageBubble Component
 * Displays a chat message with appropriate styling for user/assistant
 * Supports streaming animation and TTS playback
 */
export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isStreaming = false,
  onPlayAudio,
}) => {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "flex gap-3 mb-4",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {/* Avatar - Assistant only */}
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--interactive-primary)] flex items-center justify-center">
          <Bot className="w-5 h-5 text-white" />
        </div>
      )}

      {/* Message Content */}
      <div
        className={cn(
          "max-w-[70%] rounded-[var(--radius-lg)] px-4 py-3 relative group",
          isUser
            ? "bg-[var(--interactive-primary)] text-white"
            : "bg-[var(--surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)]"
        )}
      >
        <Text
          variant="body"
          className={cn(
            "whitespace-pre-wrap break-words",
            isUser ? "text-white" : "text-[var(--text-primary)]"
          )}
        >
          {message.content}
          {isStreaming && (
            <motion.span
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="inline-block w-1.5 h-4 ml-1 bg-current"
            />
          )}
        </Text>

        {/* TTS Button - Assistant only */}
        {!isUser && !isStreaming && onPlayAudio && (
          <Button
            variant="text"
            size="sm"
            className="absolute -bottom-8 right-0 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => onPlayAudio(message.content)}
            leftIcon={<Volume2 className="w-3 h-3" />}
          >
            朗读
          </Button>
        )}
      </div>

      {/* Avatar - User only */}
      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--color-neutral-300)] flex items-center justify-center">
          <User className="w-5 h-5 text-[var(--text-primary)]" />
        </div>
      )}
    </motion.div>
  );
};
