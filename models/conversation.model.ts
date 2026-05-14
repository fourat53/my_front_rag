import { Conversation } from "../types/conversation.type";
import { Schema, models, model } from "mongoose";

const conversationSchema = new Schema<Conversation>({
  userId: String,
  title: String,
  providerId: String,
  modelId: String,
  messages: Schema.Types.Mixed,
});

export const ConversationModel =
  models.Conversation ||
  model<Conversation>("Conversation", conversationSchema);
