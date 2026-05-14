"use client";

import { IconSend, IconLink, IconSearch } from "@tabler/icons-react";
import { createConversation } from "@/actions/conversation.action";
import { useChatStore } from "@/store/useChatStore";
import { Provider } from "@/types/provider.type";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth-client";
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

interface ChatInputProps {
  stop?: () => void;
  models?: Model[];
  errorModels: Error | null;
  loadingModels: boolean;
  isLoading?: boolean;
  providers?: Provider[] | [];
  sendMessage: (
    message: { text: string },
    options?: { body?: object },
  ) => Promise<void>;
}

export function ChatInput({
  stop,
  models,
  errorModels,
  loadingModels,
  isLoading,
  sendMessage,
  providers,
}: ChatInputProps) {
  const { data: session } = useSession();
  const {
    input,
    setInput,
    conversations,
    setConversations,
    selectedModelId,
    setSelectedModelId,
    selectedProviderId,
    selectedConversationId,
    setSelectedConversationId,
  } = useChatStore();

  useEffect(() => {
    if (!models) return;

    const isCurrentModelValid = models.some((m) => m.id === selectedModelId);

    if (models.length > 0) {
      if (!selectedModelId || !isCurrentModelValid) {
        setSelectedModelId(models[0].id);
      }
    } else {
      if (selectedModelId !== null) {
        setSelectedModelId(null);
      }
    }
  }, [models, selectedModelId, setSelectedModelId]);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) {
      console.error("Please enter a message");
      return;
    }

    if (!selectedProviderId || !selectedModelId) {
      console.error("Please select a provider and model");
      return;
    }

    let convId = selectedConversationId;
    if (!convId) {
      const title = input.slice(0, 50) + (input.length > 50 ? "..." : "");
      if (session?.user && selectedProviderId) {
        try {
          const created = await createConversation({
            title,
            providerId: selectedProviderId,
            modelId: selectedModelId,
          });
          convId = created._id;

          setConversations([
            {
              id: convId,
              userId: created.userId || "",
              title,
              messages: [],
              providerId: selectedProviderId,
              modelId: selectedModelId,
            },
            ...conversations,
          ]);
        } catch (_err) {
          console.error("Failed to create conversation:", _err);
          return;
        }
      } else {
        convId = crypto.randomUUID();
        setConversations([
          {
            id: convId,
            userId: session?.user?.id || "",
            title,
            messages: [],
            providerId: selectedProviderId,
            modelId: selectedModelId,
          },
          ...conversations,
        ]);
      }
      setSelectedConversationId(convId);
    }

    const activeProvider =
      providers?.find((p) => p.id === selectedProviderId) || null;

    await sendMessage(
      { text: input.trim() },
      {
        body: {
          provider: activeProvider?.label,
          model: selectedModelId,
        },
      },
    );
    setInput("");
  };

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
                value={selectedModelId || null}
                onValueChange={(val) => {
                  const activeModel = models?.find((m) => m.id === val);
                  if (!activeModel) return;
                  setSelectedModelId(activeModel.id);
                }}
                disabled={models?.length === 0}
              >
                <SelectTrigger className="w-32 sm:w-48 h-8 bg-transparent border-none shadow-none text-xs hover:bg-accent hover:text-white focus-visible:ring-0">
                  <SelectValue
                    placeholder={models?.length === 0 ? "No models" : "Model"}
                  >
                    {models?.find((m) => m.id === selectedModelId)?.name}
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
