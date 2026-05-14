import { create } from "zustand";
import { Conversation } from "@/types/conversation.type";
import { Model } from "@/types/model.type";
import { Provider } from "@/types/provider.type";

interface ChatState {
  //Conversations
  conversations: Conversation[];
  setConversations: (conversations: Conversation[]) => void;

  selectedConversationId: string;
  setSelectedConversationId: (id: string) => void;

  // Providers
  selectedProviderId: string | null;
  setSelectedProviderId: (providerId: string | null) => void;

  // Models
  selectedModelId: string | null;
  setSelectedModelId: (modelId: string | null) => void;

  // Input
  input: string;
  setInput: (input: string) => void;
}

const useChatStore = create<ChatState>((set) => ({
  //Conversations
  conversations: [],
  setConversations: (conversations: Conversation[]) => set({ conversations }),

  selectedConversationId: "",
  setSelectedConversationId: (id: string) =>
    set((state) => state.selectedConversationId === id ? state : { selectedConversationId: id }),

  // Providers
  selectedProviderId: null,
  setSelectedProviderId: (providerId: string | null) =>
    set((state) => state.selectedProviderId === providerId ? state : { selectedProviderId: providerId }),

  // Models
  selectedModelId: null,
  setSelectedModelId: (modelId: string | null) =>
    set((state) => state.selectedModelId === modelId ? state : { selectedModelId: modelId }),

  // Input
  input: "",
  setInput: (input: string) => set((state) => state.input === input ? state : { input }),
}));

export { useChatStore };
