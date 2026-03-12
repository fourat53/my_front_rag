"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IconSend, IconPlayerStop } from "@tabler/icons-react";
import { useState, useRef } from "react";

export default function ChatV2Page() {
  const [question, setQuestion] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  async function RespondToUser() {
    if (isGenerating) return;
    setResponse("");
    setIsGenerating(true);

    abortControllerRef.current = new AbortController();

    try {
      const result = await fetch("/api/llama/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-requested-from": "frontend",
        },
        body: JSON.stringify({
          question: question,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!result.body) {
        throw new Error("No response body");
      }

      const reader = result.body.getReader();
      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;

        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          setResponse((prev) => prev + chunk);
        }
      }
    } catch (e: any) {
      if (e.name === "AbortError") {
        console.log("Response generation stopped.");
      } else {
        console.error(e);
        setResponse((prev) => prev + "\nError connecting to the chat API.");
      }
    } finally {
      setIsGenerating(false);
      abortControllerRef.current = null;
    }
  }

  function handleStop() {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setResponse("");
    }
  }

  return (
    <div className="pt-6 flex flex-col items-center">
      <div className="relative flex gap-2 w-1/2">
        <Input
          placeholder="Type your message..."
          className="pr-10"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          disabled={isGenerating}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !isGenerating && question.trim()) {
              e.preventDefault();
              RespondToUser();
            }
          }}
        />
        <Button
          icon={<IconSend />}
          className={"p-2.5 z-20 absolute right-0"}
          onClick={() => RespondToUser()}
          disabled={isGenerating || !question.trim()}
        />
      </div>

      <div className="pt-6 w-1/2 space-y-2 relative">
        <p>Response</p>
        <div className="bg-sidebar border overflow-y-auto w-full h-[calc(100vh-16rem)] rounded-lg p-4">
          <div className="whitespace-pre-wrap">{response}</div>
        </div>
        {isGenerating && (
          <Button
            className="absolute bottom-4 right-4 z-10 shadow-md bg-red-500 hover:bg-red-600 text-white flex items-center gap-2"
            onClick={handleStop}
          >
            <IconPlayerStop size={16} /> Stop
          </Button>
        )}
      </div>
    </div>
  );
}
