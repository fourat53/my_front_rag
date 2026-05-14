"use client";

import { IconMessage, IconPlus, IconTrash } from "@tabler/icons-react";
import { LogoutButton } from "@/components/reusable/logout-button";
import ThemeSwitch from "@/components/reusable/ThemeSwitch";
import { Conversation } from "@/types/conversation.type";
import { useChatStore } from "@/store/useChatStore";
import { Provider } from "@/types/provider.type";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useCallback, useEffect } from "react";
import { Message } from "@/types/message.type";
import { useSession } from "@/lib/auth-client";
import { Model } from "@/types/model.type";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import {
  deleteConversation,
  getConversations,
} from "@/actions/conversation.action";
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
  setMessages: (messages: Message[]) => void;
  providers: Provider[];
  models: Model[];
}

export function ChatSidebar({
  setMessages,
  providers,
  models,
}: ChatSidebarProps) {
  const { data: session } = useSession();
  const {
    conversations,
    setConversations,
    selectedConversationId,
    setSelectedConversationId,
    setSelectedProviderId,
    setSelectedModelId,
  } = useChatStore();

  const {
    data: convData,
    isLoading: isLoadingConversations,
    error: convError,
  } = useQuery({
    queryKey: ["conversations"],
    queryFn: () => getConversations(),
    enabled: !!session?.user,
  });

  useEffect(() => {
    if (convData) {
      const mapped: Conversation[] = convData.map((c) => ({
        id: c.id,
        title: c.title,
        userId: c.userId,
        modelId: c.modelId,
        providerId: c.providerId,
        messages: c.messages,
      }));
      setConversations(mapped);
    }
  }, [convData, setConversations]);

  const handleSelectConversation = useCallback(
    (id: string) => {
      if (!id) {
        setSelectedConversationId("");
        setMessages([]);
        return;
      }
      const conv = conversations.find((c) => c.id === id);
      if (conv && conv.messages) {
        setSelectedConversationId(conv.id);
        setMessages(
          conv.messages.map((m) => ({
            id: m.id,
            role: m.role,
            parts: [{ type: "text", text: m.content }],
          })) as Message[],
        );
        setSelectedProviderId(
          providers.find((p) => p.id === conv.providerId)?.id || null,
        );
        const model = models.find((m) => m.id === conv.modelId);
        if (model) setSelectedModelId(model.id);
      }
    },
    [
      conversations,
      setMessages,
      models,
      setSelectedConversationId,
      setSelectedProviderId,
      setSelectedModelId,
      providers,
    ],
  );

  const handleDeleteConv = async (id: string) => {
    if (session?.user) {
      await deleteConversation(id);
      setConversations(conversations.filter((c) => c.id !== id));
    } else {
      setConversations(conversations.filter((c) => c.id !== id));
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
      <SidebarContent className="px-1">
        <SidebarGroup>
          <div className="py-2 group-data-[collapsible=icon]:hidden">
            <Button
              variant="default"
              iconPosition="end"
              icon={<IconPlus size={18} />}
              className="flex gap-2 justify-start items-center w-full"
              onClick={() => handleSelectConversation("")}
            >
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
              {isLoadingConversations ? (
                <div className="p-4 text-center text-sm text-muted-foreground animate-pulse">
                  Loading conversations...
                </div>
              ) : convError ? (
                <div className="p-4 text-center text-sm text-red-500">
                  Failed to load conversations
                </div>
              ) : (
                conversations.map((conv, index) => (
                  <SidebarMenuItem
                    key={index}
                    title={conv.title}
                    className="rounded-md hover:bg-muted/50 group/item flex items-center justify-between"
                  >
                    <SidebarMenuButton
                      isActive={selectedConversationId === conv.id}
                      className="pr-2 rounded-none rounded-l-md flex-1"
                      onClick={() => handleSelectConversation(conv.id)}
                    >
                      <IconMessage size={16} />
                      <span className="truncate">{conv.title}</span>
                    </SidebarMenuButton>
                    <SidebarMenuButton
                      isActive={selectedConversationId === conv.id}
                      className={cn(
                        "size-9 p-2.5 hover:bg-red-600/10 rounded-none rounded-r-md  group-hover/item:opacity-100",
                        selectedConversationId !== conv.id && "opacity-0",
                      )}
                      onClick={() => handleDeleteConv(conv.id)}
                    >
                      <IconTrash size={14} />
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))
              )}
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
