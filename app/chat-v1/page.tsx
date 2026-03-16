"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  IconEdit,
  IconTrash,
  IconSend,
  IconPlus,
  IconMessageCircle,
  IconMessage2,
} from "@tabler/icons-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface Chat {
  id: string;
  title: string;
  messages: Message[];
}

export default function ChatInterface() {
  const [chats, setChats] = useState<Chat[]>([
    {
      id: "1",
      title: "How to center a div?",
      messages: [
        {
          id: "1-1",
          role: "user",
          content: "How to center a div both horizontally and vertically?",
        },
        {
          id: "1-2",
          role: "assistant",
          content:
            "You can center a div using flexbox:\n\n```\ndisplay: flex;\njustify-content: center;\nalign-items: center;\n```",
        },
      ],
    },
    {
      id: "2",
      title: "React best practices",
      messages: [
        {
          id: "2-1",
          role: "user",
          content: "What are React best practices?",
        },
        {
          id: "2-2",
          role: "assistant",
          content:
            "Some React best practices include:\n1. Using functional components with hooks\n2. Proper state management\n3. Component composition\n4. Avoiding unnecessary re-renders",
        },
      ],
    },
  ]);

  const [activeChatId, setActiveChatId] = useState<string>("1");
  const [newMessage, setNewMessage] = useState<string>("");
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState<string>("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        7 * 24,
      )}px`;
    }
  }, [newMessage]);

  const activeChat = chats.find((chat) => chat.id === activeChatId) || chats[0];

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const updatedChats = chats.map((chat) => {
      if (chat.id === activeChatId) {
        const newMessageObj: Message = {
          id: `msg-${Date.now()}`,
          role: "user",
          content: newMessage,
        };

        const newAssistantResponse: Message = {
          id: `resp-${Date.now()}`,
          role: "assistant",
          content: `I received your message: "${newMessage}". This is a simulated response.`,
        };

        return {
          ...chat,
          title:
            newMessage.substring(0, 30) + (newMessage.length > 30 ? "..." : ""),
          messages: [...chat.messages, newMessageObj, newAssistantResponse],
        };
      }
      return chat;
    });

    setChats(updatedChats);
    setNewMessage("");
  };

  const handleStartEditing = (messageId: string, content: string) => {
    setEditingMessageId(messageId);
    setEditContent(content);
  };

  const handleSaveEdit = () => {
    if (!editingMessageId) return;

    const updatedChats = chats.map((chat) => {
      if (chat.id === activeChatId) {
        const messageIndex = chat.messages.findIndex(
          (m) => m.id === editingMessageId,
        );
        if (messageIndex !== -1) {
          const updatedMessages = [
            ...chat.messages.slice(0, messageIndex),
            { ...chat.messages[messageIndex], content: editContent },
          ];

          return {
            ...chat,
            title:
              updatedMessages[0]?.content.substring(0, 30) +
              (updatedMessages[0]?.content.length > 30 ? "..." : ""),
            messages: updatedMessages,
          };
        }
      }
      return chat;
    });

    setChats(updatedChats);
    setEditingMessageId(null);
    setEditContent("");
  };

  const handleDeleteMessage = (messageId: string) => {
    const updatedChats = chats.map((chat) => {
      if (chat.id === activeChatId) {
        const messageIndex = chat.messages.findIndex((m) => m.id === messageId);
        if (messageIndex !== -1) {
          const updatedMessages = chat.messages.slice(0, messageIndex);

          return {
            ...chat,
            title:
              updatedMessages[0]?.content.substring(0, 30) +
              (updatedMessages[0]?.content.length > 30 ? "..." : ""),
            messages: updatedMessages,
          };
        }
      }
      return chat;
    });

    setChats(updatedChats);

    if (editingMessageId === messageId) {
      setEditingMessageId(null);
      setEditContent("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const createNewChat = () => {
    const newChat: Chat = {
      id: `chat-${Date.now()}`,
      title: "New Conversation",
      messages: [],
    };

    setChats([newChat, ...chats]);
    setActiveChatId(newChat.id);
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 flex flex-col border-r border-sidebar-border bg-sidebar">
        <div className="p-4 border-b border-sidebar-border">
          <Button
            onClick={createNewChat}
            className="w-full bg-sidebar-primary hover:bg-sidebar-accent text-sidebar-primary-foreground"
          >
            <IconPlus size={16} className="mr-2" />
            New Chat
          </Button>
        </div>

        <ScrollArea className="flex-1 p-2">
          <div className="space-y-1">
            {chats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => setActiveChatId(chat.id)}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  activeChatId === chat.id
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "hover:bg-sidebar-accent/50 text-sidebar-foreground"
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <IconMessage2 size={16} />
                  <span className="truncate">{chat.title}</span>
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <ScrollArea className="flex-1 p-4 pb-20">
          <div className="max-w-3xl mx-auto w-full space-y-6">
            {activeChat.messages.map((message) => (
              <div key={message.id} className="space-y-2">
                <div className="flex items-start gap-3">
                  <Avatar className="w-8 h-8 mt-1">
                    <AvatarImage src="" alt="User" />
                    <AvatarFallback>
                      {message.role === "user" ? "U" : "AI"}
                    </AvatarFallback>
                  </Avatar>

                  <Card className="flex-1 bg-card border border-border">
                    <CardContent className="p-4">
                      {editingMessageId === message.id ? (
                        <div className="space-y-3">
                          <Textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleSaveEdit();
                              }
                            }}
                            autoFocus
                            className="min-h-25"
                          />
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setEditingMessageId(null);
                                setEditContent("");
                              }}
                            >
                              Cancel
                            </Button>
                            <Button size="sm" onClick={handleSaveEdit}>
                              Save
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <p className="whitespace-pre-wrap">
                            {message.content}
                          </p>

                          {message.role === "user" && (
                            <div className="flex justify-end gap-2 mt-2">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-7 w-7 p-0 hover:bg-muted"
                                      onClick={() =>
                                        handleStartEditing(
                                          message.id,
                                          message.content,
                                        )
                                      }
                                    >
                                      <IconEdit size={14} />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Edit</TooltipContent>
                                </Tooltip>

                                <Tooltip>
                                  <TooltipTrigger>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-7 w-7 p-0 hover:bg-destructive hover:text-destructive-foreground"
                                      onClick={() =>
                                        handleDeleteMessage(message.id)
                                      }
                                    >
                                      <IconTrash size={14} />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Delete</TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          )}
                        </>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {message.role === "user" &&
                  message.id !==
                    activeChat.messages[activeChat.messages.length - 1]?.id && (
                    <Separator className="my-2" />
                  )}
              </div>
            ))}

            {activeChat.messages.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <IconMessageCircle
                  size={48}
                  className="mx-auto mb-4 opacity-50"
                />
                <p>Start a new conversation by typing a message below</p>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="p-4 border-t border-border bg-background">
          <div className="max-w-3xl mx-auto">
            <div className="flex gap-2">
              <Textarea
                ref={textareaRef}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message here..."
                className="flex-1 min-h-11 max-h-42 resize-none py-3 px-4"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className="self-end bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <IconSend size={18} />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground text-center mt-2">
              Press Enter to send, Shift+Enter for new line
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
