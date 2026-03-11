"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IconSend } from "@tabler/icons-react";
import { useState } from "react";

export default function ChatV2Page() {
  const [question, setQuestion] = useState<string>("");
  const [response, setResponse] = useState<string>("");

  async function RespondToUser() {
    setResponse(""); // clear previous response
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
    } catch (e) {
      console.error(e);
      setResponse("Error connecting to the chat API.");
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
        />
        <Button
          icon={<IconSend />}
          className={"p-2.5 z-20 absolute right-0"}
          onClick={() => RespondToUser()}
        />
      </div>

      <div className="pt-6 w-1/2 space-y-2">
        <p>Response</p>
        <div className="bg-sidebar border overflow-y-auto w-full h-[calc(100vh-16rem)] rounded-lg">
          {response}
        </div>
      </div>
    </div>
  );
}
