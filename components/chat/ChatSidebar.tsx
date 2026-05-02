"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import ThemeSwitch from "@/components/navbar/ThemeSwitch";
import { LogoutButton } from "@/components/layout/logout-button";
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
import {
  IconMessage,
  IconPlus,
  IconSettings,
  IconUser,
} from "@tabler/icons-react";
import { dummyConversations } from "@/lib/dummy-data";

interface SessionData {
  user: {
    name?: string | null;
    email: string;
  };
}

interface ChatSidebarProps {
  activeId: string;
  onSelect: (id: string) => void;
  session: SessionData | null;
}

export function ChatSidebar({ activeId, onSelect, session }: ChatSidebarProps) {
  return (
    <Sidebar variant="inset" collapsible="offcanvas" className="p-0 m-0">
      <SidebarHeader className="h-16 flex items-center justify-between border-b border-border px-4 flex-row">
        <h2 className="font-bold text-xl tracking-tight truncate flex-1 group-data-[collapsible=icon]:hidden">
          Chat AI
        </h2>
        <ThemeSwitch className="group-data-[collapsible=icon]:hidden" />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <div className="px-2 py-2 group-data-[collapsible=icon]:hidden">
            <Button
              variant="default"
              className="w-full flex items-center justify-start gap-2"
              onClick={() => onSelect("")}
            >
              <IconPlus size={18} />
              New Chat
            </Button>
          </div>
          <div className="px-2 py-2 hidden group-data-[collapsible=icon]:flex justify-center">
            <Button
              variant="default"
              size="icon"
              className="rounded-full w-8 h-8"
              onClick={() => onSelect("")}
            >
              <IconPlus size={18} />
            </Button>
          </div>

          <SidebarGroupContent className="px-2">
            <SidebarMenu>
              {dummyConversations.map((conv) => (
                <SidebarMenuItem key={conv.id}>
                  <SidebarMenuButton
                    onClick={() => onSelect(conv.id)}
                    isActive={activeId === conv.id}
                    tooltip={conv.title}
                  >
                    <IconMessage size={16} />
                    <span className="truncate">{conv.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border p-4">
        {session ? (
          <div className="flex flex-col gap-2 group-data-[collapsible=icon]:items-center">
            <div className="flex items-center gap-2 px-2 py-1 text-sm text-muted-foreground group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
              <IconUser size={16} />
              <span className="truncate group-data-[collapsible=icon]:hidden">
                {session.user.name || session.user.email}
              </span>
            </div>
            <div className="flex items-center gap-2 group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:items-center">
              <Button
                variant="ghost"
                size="sm"
                className="flex-1 justify-start gap-2 text-muted-foreground group-data-[collapsible=icon]:hidden"
              >
                <IconSettings size={16} />
                Settings
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="hidden group-data-[collapsible=icon]:flex w-8 h-8 text-muted-foreground"
              >
                <IconSettings size={16} />
              </Button>
              <div className="group-data-[collapsible=icon]:hidden w-full flex">
                <LogoutButton />
              </div>
              <div className="hidden group-data-[collapsible=icon]:flex">
                <LogoutButton />
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-3 group-data-[collapsible=icon]:hidden">
            <p className="text-xs text-muted-foreground px-2">
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
