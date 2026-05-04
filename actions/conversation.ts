"use server";

import { getDb } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { ObjectId } from "mongodb";
import { Conversation } from "@/types/conversation";

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
  const db = await getDb();

  const now = new Date().toISOString();
  const doc = {
    userId,
    title: data.title,
    providerId: data.providerId,
    modelId: data.modelId,
    messages: [],
    updatedAt: now,
  };

  const result = await db.collection("conversations").insertOne({ ...doc });
  return { _id: result.insertedId.toString(), ...doc };
}

export async function getConversations(): Promise<Conversation[]> {
  const userId = await getUserId();
  if (!userId) return [];
  const db = await getDb();

  const docs = await db
    .collection<Omit<Conversation, "_id">>("conversations")
    .find({ userId })
    .sort({ updatedAt: -1 })
    .toArray();

  return docs.map((doc) => ({
    _id: doc._id.toString(),
    userId: doc.userId,
    title: doc.title,
    providerId: doc.providerId,
    modelId: doc.modelId,
    messages: doc.messages,
    updatedAt: doc.updatedAt,
  }));
}

export async function getConversation(
  id: string,
): Promise<Conversation | null> {
  const userId = await getUserId();
  if (!userId) return null;
  const db = await getDb();

  const doc = await db
    .collection("conversations")
    .findOne({ _id: new ObjectId(id), userId });

  if (!doc) return null;

  return {
    _id: doc._id.toString(),
    userId: doc.userId,
    title: doc.title,
    providerId: doc.providerId,
    modelId: doc.modelId,
    messages: doc.messages || [],
    updatedAt: doc.updatedAt,
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
  const db = await getDb();

  const update: Record<string, unknown> = {
    updatedAt: new Date().toISOString(),
  };
  if (data.title !== undefined) update.title = data.title;
  if (data.messages !== undefined) update.messages = data.messages;

  await db
    .collection("conversations")
    .updateOne({ _id: new ObjectId(id), userId }, { $set: update });

  return { success: true };
}

export async function deleteConversation(id: string) {
  const userId = await getUserId();
  if (!userId) throw new Error("Unauthorized");
  const db = await getDb();

  await db
    .collection("conversations")
    .deleteOne({ _id: new ObjectId(id), userId });

  return { success: true };
}
