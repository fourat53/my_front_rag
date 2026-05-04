export type Model = {
  id: string;
  name: string;
  providerId: string;
  description?: string;
};

export const PROVIDERS = [
  "local-ollama",
  "cloud-ollama",
  "openai",
  "gemini",
  "openrouter",
  "nvidia",
];
