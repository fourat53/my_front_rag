"use client";

import { IconSend, IconLink, IconSearch } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Model } from "@/types/model";

interface ChatInputProps {
  input: string;
  handleSubmit: (e: React.SubmitEvent<HTMLFormElement>) => void;
  isLoading?: boolean;
  stop?: () => void;
  selectedModel: Model | null;
  setSelectedModel: (model: Model) => void;
  availableModels: Model[];
  isLoadingModels?: boolean;
  handleInputChange: (
    e:
      | React.ChangeEvent<HTMLTextAreaElement>
      | React.ChangeEvent<HTMLInputElement>,
  ) => void;
}

export function ChatInput({
  input,
  handleInputChange,
  handleSubmit,
  isLoading,
  stop,
  selectedModel,
  setSelectedModel,
  availableModels,
  isLoadingModels,
}: ChatInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
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
        onChange={handleInputChange}
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

          {isLoadingModels ? (
            <div className="w-48 h-8 bg-muted rounded-full animate-pulse" />
          ) : (
            <Select
              value={selectedModel?.id || ""}
              onValueChange={(val) => {
                const model = availableModels.find((m) => m.id === val);
                if (model) {
                  setSelectedModel(model);
                }
              }}
              disabled={availableModels.length === 0}
            >
              <SelectTrigger className="w-48 h-8 bg-transparent border-none shadow-none text-xs hover:bg-accent hover:text-white focus-visible:ring-0">
                <SelectValue
                  placeholder={
                    availableModels.length === 0 ? "No models" : "Model"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {availableModels.map((m, index) => (
                  <SelectItem key={index} value={m.id}>
                    <p title={m.name} className="truncate max-w-38">
                      {m.name}
                    </p>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        <Button
          type={isLoading ? "button" : "submit"}
          onClick={isLoading ? stop : undefined}
          size="icon"
          className="rounded-full size-9"
        >
          {isLoading ? (
            <div className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
          ) : (
            <IconSend size={16} />
          )}
        </Button>
      </div>
    </form>
  );
}
