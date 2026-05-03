"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IconSend, IconLink, IconSearch } from "@tabler/icons-react";
import { dummyModels } from "@/public/data/dummy-data";
import { Model, Provider } from "@/types/message";

interface ChatInputProps {
  onSend: (content: string) => void;
  selectedModel: Model;
  selectedProvider: Provider;
  setSelectedModel: (model: Model) => void;
}

export function ChatInput({
  onSend,
  selectedModel,
  selectedProvider,
  setSelectedModel,
}: ChatInputProps) {
  const [content, setContent] = useState("");

  const handleSend = () => {
    if (!content.trim()) return;
    onSend(content.trim());
    setContent("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const availableModels = dummyModels.filter(
    (m) => m.providerId === selectedProvider?.id,
  );

  return (
    <div className="mx-auto w-full max-w-3xl rounded-3xl border shadow-xl transition-all bg-card border-border focus-within:ring-2 focus-within:ring-ring/50">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask anything..."
        className="w-full max-h-64 min-h-[60px] resize-none p-4 outline-none text-sm placeholder:text-muted-foreground"
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

          <div className="mx-0.5 w-px h-4 bg-border" />

          <Button
            variant="ghost"
            size="icon"
            className="rounded-full size-9 text-muted-foreground hover:text-foreground"
          >
            <IconSearch size={20} />
          </Button>

          <div className="mx-0.5 w-px h-4 bg-border" />

          <Select
            value={selectedModel?.id}
            onValueChange={(val) => {
              const model = dummyModels.find((m) => m.id === val);
              if (model) {
                setSelectedModel(model);
              }
            }}
          >
            <SelectTrigger
              size="sm"
              className="w-fit max-w-[160px] h-8 bg-transparent border-none shadow-none text-xs hover:bg-accent hover:text-white focus-visible:ring-0"
            >
              <SelectValue placeholder="Model" />
            </SelectTrigger>
            <SelectContent>
              {availableModels.map((m) => (
                <SelectItem key={m.id} value={m.id}>
                  {m.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={handleSend}
          disabled={!content.trim()}
          size="icon"
          className="rounded-full size-9"
        >
          <IconSend size={16} />
        </Button>
      </div>
    </div>
  );
}
