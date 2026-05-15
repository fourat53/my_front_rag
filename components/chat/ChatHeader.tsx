import { useChatStore } from "@/store/useChatStore";
import { Provider } from "@/types/provider.type";
import { SidebarTrigger } from "../ui/sidebar";
import { useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";

export default function ChatHeader({ providers }: { providers: Provider[] }) {
  const { selectedProvider, setSelectedProvider, selectedConversation } =
    useChatStore();

  useEffect(() => {
    if (providers && providers.length > 0) {
      setSelectedProvider(providers[0]);
    }
  }, [providers, setSelectedProvider]);

  return (
    <div className="pb-2 flex justify-between items-center px-4 w-full h-14">
      <div className="flex gap-2 items-center">
        <SidebarTrigger className="size-9" />
        <span className="ml-2 text-lg font-semibold">
          {selectedConversation?.title || "New Chat"}
        </span>
      </div>
      <Select
        value={selectedProvider?.id ?? ""}
        onValueChange={(val) => {
          setSelectedProvider(providers.find((p) => p.id === val) ?? null);
        }}
      >
        <SelectTrigger className="w-40 h-8 bg-transparent border-none shadow-none text-xs hover:bg-accent hover:text-white focus-visible:ring-0">
          <SelectValue>{selectedProvider?.name}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Providers</SelectLabel>
            {providers.map((p, index) => (
              <SelectItem key={index} value={p.id}>
                {p.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
