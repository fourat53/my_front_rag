"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { ChatInput } from "@/components/chat/ChatInput";
import { IconMenu2 } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { ChatSidebar } from "./ChatSidebar";
import {
  dummyConversations,
  dummyModels,
  dummyProviders,
  Message,
} from "@/lib/dummy-data";

interface SessionData {
  user: {
    name?: string | null;
    email: string;
    image?: string | null;
  };
}
export default function ChatLayout({
  session,
}: {
  session: SessionData | null;
}) {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [activeConvId, setActiveConvId] = useState<string>("");
  const [providerId, setProviderId] = useState<string>(dummyProviders[0].id);
  const [modelId, setModelId] = useState<string>(
    dummyModels.find((m) => m.providerId === dummyProviders[0].id)?.id || "",
  );

  const activeConv = dummyConversations.find((c) => c.id === activeConvId);

  const handleSelectConv = (id: string) => {
    setActiveConvId(id);
    const conv = dummyConversations.find((c) => c.id === id);
    if (conv) {
      setProviderId(conv.providerId);
      setModelId(conv.modelId);
    }
  };

  const handleProviderChange = (newProvider: string) => {
    setProviderId(newProvider);
    const newModel = dummyModels.find((m) => m.providerId === newProvider);
    if (newModel) {
      setModelId(newModel.id);
    }
  };

  const handleSend = () => {};

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <div
        className={cn(
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
          "transition-transform absolute md:relative z-40 h-full",
        )}
      >
        <ChatSidebar
          activeId={activeConvId}
          onSelect={handleSelectConv}
          session={session}
        />
      </div>

      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <div className="w-full flex items-center p-4 border-b border-border bg-card">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <IconMenu2 />
          </Button>
          <span className="ml-2 font-semibold text-lg">Chat AI</span>
        </div>

        <div className="px-4 flex-1 space-y-2 pt-8 pb-6 overflow-y-auto">
          {activeConv ? (
            activeConv.messages?.map((msg: Message) => (
              <MessageBubble
                key={msg.id}
                message={msg}
                userImage={session?.user?.image}
              />
            ))
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-4">
              <h1 className="text-4xl font-bold tracking-tight">
                How can I help you today?
              </h1>
              <p className="text-muted-foreground">
                Select a provider and a model below, then type a message to
                start a new conversation.
              </p>
            </div>
          )}
        </div>

        <div className="px-4 w-full bg-linear-to-t from-background via-background to-transparent">
          <ChatInput
            onSend={handleSend}
            selectedProvider={providerId}
            setSelectedProvider={handleProviderChange}
            selectedModel={modelId}
            setSelectedModel={setModelId}
          />
          <div className="text-center py-2.5 text-xs text-muted-foreground">
            AI can make mistakes. Consider verifying important information.
          </div>
        </div>
      </div>

      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
