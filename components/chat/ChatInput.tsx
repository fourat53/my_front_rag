"use client";

import { IconSend, IconLink, IconSearch } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from "@/components/ui/select";
import { useChatStore } from "@/store/useChatStore";
import { fetchModelsFromProvider } from "@/actions/model";
import { useEffect } from "react";
import { createConversation } from "@/actions/conversation";
import { useSession } from "@/lib/auth-client";

interface ChatInputProps {
  isLoading?: boolean;
  stop?: () => void;
  sendMessage: (message: { text: string }, options?: { body?: object }) => Promise<void>;
}

export function ChatInput({ isLoading, stop, sendMessage }: ChatInputProps) {
  const { data: session } = useSession();
  const {
    input,
    setInput,
    conversations,
    setConversations,
    models,
    setModels,
    selectedModel,
    setSelectedModel,
    loadingModels,
    setLoadingModels,
    selectedProvider,
    selectedConversationId,
    setSelectedConversationId,
  } = useChatStore();

  useEffect(() => {
    async function loadModels() {
      try {
        setLoadingModels(true);
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
        setLoadingModels(false);
      }
    }
    loadModels();
  }, [selectedProvider, setSelectedModel, setModels, setLoadingModels]);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) {
      console.error("Please enter a message");
      return;
    }

    if (!selectedProvider || !selectedModel) {
      console.error("Please select a provider and model");
      return;
    }

    let convId = selectedConversationId;
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

          setConversations([
            {
              _id: created._id,
              userId: created.userId || "",
              title,
              updatedAt: new Date().toISOString(),
              messages: [],
              providerId: selectedProvider,
              modelId: selectedModel.id,
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
            _id: convId,
            userId: session?.user?.id || "",
            title,
            updatedAt: new Date().toISOString(),
            messages: [],
            providerId: selectedProvider,
            modelId: selectedModel.id,
          },
          ...conversations,
        ]);
      }
      setSelectedConversationId(convId);
    }

    await sendMessage(
      { text: input.trim() },
      { body: { provider: selectedProvider, model: selectedModel.id } }
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
    <form
      onSubmit={handleSubmit}
      className="mx-auto w-full max-w-3xl rounded-3xl border shadow-xl transition-all bg-card border-border focus-within:ring-2 focus-within:ring-ring/50"
    >
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask anything..."
        className="w-full max-h-64 min-h-15 resize-none p-4 outline-none text-sm placeholder:text-muted-foreground"
        rows={1}
        style={{ height: "auto" }}
        onInput={(e) => {
          const target = e.target as HTMLTextAreaElement;
          target.style.height = "auto";
          target.style.height = `${target.scrollHeight}px`;
        }}
      />

      <div className="flex flex-wrap gap-2 justify-between items-center p-2 pt-0">
        <div className="flex flex-wrap gap-2 items-center">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full size-9 text-muted-foreground hover:text-foreground"
          >
            <IconLink size={20} />
          </Button>

          <div className="mx-px w-px h-4 bg-border" />

          <Button
            variant="ghost"
            size="icon"
            className="rounded-full size-9 text-muted-foreground hover:text-foreground"
          >
            <IconSearch size={20} />
          </Button>

          <div className="mx-px w-px h-4 bg-border" />

          {loadingModels ? (
            <div className="w-48 h-8 bg-muted rounded-full animate-pulse" />
          ) : (
            <Select
              value={selectedModel?.id || ""}
              onValueChange={(val) => {
                const model = models.find((m) => m.id === val);
                if (model) {
                  setSelectedModel(model);
                }
              }}
              disabled={models.length === 0}
            >
              <SelectTrigger className="w-48 h-8 bg-transparent border-none shadow-none text-xs hover:bg-accent hover:text-white focus-visible:ring-0">
                <SelectValue
                  placeholder={models.length === 0 ? "No models" : "Model"}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Models</SelectLabel>
                  {models.map((m, index) => (
                    <SelectItem key={index} value={m.id}>
                      <p title={m.name} className="truncate max-w-38">
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
  );
}
