"use client";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useEffect, useMemo, useRef } from "react";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { updateConversation } from "@/actions/conversation";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { ChatInput } from "@/components/chat/ChatInput";
import ChatHeader from "@/components/chat/ChatHeader";
import { Message, ChatRole } from "@/models/Message";
import { useChatStore } from "@/store/useChatStore";
import { useSession } from "@/lib/auth-client";
import { ChatMessage } from "@/models/Message";
import { TextStreamChatTransport } from "ai";
import { useChat } from "@ai-sdk/react";

function mapToMessage(msg: ChatMessage): Message {
  const fromParts = Array.isArray(msg.parts)
    ? msg.parts
        .filter((p) => p.type === "text")
        .map((p) => (p.type === "text" ? p.text : ""))
        .join("")
    : "";

  const legacyContent = (msg as { content?: string }).content ?? "";

  return {
    id: msg.id,
    role: msg.role as ChatRole,
    content: fromParts || legacyContent,
    timestamp: msg.metadata?.createdAt ?? new Date().toISOString(),
  };
}

export default function HomePage() {
  const { data: session } = useSession();
  const { selectedConversationId } = useChatStore();

  const lastMessageLength = useRef(0);

  const transport = useMemo(() => {
    return new TextStreamChatTransport({
      api: "/api/llm/query",
    });
  }, []);

  const { messages, setMessages, stop, sendMessage, status } =
    useChat<ChatMessage>({
      transport,
      onError: (err: unknown) => {
        console.error("Chat error:", err);
      },
    });

  const isLoading = status === "submitted" || status === "streaming";

  useEffect(() => {
    const handleConversationUpdate = () => {
      try {
        if (
          status === "ready" &&
          messages.length > 0 &&
          messages.length > lastMessageLength.current &&
          session?.user &&
          selectedConversationId
        ) {
          lastMessageLength.current = messages.length;
          updateConversation(selectedConversationId, {
            messages: messages.map(mapToMessage),
          });
        }
      } catch (err) {
        console.error("Failed to update conversation:", err);
      }
    };
    handleConversationUpdate();
  }, [status, messages, session, selectedConversationId]);

  return (
    <SidebarProvider className="flex overflow-hidden w-full h-screen bg-background">
      <ChatSidebar setMessages={setMessages} />

      <SidebarInset className="flex relative flex-col flex-1 h-full bg-transparent">
        <ChatHeader />
        <div className="overflow-y-auto flex-1 px-4 pt-8 pb-5 space-y-2 rounded-t-xl border border-b-0 border-border bg-background">
          {messages.length > 0 ? (
            (messages as ChatMessage[]).map((msg, index: number) => (
              <MessageBubble
                key={msg.id || index}
                message={mapToMessage(msg)}
              />
            ))
          ) : (
            <div className="flex flex-col justify-center items-center mx-auto space-y-4 max-w-md h-full text-center">
              <h1 className="text-4xl font-bold tracking-tight">
                How can I help you today?
              </h1>
              <p className="text-muted-foreground">
                Select a provider and a model, then type a message to start a
                new conversation.
              </p>
            </div>
          )}
        </div>

        <div className="relative mb-4 w-full rounded-b-xl border border-t-0 border-border bg-background">
          <ChatInput
            stop={stop}
            isLoading={isLoading}
            sendMessage={sendMessage}
          />
          <div className="z-20 text-center py-2.5 text-xs text-muted-foreground">
            AI can make mistakes. Consider verifying important information.
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
