"use client";

import { LogoutButton } from "@/components/layout/logout-button";
import { dummyConversations } from "@/public/data/dummy-data";
import { IconMessage, IconPlus } from "@tabler/icons-react";
import ThemeSwitch from "@/components/navbar/ThemeSwitch";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth-client";
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
  activeId: string;
  onSelect: (id: string) => void;
}

export function ChatSidebar({ activeId, onSelect }: ChatSidebarProps) {
  const { data: session } = useSession();

  return (
    <Sidebar variant="inset" collapsible="offcanvas" className="p-0 pb-2.5 m-0">
      <SidebarHeader className="flex flex-row justify-between items-center px-4 h-16">
        <h2 className="font-bold text-xl tracking-tight truncate flex-1 group-data-[collapsible=icon]:hidden">
          Chat AI
        </h2>
        <ThemeSwitch className="group-data-[collapsible=icon]:hidden" />
      </SidebarHeader>
      <div className="px-8 border-b border-border" />
      <SidebarContent>
        <SidebarGroup>
          <div className="px-2 py-2 group-data-[collapsible=icon]:hidden">
            <Button
              variant="default"
              className="flex gap-2 justify-start items-center w-full"
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
              className="w-8 h-8 rounded-full"
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
                    className="rounded-md"
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

      <SidebarFooter className="p-4 border-t border-border">
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
