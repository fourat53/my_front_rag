import mongoose, { Schema, Document, Model as MongooseModel } from "mongoose";
import { z } from "zod";
import { MessageZodSchema, MessageMongooseSchema, Message } from "./Message";

export const ConversationZodSchema = z.object({
  _id: z.string(),
  userId: z.string(),
  title: z.string(),
  providerId: z.string(),
  modelId: z.string(),
  messages: z.array(MessageZodSchema),
  updatedAt: z.string(),
});

export type Conversation = z.infer<typeof ConversationZodSchema>;

export interface IConversation extends Document {
  userId: string;
  title: string;
  providerId: string;
  modelId: string;
  messages: Message[];
  updatedAt: Date;
}

const ConversationMongooseSchema = new Schema<IConversation>(
  {
    userId: { type: String, required: true },
    title: { type: String, required: true },
    providerId: { type: String, required: true },
    modelId: { type: String, required: true },
    messages: [MessageMongooseSchema],
  },
  { timestamps: true },
);

export const ConversationModel: MongooseModel<IConversation> =
  mongoose.models.Conversation ||
  mongoose.model<IConversation>(
    "Conversation",
    ConversationMongooseSchema,
    "conversations",
  );
