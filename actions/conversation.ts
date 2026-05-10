"use server";

import { connectDB } from "@/lib/db";
import { ConversationModel, Conversation } from "@/models/Conversation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Message } from "@/models/Message";

async function getUserId(): Promise<string | null> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    return session?.user?.id ?? null;
  } catch {
    return null;
  }
}

export async function createConversation(data: {
  title: string;
  providerId: string;
  modelId: string;
}) {
  const userId = await getUserId();
  if (!userId) throw new Error("Unauthorized");
  await connectDB();

  const now = new Date();
  const doc = new ConversationModel({
    userId,
    title: data.title,
    providerId: data.providerId,
    modelId: data.modelId,
    messages: [],
    updatedAt: now,
  });

  const result = await doc.save();
  return {
    _id: result._id.toString(),
    userId: result.userId,
    title: result.title,
    providerId: result.providerId,
    modelId: result.modelId,
    messages: result.messages,
    updatedAt: new Date(result.updatedAt).toISOString(),
  };
}

export async function getConversations(): Promise<Conversation[]> {
  const userId = await getUserId();
  if (!userId) return [];
  await connectDB();

  const docs = await ConversationModel.find({ userId })
    .sort({ updatedAt: -1 })
    .lean();

  return docs.map((doc) => ({
    _id: doc._id.toString(),
    userId: doc.userId,
    title: doc.title,
    providerId: doc.providerId,
    modelId: doc.modelId,
    messages: doc.messages as Message[],
    updatedAt: new Date(doc.updatedAt).toISOString(),
  }));
}

export async function getConversation(
  id: string,
): Promise<Conversation | null> {
  const userId = await getUserId();
  if (!userId) return null;
  await connectDB();

  const doc = await ConversationModel.findOne({ _id: id, userId }).lean();

  if (!doc) return null;

  return {
    _id: doc._id.toString(),
    userId: doc.userId,
    title: doc.title,
    providerId: doc.providerId,
    modelId: doc.modelId,
    messages: doc.messages as Message[],
    updatedAt: new Date(doc.updatedAt).toISOString(),
  };
}

export async function updateConversation(
  id: string,
  data: {
    title?: string;
    messages?: Array<{
      id: string;
      role: "user" | "assistant";
      content: string;
      timestamp: string;
    }>;
  },
) {
  const userId = await getUserId();
  if (!userId) throw new Error("Unauthorized");
  await connectDB();

  const update: Record<string, unknown> = {
    updatedAt: new Date(),
  };
  if (data.title !== undefined) update.title = data.title;
  if (data.messages !== undefined) update.messages = data.messages;

  await ConversationModel.updateOne(
    { _id: id, userId },
    { $set: update }
  );

  return { success: true };
}

export async function deleteConversation(id: string) {
  const userId = await getUserId();
  if (!userId) throw new Error("Unauthorized");
  await connectDB();

  await ConversationModel.deleteOne({ _id: id, userId });

  return { success: true };
}
