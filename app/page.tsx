"use client";

import { MessageBubble } from "@/components/chat/MessageBubble";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { ChatInput } from "@/components/chat/ChatInput";
import { Message, Model, Provider } from "@/types/message";
import { useState } from "react";
import {
  dummyConversations,
  dummyModels,
  dummyProviders,
} from "@/public/data/dummy-data";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Conversation } from "@/types/conversation";

export default function HomePage() {
  const [activeConv, setActiveConv] = useState<Conversation | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<Provider>(
    dummyProviders[0],
  );
  const [selectedModel, setSelectedModel] = useState<Model>(
    dummyModels.find((m) => m.providerId === dummyProviders[0].id) ||
      dummyModels[0],
  );

  const handleSelectConv = (id: string) => {
    const conv = dummyConversations.find((c) => c.id === id);
    setActiveConv(conv || null);
    if (conv) {
      const provider = dummyProviders.find((p) => p.id === conv.providerId);
      if (provider) setSelectedProvider(provider);
      const model = dummyModels.find((m) => m.id === conv.modelId);
      if (model) setSelectedModel(model);
    }
  };

  const handleProviderChange = (newProvider: string) => {
    const provider = dummyProviders.find((p) => p.id === newProvider);
    if (provider) {
      setSelectedProvider(provider);
    }
    const newModel = dummyModels.find((m) => m.providerId === newProvider);
    if (newModel) {
      setSelectedModel(newModel);
    }
  };

  const handleSend = () => {};

  return (
    <SidebarProvider className="flex overflow-hidden w-full h-screen bg-background">
      <ChatSidebar
        activeId={activeConv?.id || ""}
        onSelect={handleSelectConv}
      />

      <SidebarInset className="flex relative flex-col flex-1 h-full bg-transparent">
        {/* Chat Header */}
        <div className="flex justify-between items-center px-4 w-full h-14">
          <div className="flex gap-2 items-center">
            <SidebarTrigger className="size-9" />
            <span className="ml-2 text-lg font-semibold">
              {activeConv?.title}
            </span>
          </div>
          <Select
            value={selectedProvider?.id}
            onValueChange={(val) => handleProviderChange(val || "")}
          >
            <SelectTrigger
              size="sm"
              className="w-fit max-w-[160px] h-8 bg-transparent border-none shadow-none text-xs hover:bg-accent hover:text-white focus-visible:ring-0"
            >
              <SelectValue placeholder="Provider" />
            </SelectTrigger>
            <SelectContent>
              {dummyProviders.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Chat Messages */}
        <div className="overflow-y-auto flex-1 px-4 pt-8 pb-5 space-y-2 rounded-t-xl border border-b-0 border-border bg-background">
          {activeConv ? (
            activeConv.messages?.map((msg: Message, index: number) => (
              <MessageBubble key={index} message={msg} />
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

        {/* Chat Input */}
        <div className="relative mb-4 w-full rounded-b-xl border border-t-0 border-border bg-background">
          <ChatInput
            onSend={handleSend}
            selectedModel={selectedModel}
            selectedProvider={selectedProvider}
            setSelectedModel={setSelectedModel}
          />
          <div className="z-20 text-center py-2.5 text-xs text-muted-foreground">
            AI can make mistakes. Consider verifying important information.
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
