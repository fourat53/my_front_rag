"use server";

import { connectDB } from "@/lib/db";
import { ProviderModel } from "@/models/Provider";

const providers = [
  {
    id: "local-ollama",
    label: "local-ollama",
    name: "Local Ollama",
    models: [],
  },
  {
    id: "cloud-ollama",
    label: "cloud-ollama",
    name: "Cloud Ollama",
    models: [],
  },
  { id: "openai", label: "openai", name: "OpenAI", models: [] },
  { id: "gemini", label: "gemini", name: "Gemini", models: [] },
  { id: "openrouter", label: "openrouter", name: "OpenRouter", models: [] },
  { id: "nvidia", label: "nvidia", name: "NVIDIA", models: [] },
];

export async function getProviders() {
  await connectDB();
  const providers = await ProviderModel.find(
    {},
    { _id: 0, id: 1, label: 1, name: 1 },
  ).lean();
  return providers as { id: string; label: string; name: string }[];
}

export async function seed() {
  await connectDB();
  console.log("****** Connected to DB, inserting providers *******");
  for (const provider of providers) {
    await ProviderModel.findOneAndUpdate({ id: provider.id }, provider, {
      upsert: true,
    });
  }
  console.log("****** Seeding complete ******");
}
