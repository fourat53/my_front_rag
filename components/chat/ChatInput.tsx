"use client";

import { IconSend, IconLink, IconSearch } from "@tabler/icons-react";
import { createConversation } from "@/actions/conversation.action";
import { useChatStore } from "@/store/useChatStore";
import { Provider } from "@/types/provider.type";
import { Button } from "@/components/ui/button";
import { Conversation } from "@/types/conversation.type";
import { Model } from "@/types/model.type";
import { useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from "@/components/ui/select";
import { ChatStatus } from "ai";

interface ChatInputProps {
  stop?: () => void;
  models: Model[];
  errorModels: Error | null;
  loadingModels: boolean;
  status: ChatStatus;
  session: any;
  sendMessage: (
    message: { text: string },
    options?: { body?: object },
  ) => Promise<void>;
}

export function ChatInput({
  stop,
  status,
  models,
  errorModels,
  loadingModels,
  session,
  sendMessage,
}: ChatInputProps) {
  const {
    input,
    setInput,
    conversations,
    setConversations,
    selectedModel,
    setSelectedModel,
    selectedProvider,
    selectedConversation,
    setSelectedConversation,
  } = useChatStore();

  useEffect(() => {
    if (!models) return;

    const isCurrentModelValid = models.some((m) => m.id === selectedModel?.id);

    if (models.length > 0) {
      if (!selectedModel || !isCurrentModelValid) {
        setSelectedModel(models[0]);
      }
    } else {
      if (selectedModel !== null) {
        setSelectedModel(null);
      }
    }
  }, [models, selectedModel, setSelectedModel]);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || !selectedProvider || !selectedModel) return;

    let convId: string | undefined = selectedConversation?.id;
    if (convId) return;
    const title = input.slice(0, 50) + (input.length > 50 ? "..." : "");
    const providerId = selectedProvider.id;
    const modelId = selectedModel.id;
    let newConversation: Conversation;
    if (session?.user) {
      try {
        const created = await createConversation({
          title,
          providerId,
          modelId,
        });

        if (!created._id) return;

        convId = created._id;

        newConversation = {
          id: created._id,
          userId: created.userId || "",
          title,
          messages: [],
          providerId,
          modelId,
        };
        setConversations([newConversation, ...conversations]);
      } catch (_err) {
        console.error("Failed to create conversation:", _err);
        return;
      }
    } else {
      convId = crypto.randomUUID();
      newConversation = {
        id: convId,
        userId: session?.user?.id || "",
        title,
        messages: [],
        providerId,
        modelId,
      };
      setConversations([newConversation, ...conversations]);
    }
    setSelectedConversation(newConversation);

    await sendMessage(
      { text: input.trim() },
      {
        body: {
          provider: selectedProvider?.label,
          model: selectedModel.id,
        },
      },
    );
    setInput("");
  };

  const isLoading = status === "submitted" || status === "streaming";

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      setInput("");
      if (isLoading && stop) {
        stop();
      } else if (input) {
        handleSubmit(e as unknown as React.SubmitEvent<HTMLFormElement>);
      }
    }
  };

  return (
    <div className="px-4 sm:px-8 md:px-4 lg:px-8 md:mx-auto md:max-w-2xl lg:max-w-3xl">
      <form
        onSubmit={handleSubmit}
        className="pt-2 rounded-3xl border shadow-xl transition-all bg-sidebar border-border focus-within:ring-2 focus-within:ring-ring/50"
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything..."
          className="w-full max-h-96 min-h-15 resize-none p-4 outline-none text-sm placeholder:text-muted-foreground"
          rows={1}
          style={{ height: "auto" }}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = "auto";
            target.style.height = `${target.scrollHeight}px`;
          }}
        />

        <div className="pt-1 flex flex-wrap gap-2 justify-between items-center p-2">
          <div className="flex flex-wrap gap-2 items-center">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full size-8 sm:size-9 text-muted-foreground hover:text-foreground"
            >
              <IconLink size={20} />
            </Button>

            <div className="mx-px w-px h-4 bg-border" />

            <Button
              variant="ghost"
              size="icon"
              className="rounded-full size-8 sm:size-9 text-muted-foreground hover:text-foreground"
            >
              <IconSearch size={20} />
            </Button>

            <div className="mx-px w-px h-4 bg-border" />

            {loadingModels ? (
              <div className="w-32 sm:w-48 h-8 bg-muted rounded-full animate-pulse" />
            ) : errorModels ? (
              <div className="w-32 sm:w-48 h-8 text-xs text-red-500 flex items-center px-2">
                Failed to load models
              </div>
            ) : (
              <Select
                value={selectedModel?.id ?? ""}
                disabled={models.length === 0}
                onValueChange={(val) => {
                  setSelectedModel(models.find((m) => m.id === val) ?? null);
                }}
              >
                <SelectTrigger className="w-32 sm:w-48 h-8 bg-transparent border-none shadow-none text-xs hover:bg-accent hover:text-white focus-visible:ring-0">
                  <SelectValue
                    placeholder={models.length === 0 ? "No models" : "Model"}
                  >
                    {selectedModel?.name}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Models</SelectLabel>
                    {models?.map((m, index) => (
                      <SelectItem key={index} value={m.id}>
                        <p
                          title={m.name}
                          className="truncate max-w-26 sm:max-w-38"
                        >
                          {m.name}
                        </p>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          </div>

          <Button
            onClick={isLoading ? stop : undefined}
            disabled={!input || input.trim() === ""}
            loading={isLoading}
            icon={<IconSend size={16} />}
            size="icon"
            className="rounded-full size-9"
          />
        </div>
      </form>
    </div>
  );
}
