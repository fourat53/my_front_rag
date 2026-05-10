import { create } from "zustand";
import { Conversation } from "@/models/Conversation";
import { Model } from "@/models/Provider";

export interface ProviderData {
  id: string;
  label: string;
  name: string;
}
interface ChatState {
  conversations: Conversation[];
  setConversations: (conversations: Conversation[]) => void;

  providers: ProviderData[];
  setProviders: (providers: ProviderData[]) => void;

  models: Model[];
  setModels: (models: Model[]) => void;

  selectedModel: Model | null;
  setSelectedModel: (model: Model | null) => void;

  loadingModels: boolean;
  setLoadingModels: (loadingModels: boolean) => void;

  selectedConversationId: string;
  setSelectedConversationId: (id: string) => void;

  selectedProvider: string;
  setSelectedProvider: (provider: string) => void;

  input: string;
  setInput: (input: string) => void;
}

const useChatStore = create<ChatState>((set) => ({
  conversations: [],
  setConversations: (conversations: Conversation[]) => set({ conversations }),

  providers: [],
  setProviders: (providers: ProviderData[]) => set({ providers }),

  models: [],
  setModels: (models: Model[]) => set({ models }),

  selectedModel: null,
  setSelectedModel: (model: Model | null) => set({ selectedModel: model }),

  loadingModels: true,
  setLoadingModels: (loadingModels: boolean) => set({ loadingModels }),

  selectedConversationId: "",
  setSelectedConversationId: (id: string) =>
    set({ selectedConversationId: id }),

  selectedProvider: "",
  setSelectedProvider: (provider: string) =>
    set({ selectedProvider: provider }),

  input: "",
  setInput: (input: string) => set({ input }),
}));

export { useChatStore };
