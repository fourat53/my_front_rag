"use client";

import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { IconRobot, IconCopy, IconEdit } from "@tabler/icons-react";
import { ComponentPropsWithoutRef } from "react";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth-client";
import ReactMarkdown from "react-markdown";
import { Message } from "@/models/Message";
import remarkGfm from "remark-gfm";
import Image from "next/image";
import clsx from "clsx";

export function MessageBubble({ message }: { message: Message }) {
  const { data: session } = useSession();
  const isUser = message.role === "user";

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="flex flex-col gap-1 px-5 mx-auto w-full max-w-3xl rounded-2xl transition-colors group">
      <div className="flex-1 space-y-2 min-w-0">
        <div className="max-w-none prose prose-sm dark:prose-invert prose-pre:p-0 prose-pre:bg-transparent prose-p:leading-relaxed">
          {isUser ? (
            <div className="flex gap-2 justify-end w-full">
              <div className="whitespace-pre-wrap px-4.5 py-3.5 bg-sidebar shadow-sm border-2 border-border rounded-2xl">
                {message.content}
              </div>
              <div className="flex overflow-hidden justify-center items-center rounded-full size-8">
                {session && session.user.image ? (
                  <Image
                    src={session.user.image}
                    alt="User avatar"
                    width={32}
                    height={32}
                  />
                ) : (
                  session &&
                  session.user.name && (
                    <p className="flex justify-center items-center text-base font-bold rounded-full size-8 bg-primary/20 text-primary">
                      {session.user.name?.[0].toUpperCase()}
                    </p>
                  )
                )}
              </div>
            </div>
          ) : (
            <div className="flex gap-2 pr-10">
              <div className="flex justify-center items-center rounded-full min-w-8 size-8 bg-foreground text-background">
                <IconRobot size={16} />
              </div>
              <div className="w-full">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    pre({ children }) {
                      const codeEl = children as React.ReactElement;
                      const codeProps: ComponentPropsWithoutRef<"code"> =
                        codeEl.props ?? {};
                      const codeClassName = codeProps.className ?? "";
                      const codeContent = String(
                        codeProps.children ?? "",
                      ).replace(/\n$/, "");
                      const match = /language-(\w+)/.exec(codeClassName);
                      if (match) {
                        return (
                          <div className="overflow-hidden my-4 rounded-lg border border-border">
                            <div className="flex justify-between items-center py-0.5 pr-0.5 pl-3 text-muted-foreground bg-sidebar">
                              <>Code</>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="size-8 p-0.5 hover:bg-secondary/80 dark:hover:bg-secondary/70"
                                onClick={() => handleCopy(codeContent)}
                              >
                                <IconCopy size={16} />
                              </Button>
                            </div>
                            <SyntaxHighlighter
                              PreTag="div"
                              language={match[1]}
                              style={vscDarkPlus}
                              customStyle={{
                                margin: 0,
                                padding: "1rem",
                                background: "transparent",
                              }}
                            >
                              {codeContent}
                            </SyntaxHighlighter>
                          </div>
                        );
                      }
                      return (
                        <div className="my-2 border shadow-sm border-border">
                          <div className="px-3 py-2 dark:bg-sidebar/40">
                            <code>{codeContent}</code>
                          </div>
                        </div>
                      );
                    },
                    code({
                      inline,
                      className,
                      children,
                      ...rest
                    }: ComponentPropsWithoutRef<"code"> & {
                      inline?: boolean;
                      node?: unknown;
                    }) {
                      if (inline) {
                        return (
                          <code className={className} {...rest}>
                            {String(children)}
                          </code>
                        );
                      }
                      return (
                        <code className={className} {...rest}>
                          {String(children)}
                        </code>
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
          onClick={() => handleCopy(message.content)}
        >
          <IconCopy size={16} />
        </Button>
      </div>
    </div>
  );
}
