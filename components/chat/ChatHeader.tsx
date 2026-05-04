import { SidebarTrigger } from "../ui/sidebar";
import { Conversation } from "@/types/conversation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PROVIDERS } from "@/types/model";

interface ChatHeaderProps {
  activeConvId: string;
  conversations: Conversation[];
  selectedProvider: string;
  setSelectedProvider: (provider: string) => void;
}

export default function ChatHeader({
  activeConvId,
  conversations,
  selectedProvider,
  setSelectedProvider,
}: ChatHeaderProps) {
  const activeConv = conversations.find((c) => c._id === activeConvId) || null;

  const handleProviderChange = (newProvider: string) => {
    const provider = PROVIDERS.find((p) => p === newProvider);
    if (provider) {
      setSelectedProvider(provider);
    }
  };

  return (
    <div className="flex justify-between items-center px-4 w-full h-14">
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
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {PROVIDERS.map((p, index) => (
            <SelectItem key={index} value={p}>
              {p}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
