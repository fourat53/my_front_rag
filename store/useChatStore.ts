import { create } from "zustand";
import { Conversation } from "@/types/conversation.type";
import { Model } from "@/types/model.type";
import { Provider } from "@/types/provider.type";

interface ChatState {
  //Conversations
  conversations: Conversation[];
  setConversations: (conversations: Conversation[]) => void;

  selectedConversation: Conversation | null;
  setSelectedConversation: (conversation: Conversation | null) => void;

  // Providers
  selectedProvider: Provider | null;
  setSelectedProvider: (provider: Provider | null) => void;

  // Models
  selectedModel: Model | null;
  setSelectedModel: (model: Model | null) => void;

  // Input
  input: string;
  setInput: (input: string) => void;
}

const useChatStore = create<ChatState>((set) => ({
  //Conversations
  conversations: [],
  setConversations: (conversations: Conversation[]) => set({ conversations }),

  selectedConversation: null,
  setSelectedConversation: (conversation: Conversation | null) =>
    set((state) =>
      state.selectedConversation?.id === conversation?.id
        ? state
        : { selectedConversation: conversation },
    ),

  // Providers
  selectedProvider: null,
  setSelectedProvider: (provider: Provider | null) =>
    set((state) =>
      state.selectedProvider?.id === provider?.id
        ? state
        : { selectedProvider: provider },
    ),

  // Models
  selectedModel: null,
  setSelectedModel: (model: Model | null) =>
    set((state) =>
      state.selectedModel?.id === model?.id ? state : { selectedModel: model },
    ),

  // Input
  input: "",
  setInput: (input: string) =>
    set((state) => (state.input === input ? state : { input })),
}));

export { useChatStore };
