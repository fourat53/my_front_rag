import { useChatStore } from "@/store/useChatStore";
import { SidebarTrigger } from "../ui/sidebar";
import { useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Provider } from "@/types/provider.type";

export default function ChatHeader({ providers }: { providers: Provider[] }) {
  const {
    conversations,
    selectedProviderId,
    setSelectedProviderId,
    selectedConversationId,
  } = useChatStore();

  useEffect(() => {
    if (providers && providers.length > 0) {
      setSelectedProviderId(providers[0].id);
    }
  }, [providers, setSelectedProviderId]);

  const activeConversation =
    conversations.find((c) => c.id === selectedConversationId) || null;
  const activeProvider =
    providers?.find((p) => p.id === selectedProviderId) || null;

  return (
    <div className="pb-2 flex justify-between items-center px-4 w-full h-14">
      <div className="flex gap-2 items-center">
        <SidebarTrigger className="size-9" />
        <span className="ml-2 text-lg font-semibold">
          {activeConversation?.title || "New Chat"}
        </span>
      </div>
      <Select
        value={selectedProviderId || null}
        onValueChange={(val) => {
          if (!val) return;
          setSelectedProviderId(val);
        }}
      >
        <SelectTrigger className="w-40 h-8 bg-transparent border-none shadow-none text-xs hover:bg-accent hover:text-white focus-visible:ring-0">
          <SelectValue>{activeProvider?.name}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {providers?.map((p, index) => (
            <SelectItem key={index} value={p.id}>
              {p.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
