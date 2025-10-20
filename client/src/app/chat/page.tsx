"use client";

import React, { useState, useRef, useEffect } from "react";
import { Logo } from "@/components/icons/logo";
import { Heading } from "@/components/ui/heading/heading";
import { Text } from "@/components/ui/text/text";
import { MessageBubble, type Message } from "@/components/chat/message-bubble";
import { ChatInput } from "@/components/chat/chat-input";
import { SessionSidebar, type Session } from "@/components/chat/session-sidebar";
import { Button } from "@/components/ui/button/button";
import { Menu, X, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ChatPage() {
  const [sessions, setSessions] = useState<Session[]>([
    {
      id: "session-1",
      title: "新对话 1",
      lastMessage: "你好，有什么可以帮助你的吗？",
      updatedAt: new Date(Date.now() - 1000 * 60 * 5),
    },
  ]);
  const [activeSessionId, setActiveSessionId] = useState("session-1");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "msg-1",
      role: "assistant",
      content: "你好！我是 HappyWoods AI 助手。有什么可以帮助你的吗？",
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send message with SSE streaming
  const handleSendMessage = async (text: string) => {
    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // Create assistant message placeholder
    const assistantMessageId = `msg-${Date.now()}-assistant`;
    const assistantMessage: Message = {
      id: assistantMessageId,
      role: "assistant",
      content: "",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, assistantMessage]);
    setStreamingMessageId(assistantMessageId);

    try {
      // Create abort controller for this request
      abortControllerRef.current = new AbortController();

      const response = await fetch("http://localhost:8000/api/v1/chat/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": "dev-test-key-123",
        },
        body: JSON.stringify({
          message: text,
          session_id: activeSessionId,
          stream: true,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("Response body is not readable");
      }

      let accumulatedContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.type === "delta" && data.content) {
                accumulatedContent += data.content;
                // Update message content
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === assistantMessageId
                      ? { ...msg, content: accumulatedContent }
                      : msg
                  )
                );
              } else if (data.type === "end") {
                // Streaming complete
                break;
              } else if (data.type === "error") {
                throw new Error(data.content || "Stream error");
              }
            } catch (e) {
              // Ignore JSON parse errors for partial chunks
              if (e instanceof SyntaxError) continue;
              throw e;
            }
          }
        }
      }

      // Update session last message
      setSessions((prev) =>
        prev.map((session) =>
          session.id === activeSessionId
            ? {
                ...session,
                lastMessage: accumulatedContent.slice(0, 50) + "...",
                updatedAt: new Date(),
              }
            : session
        )
      );
    } catch (error: any) {
      if (error.name === "AbortError") {
        console.log("Request was cancelled");
      } else {
        console.error("Chat error:", error);
        // Show error message
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? {
                  ...msg,
                  content: "抱歉，发生了错误。请稍后重试。\n\n错误信息: " + error.message,
                }
              : msg
          )
        );
      }
    } finally {
      setIsLoading(false);
      setStreamingMessageId(null);
      abortControllerRef.current = null;
    }
  };

  // Handle new session
  const handleNewSession = () => {
    const newSessionId = `session-${Date.now()}`;
    const newSession: Session = {
      id: newSessionId,
      title: `新对话 ${sessions.length + 1}`,
      updatedAt: new Date(),
    };
    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(newSessionId);
    setMessages([
      {
        id: `msg-${Date.now()}`,
        role: "assistant",
        content: "你好！我是 HappyWoods AI 助手。有什么可以帮助你的吗？",
        timestamp: new Date(),
      },
    ]);
  };

  // Handle session selection
  const handleSelectSession = (sessionId: string) => {
    setActiveSessionId(sessionId);
    // In a real app, load messages from backend
    // For now, just show welcome message
    setMessages([
      {
        id: `msg-${Date.now()}`,
        role: "assistant",
        content: "你好！我是 HappyWoods AI 助手。有什么可以帮助你的吗？",
        timestamp: new Date(),
      },
    ]);
  };

  // Handle session deletion
  const handleDeleteSession = async (sessionId: string) => {
    try {
      await fetch(`http://localhost:8000/api/v1/session/${sessionId}`, {
        method: "DELETE",
        headers: {
          "X-API-Key": "dev-test-key-123",
        },
      });

      setSessions((prev) => prev.filter((s) => s.id !== sessionId));

      // If deleting active session, switch to another or create new
      if (sessionId === activeSessionId) {
        const remaining = sessions.filter((s) => s.id !== sessionId);
        if (remaining.length > 0) {
          handleSelectSession(remaining[0].id);
        } else {
          handleNewSession();
        }
      }
    } catch (error) {
      console.error("Delete session error:", error);
    }
  };

  // Handle voice recording
  const handleStartRecording = () => {
    setIsRecording(true);
    // TODO: Implement actual audio recording
    console.log("Start recording");
  };

  const handleStopRecording = async () => {
    setIsRecording(false);
    // TODO: Implement STT API call
    console.log("Stop recording");
  };

  // Handle TTS playback
  const handlePlayAudio = async (text: string) => {
    try {
      const response = await fetch(
        "http://localhost:8000/api/v1/voice/tts/synthesize",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-API-Key": "dev-test-key-123",
          },
          body: JSON.stringify({
            text,
            voice: "x5_lingxiaoxuan_flow",
            format: "mp3",
          }),
        }
      );

      if (!response.ok) {
        throw new Error("TTS request failed");
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play();
    } catch (error) {
      console.error("TTS error:", error);
    }
  };

  return (
    <div className="flex h-screen bg-[var(--surface-base)]">
      {/* Sidebar */}
      <div
        className={cn(
          "transition-all duration-300 ease-in-out",
          isSidebarOpen ? "w-64" : "w-0",
          "overflow-hidden"
        )}
      >
        <SessionSidebar
          sessions={sessions}
          activeSessionId={activeSessionId}
          onSelectSession={handleSelectSession}
          onNewSession={handleNewSession}
          onDeleteSession={handleDeleteSession}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b border-[var(--border-subtle)] bg-[var(--surface-elevated)] px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="text"
                size="icon"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                {isSidebarOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </Button>
              <Logo size="sm" withGlow />
              <div>
                <Heading level="h4" className="text-base">
                  HappyWoods AI
                </Heading>
                <Text variant="body-sm" className="text-[var(--text-secondary)]">
                  智能对话助手
                </Text>
              </div>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-6 py-8">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center max-w-2xl mx-auto">
              <Sparkles className="w-16 h-16 text-[var(--interactive-primary)] mb-6" />
              <Heading level="h2" className="mb-4">
                Welcome to HappyWoods AI
              </Heading>
              <Text variant="body-lg" className="text-[var(--text-secondary)]">
                Start a conversation with our intelligent assistant.
                Ask me anything!
              </Text>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto">
              {messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  isStreaming={streamingMessageId === message.id}
                  onPlayAudio={handlePlayAudio}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <ChatInput
          onSendMessage={handleSendMessage}
          onStartRecording={handleStartRecording}
          onStopRecording={handleStopRecording}
          isRecording={isRecording}
          isLoading={isLoading}
          placeholder="输入消息..."
        />
      </div>
    </div>
  );
}
