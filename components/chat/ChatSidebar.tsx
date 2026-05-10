"use client";

import { IconMessage, IconPlus, IconTrash } from "@tabler/icons-react";
import { LogoutButton } from "@/components/reusable/logout-button";
import { useChatStore } from "@/store/useChatStore";
import ThemeSwitch from "@/components/reusable/ThemeSwitch";
import { deleteConversation, getConversations } from "@/actions/conversation";
import { Conversation } from "@/models/Conversation";
import { Button } from "@/components/ui/button";
import { useCallback, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { ChatMessage } from "@/models/Message";
import Image from "next/image";
import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

interface ChatSidebarProps {
  setMessages: (messages: ChatMessage[]) => void;
}

export function ChatSidebar({ setMessages }: ChatSidebarProps) {
  const { data: session } = useSession();
  const {
    models,
    setSelectedModel,
    conversations,
    setConversations,
    selectedConversationId,
    setSelectedConversationId,
    setSelectedProvider,
    providers,
  } = useChatStore();

  useEffect(() => {
    if (session?.user) {
      getConversations().then((data) => {
        const mapped: Conversation[] = data.map((c) => ({
          _id: c._id,
          userId: c.userId,
          title: c.title,
          updatedAt: c.updatedAt,
          messages: c.messages,
          providerId: c.providerId,
          modelId: c.modelId,
        }));
        setConversations(mapped);
      });
    }
  }, [session, setConversations]);

  const handleSelectConversation = useCallback(
    (id: string) => {
      if (!id) {
        setSelectedConversationId("");
        setMessages([]);
        return;
      }
      const conv = conversations.find((c) => c._id === id);
      if (conv) {
        setSelectedConversationId(conv._id);
        setMessages(
          conv.messages.map((m) => ({
            id: m.id,
            role: m.role,
            parts: [{ type: "text", text: m.content }],
            metadata: { createdAt: m.timestamp },
          })) as ChatMessage[],
        );
        setSelectedProvider(
          providers.find((p) => p.id === conv.providerId)?.id || providers[0]?.id || "",
        );
        const model = models.find((m) => m.id === conv.modelId);
        if (model) setSelectedModel(model);
      }
    },
    [
      conversations,
      setMessages,
      models,
      setSelectedConversationId,
      setSelectedProvider,
      setSelectedModel,
      providers,
    ],
  );

  const handleDeleteConv = async (id: string) => {
    if (session?.user) {
      await deleteConversation(id);
      setConversations(conversations.filter((c) => c._id !== id));
    } else {
      setConversations(conversations.filter((c) => c._id !== id));
    }
    if (selectedConversationId === id) {
      setSelectedConversationId("");
      setMessages([]);
    }
  };

  return (
    <Sidebar variant="inset" collapsible="offcanvas" className="p-0 pb-2.5 m-0">
      <SidebarHeader className="flex flex-row justify-between items-center px-4 h-16">
        <h2 className="font-bold text-xl tracking-tight truncate flex-1 group-data-[collapsible=icon]:hidden">
          Chat AI
        </h2>
        <ThemeSwitch className="group-data-[collapsible=icon]:hidden" />
      </SidebarHeader>
      <div className="mx-2 border-b border-border" />
      <SidebarContent>
        <SidebarGroup>
          <div className="pt-1 pb-2 group-data-[collapsible=icon]:hidden">
            <Button
              variant="default"
              className="flex gap-2 justify-start items-center w-full"
              onClick={() => handleSelectConversation("")}
            >
              <IconPlus size={18} />
              New Chat
            </Button>
          </div>
          <div className="py-2 hidden group-data-[collapsible=icon]:flex justify-center">
            <Button
              variant="default"
              size="icon"
              className="w-8 h-8 rounded-full"
              onClick={() => handleSelectConversation("")}
            >
              <IconPlus size={18} />
            </Button>
          </div>

          <SidebarGroupContent>
            <SidebarMenu>
              {conversations.map((conv) => (
                <SidebarMenuItem
                  key={conv._id}
                  className="group/item flex gap-1 items-center justify-between"
                >
                  <SidebarMenuButton
                    onClick={() => handleSelectConversation(conv._id)}
                    isActive={selectedConversationId === conv._id}
                    tooltip={conv.title}
                    className="rounded-md flex-1"
                  >
                    <IconMessage size={16} />
                    <span className="truncate">{conv.title}</span>
                  </SidebarMenuButton>
                  <Button
                    size="icon"
                    className="opacity-0 group-hover/item:opacity-100 size-7"
                    onClick={() => handleDeleteConv(conv._id)}
                  >
                    <IconTrash size={14} />
                  </Button>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <div className="mx-2 border-b border-border" />
      <SidebarFooter className="p-4">
        {session ? (
          <div className="flex flex-col gap-2 group-data-[collapsible=icon]:items-center">
            <div className="flex justify-between items-center gap-2 group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:items-center">
              <div className="flex items-center gap-2 text-sm text-muted-foreground group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
                <div className="flex overflow-hidden justify-center items-center rounded-full size-9">
                  {session.user.image ? (
                    <Image
                      src={session.user.image}
                      alt="User avatar"
                      width={36}
                      height={36}
                    />
                  ) : (
                    session.user.name && (
                      <p className="flex justify-center items-center text-base font-bold rounded-full size-9 bg-primary/20 text-primary">
                        {session.user.name?.[0].toUpperCase()}
                      </p>
                    )
                  )}
                </div>

                <span className="truncate group-data-[collapsible=icon]:hidden">
                  {session.user.name || session.user.email}
                </span>
              </div>
              <LogoutButton variant="icon" />
            </div>
          </div>
        ) : (
          <div className="text-center space-y-3 group-data-[collapsible=icon]:hidden">
            <p className="px-2 text-xs text-muted-foreground">
              Sign in to save your chat history and sync across devices.
            </p>
            <Link href="/login" className="block">
              <Button variant="outline" className="w-full">
                Sign In
              </Button>
            </Link>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
