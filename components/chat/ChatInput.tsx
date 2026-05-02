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
import { dummyModels, dummyProviders } from "@/lib/dummy-data";

interface ChatInputProps {
  onSend: (content: string) => void;
  selectedProvider: string;
  setSelectedProvider: (id: string) => void;
  selectedModel: string;
  setSelectedModel: (id: string) => void;
}

export function ChatInput({
  onSend,
  selectedProvider,
  setSelectedProvider,
  selectedModel,
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
    (m) => m.providerId === selectedProvider,
  );

  return (
    <div className="w-full max-w-3xl mx-auto bg-transparent">
      <div className="z-10 shadow-xl bg-card border border-border rounded-2xl focus-within:ring-2 focus-within:ring-ring/50 transition-all">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything..."
          className="w-full max-h-64 min-h-[60px] bg-transparent resize-none p-4 outline-none text-sm placeholder:text-muted-foreground"
          rows={1}
          style={{ height: "auto" }}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = "auto";
            target.style.height = `${target.scrollHeight}px`;
          }}
        />

        <div className="flex flex-wrap items-center justify-between p-2 pt-0 gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-full"
            >
              <IconLink size={16} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-full"
            >
              <IconSearch size={16} />
            </Button>

            <div className="h-4 w-px bg-border mx-1" />

            <Select
              value={selectedProvider}
              onValueChange={(val) => val && setSelectedProvider(val)}
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

            <Select
              value={selectedModel}
              onValueChange={(val) => val && setSelectedModel(val)}
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
            className="h-8 w-8 rounded-full"
          >
            <IconSend size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}
