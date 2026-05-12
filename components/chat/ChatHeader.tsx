import { useChatStore } from "@/store/useChatStore";
import { getProviders } from "@/actions/provider";
import { useQuery } from "@tanstack/react-query";
import { SidebarTrigger } from "../ui/sidebar";
import { useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ChatHeader() {
  const {
    conversations,
    selectedConversationId,
    selectedProvider,
    setSelectedProvider,
    providers,
    setProviders,
  } = useChatStore();

  const { data: dbProviders } = useQuery({
    queryKey: ["providers"],
    queryFn: () => getProviders(),
  });

  useEffect(() => {
    if (dbProviders && dbProviders.length > 0) {
      setProviders(dbProviders);
      if (!selectedProvider) {
        setSelectedProvider(dbProviders[dbProviders.length - 1].id);
      }
    }
  }, [dbProviders, selectedProvider, setProviders, setSelectedProvider]);

  const activeConv =
    conversations.find((c) => c._id === selectedConversationId) || null;

  const handleProviderChange = (newProviderId: string) => {
    const provider = providers.find((p) => p.id === newProviderId);
    if (provider) {
      setSelectedProvider(provider.id);
    }
  };

  return (
    <div className="pb-2 flex justify-between items-center px-4 w-full h-14">
      <div className="flex gap-2 items-center">
        <SidebarTrigger className="size-9" />
        <span className="ml-2 text-lg font-semibold">
          {activeConv?.title || "New Chat"}
        </span>
      </div>
      <Select
        value={selectedProvider}
        onValueChange={(val) => handleProviderChange(val || "")}
      >
        <SelectTrigger className="w-40 h-8 bg-transparent border-none shadow-none text-xs hover:bg-accent hover:text-white focus-visible:ring-0">
          <SelectValue placeholder="Select Provider" />
        </SelectTrigger>
        <SelectContent>
          {providers.map((p) => (
            <SelectItem key={p.id} value={p.id}>
              {p.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
