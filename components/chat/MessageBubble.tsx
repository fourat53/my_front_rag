"use client";

import { IconRobot, IconCopy, IconEdit, IconUser } from "@tabler/icons-react";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { ComponentPropsWithoutRef } from "react";
import { Button } from "@/components/ui/button";
import { Message } from "@/lib/dummy-data";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Image from "next/image";
import clsx from "clsx";

interface MessageBubbleProps {
  message: Message;
  userImage?: string | null;
}

export function MessageBubble({ message, userImage }: MessageBubbleProps) {
  const isUser = message.role === "user";

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
  };

  return (
    <div className="flex flex-col gap-1 rounded-2xl w-full max-w-3xl mx-auto group transition-colors">
      <div className="flex-1 space-y-2 min-w-0">
        <div className="prose prose-sm dark:prose-invert max-w-none prose-pre:p-0 prose-pre:bg-transparent prose-p:leading-relaxed">
          {isUser ? (
            <div className="w-full flex justify-end gap-2">
              <div className="whitespace-pre-wrap p-5 bg-card shadow-sm border-2 border-border rounded-2xl">
                {message.content}
              </div>
              <div className="size-8 rounded-full bg-primary/20 text-primary flex items-center justify-center overflow-hidden">
                {userImage ? (
                  <Image
                    src={userImage}
                    alt="User"
                    className="object-cover"
                    width={32}
                    height={32}
                  />
                ) : (
                  <IconUser size={18} />
                )}
              </div>
            </div>
          ) : (
            <div className="flex gap-2">
              <div className="min-w-8 size-8 rounded-full bg-foreground text-background flex items-center justify-center">
                <IconRobot size={16} />
              </div>
              <div className="w-full">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code(
                      props: ComponentPropsWithoutRef<"code"> & {
                        inline?: boolean;
                        node?: unknown;
                      },
                    ) {
                      const {
                        children,
                        className,
                        node: _node,
                        ...rest
                      } = props;
                      const match = /language-(\\w+)/.exec(className || "");
                      return match ? (
                        <div className="rounded-lg overflow-hidden my-4 border border-border">
                          <SyntaxHighlighter
                            {...rest}
                            PreTag="div"
                            language={match[1]}
                            style={vscDarkPlus}
                            customStyle={{
                              margin: 0,
                              padding: "1rem",
                              background: "transparent",
                            }}
                          >
                            {String(children).replace(/\\n$/, "")}
                          </SyntaxHighlighter>
                        </div>
                      ) : (
                        <div className="my-2 bg-card/65 shadow-sm border border-border px-4.5 py-3 rounded-2xl">
                          <code
                            {...rest}
                            className="rounded-md text-sm font-mono"
                          >
                            {children}
                          </code>
                        </div>
                      );
                    },
                    strong({ children }) {
                      return (
                        <strong className="font-bold text-foreground text-[1.05em]">
                          {children}
                        </strong>
                      );
                    },
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      </div>
      <div
        className={clsx(
          "shrink-0 flex justify-end items-center opacity-0 group-hover:opacity-100 transition-opacity",
          isUser ? "pr-10" : "pl-1.5",
        )}
      >
        {isUser && (
          <Button
            variant="ghost"
            size="icon"
            className="size-8 p-0.5 hover:bg-secondary/80 dark:hover:bg-secondary/70"
          >
            <IconEdit size={16} />
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="size-8 p-0.5 hover:bg-secondary/80 dark:hover:bg-secondary/70"
          onClick={handleCopy}
        >
          <IconCopy size={16} />
        </Button>
      </div>
    </div>
  );
}
