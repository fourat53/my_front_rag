import { Message } from "./message";

type Conversation = {
  id: string;
  title: string;
  updatedAt: string;
  messages: Message[];
  providerId: string;
  modelId: string;
};

export { type Conversation };
