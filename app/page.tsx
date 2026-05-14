"use client";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { updateConversation } from "@/actions/conversation.action";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { Message, ChatRole } from "@/types/message.type";
import { getProviders } from "@/actions/provider.action";
import { ChatInput } from "@/components/chat/ChatInput";
import ChatHeader from "@/components/chat/ChatHeader";
import { useChatStore } from "@/store/useChatStore";
import { useEffect, useMemo, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "@/lib/auth-client";
import { TextStreamChatTransport } from "ai";
import { useChat } from "@ai-sdk/react";
import { Model } from "@/types/model.type";

function mapToMessage(msg: Message): Message {
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
    parts: msg.parts,
    content: fromParts || legacyContent,
  };
}

export default function HomePage() {
  const { data: session } = useSession();
  const { selectedConversationId, selectedProviderId } = useChatStore();
  const lastMessageLength = useRef(0);

  const { data: providers } = useQuery({
    queryKey: ["providers"],
    queryFn: () => getProviders(),
  });

  const activeProvider =
    providers?.find((p) => p.id === selectedProviderId) || null;

  const {
    data: models,
    isLoading: loadingModels,
    error: errorModels,
  } = useQuery({
    queryKey: ["models", activeProvider],
    queryFn: async () => {
      if (!activeProvider) return [];

      const models_url = `/api/llm/models?providerId=${activeProvider.label}`;
      const response = await fetch(models_url);

      if (!response.ok) throw new Error("Failed to load models");
      const data = await response.json();

      return (data.models || []) as Model[];
    },
    enabled: !!activeProvider,
  });

  const transport = useMemo(() => {
    return new TextStreamChatTransport({
      api: "/api/llm/query",
    });
  }, []);

  const { messages, setMessages, stop, sendMessage, status } = useChat<Message>(
    {
      transport,
      onError: (err) => {
        console.error("Chat error:", err);
      },
    },
  );

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
      <ChatSidebar
        setMessages={setMessages}
        providers={providers || []}
        models={models || []}
      />

      <SidebarInset className="flex relative flex-col flex-1 h-full bg-transparent">
        <ChatHeader providers={providers || []} />
        <div className="overflow-y-auto flex-1 pt-8 pb-5 space-y-2 rounded-t-xl border border-b-0 border-border bg-background">
          {messages.length > 0 ? (
            (messages as Message[]).map((msg, index) => (
              <MessageBubble key={index} message={mapToMessage(msg)} />
            ))
          ) : (
            <div className="flex flex-col justify-center items-center px-2 mx-auto space-y-4 max-w-md h-full text-center">
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
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
            models={models || []}
            loadingModels={loadingModels}
            errorModels={errorModels}
            isLoading={isLoading}
            providers={providers}
            sendMessage={sendMessage}
          />

          <div className="z-20 text-center p-2 text-xs text-muted-foreground">
            AI can make mistakes. Consider verifying important information.
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
