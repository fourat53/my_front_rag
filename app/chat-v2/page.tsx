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
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            AI Assistant
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Ask me anything and I'll help you find the answer
          </p>
        </div>

        <div className="relative flex gap-3 w-full mb-6">
          <div className="flex-1 relative">
            <Input
              placeholder="Type your message here..."
              className="w-full py-6 pl-6 pr-16 text-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm h-16"
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
              className={`absolute right-2 top-1/2 transform -translate-y-1/2 h-12 w-12 ${question.trim() && !isGenerating ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-300 dark:bg-gray-600"} transition-colors`}
              onClick={() => RespondToUser()}
              disabled={isGenerating || !question.trim()}
            >
              <IconSend size={20} className="text-white" />
            </Button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
              Response
            </h2>
          </div>
          <div className="relative">
            <div className="bg-gray-50 dark:bg-gray-900/50 min-h-[50vh] max-h-[60vh] overflow-y-auto p-6">
              <div className="prose prose-gray dark:prose-invert max-w-none">
                {response ? (
                  <div className="whitespace-pre-wrap wrap-break-words text-gray-700 dark:text-gray-300 leading-relaxed">
                    <div
                      className="html-container"
                      dangerouslySetInnerHTML={{ __html: response }}
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400 italic">
                    {isGenerating
                      ? "Generating response..."
                      : "Your response will appear here..."}
                  </div>
                )}
              </div>
            </div>

            {isGenerating && (
              <div className="absolute bottom-4 right-4 z-10">
                <Button
                  className="shadow-lg bg-red-500 hover:bg-red-600 text-white flex items-center gap-2 px-4 py-2 transition-all duration-200 transform hover:scale-105"
                  onClick={handleStop}
                >
                  <IconPlayerStop size={16} />
                  <span>Stop</span>
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>
            Powered by advanced AI technology • Responses are generated in
            real-time
          </p>
        </div>
      </div>
    </div>
  );
}
