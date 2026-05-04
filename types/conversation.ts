import { z } from "zod";
import { MessageSchema } from "./message";

const ConversationSchema = z.object({
  _id: z.string(),
  userId: z.string(),
  title: z.string(),
  providerId: z.string(),
  modelId: z.string(),
  messages: z.array(MessageSchema),
  updatedAt: z.string(),
});

type Conversation = z.infer<typeof ConversationSchema>;

export { type Conversation, ConversationSchema };
