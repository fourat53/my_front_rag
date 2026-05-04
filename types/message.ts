import { z } from "zod";

const MessageSchema = z.object({
  id: z.string(),
  role: z.enum(["user", "assistant"]),
  content: z.string(),
  timestamp: z.string(),
});

type Message = z.infer<typeof MessageSchema>;

export { type Message, MessageSchema };
