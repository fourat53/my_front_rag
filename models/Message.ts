import { Schema } from "mongoose";
import { UIMessage } from "ai";
import { z } from "zod";

export const MessageZodSchema = z.object({
  id: z.string(),
  role: z.enum(["user", "assistant"]),
  content: z.string(),
  timestamp: z.string(),
});

export type Message = z.infer<typeof MessageZodSchema>;
export type ChatMessage = UIMessage<{ createdAt?: string }>;
export type ChatRole = "user" | "assistant";

// Message Schema (Subdocument for Conversation)
export const MessageMongooseSchema = new Schema({
  id: { type: String, required: true },
  role: { type: String, enum: ["user", "assistant"], required: true },
  content: { type: String, required: true },
  timestamp: { type: String, required: true },
}, { _id: false });
