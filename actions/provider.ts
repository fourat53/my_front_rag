// "use server";

// import { Provider } from "@/models/provider";

// const STATIC_PROVIDERS: Provider[] = [
//   { id: "local-ollama", name: "Local Ollama" },
//   { id: "cloud-ollama", name: "Cloud Ollama" },
//   { id: "openai", name: "OpenAI" },
//   { id: "gemini", name: "Gemini" },
//   { id: "openrouter", name: "OpenRouter" },
//   { id: "nvidia", name: "Nvidia" },
// ];

// export async function getProviders(): Promise<Provider[]> {
//   return STATIC_PROVIDERS;
// }

// export async function getProviderById(id: string): Promise<Provider | null> {
//   return STATIC_PROVIDERS.find((p) => p.id === id) ?? null;
// }

// export async function createProvider(
//   _data: Provider,
// ): Promise<Provider> {
//   throw new Error("Providers are static; creation is disabled.");
// }

// export async function updateProvider(
//   _id: string,
//   _data: Partial<Provider>,
// ): Promise<void> {
//   throw new Error("Providers are static; updates are disabled.");
// }

// export async function deleteProvider(_id: string): Promise<void> {
//   throw new Error("Providers are static; deletion is disabled.");
// }

// export async function initializeProviders(): Promise<void> {
//   // No-op: providers are static and live in code.
// }
