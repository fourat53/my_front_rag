"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { ChatInput } from "@/components/chat/ChatInput";
import { Conversation } from "@/types/conversation";
import { useSession } from "@/lib/auth-client";
import { Message } from "@/types/message";
import { useChat } from "@ai-sdk/react";
import { Model, PROVIDERS } from "@/types/model";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import {
  getConversations,
  createConversation,
  updateConversation,
  deleteConversation,
} from "@/actions/conversation";
import ChatHeader from "@/components/chat/ChatHeader";
import { TextStreamChatTransport, type UIMessage } from "ai";
import { fetchModelsFromProvider } from "@/actions/model";

type ChatMessage = UIMessage<{ createdAt?: string }>;

function extractContent(msg: ChatMessage): string {
  const fromParts = Array.isArray(msg.parts)
    ? msg.parts
        .filter((p) => p.type === "text")
        .map((p) => (p.type === "text" ? p.text : ""))
        .join("")
    : "";

  const legacyContent = (msg as unknown as { content?: string }).content ?? "";
  return fromParts || legacyContent;
}

function mapToMessage(msg: ChatMessage): Message {
  return {
    id: msg.id,
    role: msg.role as "user" | "assistant",
    content: extractContent(msg),
    timestamp: msg.metadata?.createdAt ?? new Date().toISOString(),
  };
}

export default function HomePage() {
  const { data: session } = useSession();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [activeConvId, setActiveConvId] = useState<string>("");
  const [input, setInput] = useState<string>("");
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<string>(
    PROVIDERS[0],
  );

  const lastPersistedCount = useRef(0);

  const llmSelectionRef = useRef({
    provider: selectedProvider,
    modelId: selectedModel?.id ?? "",
  });
  useEffect(() => {
    llmSelectionRef.current = {
      provider: selectedProvider,
      modelId: selectedModel?.id ?? "",
    };
  }, [selectedProvider, selectedModel?.id]);

  useEffect(() => {
    async function loadModels() {
      try {
        setIsLoadingModels(true);
        const providerModels = await fetchModelsFromProvider(selectedProvider);
        setModels(providerModels);
        if (providerModels.length > 0) {
          setSelectedModel(providerModels[0]);
        } else {
          setSelectedModel(null);
        }
      } catch (err) {
        console.error("Failed to load models:", err);
      } finally {
        setIsLoadingModels(false);
      }
    }
    loadModels();
  }, [selectedProvider]);

  const handleInputChange = useCallback(
    (
      e:
        | React.ChangeEvent<HTMLTextAreaElement>
        | React.ChangeEvent<HTMLInputElement>,
    ) => {
      setInput(e.target.value);
    },
    [],
  );

  const transport = useMemo(
    () =>
      // eslint-disable-next-line react-hooks/refs
      new TextStreamChatTransport({
        api: "/api/llm/query",
        prepareSendMessagesRequest: ({ body, messages }) => ({
          body: {
            ...body,
            messages,
            provider: llmSelectionRef.current.provider,
            model: llmSelectionRef.current.modelId,
          },
        }),
      }),
    [],
  );

  const { messages, setMessages, stop, sendMessage, status } =
    useChat<ChatMessage>({
      transport,
      onError: (err: unknown) => {
        console.error("Chat error:", err);
      },
    });

  const isLoading = status === "submitted" || status === "streaming";

  useEffect(() => {
    if (
      status === "ready" &&
      messages.length > 0 &&
      messages.length > lastPersistedCount.current &&
      session?.user &&
      activeConvId
    ) {
      lastPersistedCount.current = messages.length;
      updateConversation(activeConvId, {
        messages: (messages as ChatMessage[]).map(mapToMessage),
      }).catch(console.error);
    }
  }, [status, messages, session, activeConvId]);

  useEffect(() => {
    if (session?.user) {
      getConversations().then((data) => {
        const mapped = data.map((c) => ({
          _id: c._id,
          userId: c.userId,
          title: c.title,
          updatedAt: c.updatedAt,
          messages: c.messages,
          providerId: c.providerId,
          modelId: c.modelId,
        }));
        setConversations(mapped as Conversation[]);
      });
    }
  }, [session]);

  const handleSelectConversation = useCallback(
    (id: string) => {
      if (!id) {
        setActiveConvId("");
        setMessages([]);
        return;
      }
      const conv = conversations.find((c) => c._id === id);
      if (conv) {
        setActiveConvId(conv._id);
        setMessages(
          conv.messages.map((m) => ({
            id: m.id,
            role: m.role,
            parts: [{ type: "text", text: m.content }],
            metadata: { createdAt: m.timestamp },
          })) as unknown as ChatMessage[],
        );
        setSelectedProvider(
          PROVIDERS.find((p) => p === conv.providerId) || PROVIDERS[0],
        );
        const model = models.find((m) => m.id === conv.modelId);
        if (model) setSelectedModel(model);
      }
    },
    [conversations, setMessages, models],
  );

  const handleDeleteConv = async (id: string) => {
    if (session?.user) {
      await deleteConversation(id);
      setConversations((prev) => prev.filter((c) => c._id !== id));
    } else {
      setConversations((prev) => prev.filter((c) => c._id !== id));
    }
    if (activeConvId === id) {
      setActiveConvId("");
      setMessages([]);
    }
  };

  const onSubmitWrapper = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) {
      console.error("Please enter a message");
      return;
    }

    if (!selectedProvider || !selectedModel) {
      console.error("Please select a provider and model");
      return;
    }

    let convId = activeConvId;
    if (!convId) {
      const title = input.slice(0, 50) + (input.length > 50 ? "..." : "");
      if (session?.user) {
        try {
          const created = await createConversation({
            title,
            providerId: selectedProvider,
            modelId: selectedModel.id,
          });
          convId = created._id;

          setConversations((prev) => [
            {
              _id: created._id,
              userId: created.userId || "",
              title,
              updatedAt: new Date().toISOString(),
              messages: [],
              providerId: selectedProvider,
              modelId: selectedModel.id,
            },
            ...prev,
          ]);
        } catch (_err) {
          console.error("Failed to create conversation:", _err);
          return;
        }
      } else {
        convId = crypto.randomUUID();
        setConversations((prev) => [
          {
            _id: convId,
            userId: session?.user?.id || "",
            title,
            updatedAt: new Date().toISOString(),
            messages: [],
            providerId: selectedProvider,
            modelId: selectedModel.id,
          },
          ...prev,
        ]);
      }
      setActiveConvId(convId);
    }

    await sendMessage({ text: input.trim() });
    setInput("");
  };

  return (
    <SidebarProvider className="flex overflow-hidden w-full h-screen bg-background">
      <ChatSidebar
        activeId={activeConvId}
        conversations={conversations}
        onSelect={handleSelectConversation}
        onDelete={handleDeleteConv}
      />

      <SidebarInset className="flex relative flex-col flex-1 h-full bg-transparent">
        <ChatHeader
          activeConvId={activeConvId}
          conversations={conversations}
          selectedProvider={selectedProvider}
          setSelectedProvider={setSelectedProvider}
        />
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
            input={input}
            isLoading={isLoading}
            handleSubmit={onSubmitWrapper}
            availableModels={models}
            isLoadingModels={isLoadingModels}
            selectedModel={selectedModel}
            setSelectedModel={setSelectedModel}
            handleInputChange={handleInputChange}
          />
          <div className="z-20 text-center py-2.5 text-xs text-muted-foreground">
            AI can make mistakes. Consider verifying important information.
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
