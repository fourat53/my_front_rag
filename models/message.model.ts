import { Message } from "@/types/message.type";
import { Schema, models, model } from "mongoose";

const messageSchema = new Schema<Message>({
  role: String,
  content: String,
});

export const MessageModel =
  models.Message || model<Message>("Message", messageSchema);
