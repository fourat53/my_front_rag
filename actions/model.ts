"use server";

import { Model } from "@/models/Provider";

export async function fetchModelsFromProvider(
  providerId: string,
): Promise<Model[]> {
  try {
    const response = await fetch(
      `${process.env.RAG_URL}/models/${providerId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      },
    );

    if (!response.ok) {
      console.error(
        `Failed to fetch models for ${providerId}:`,
        response.statusText,
      );
      return [];
    }

    const data = await response.json();
    return data.models || [];
  } catch (error) {
    console.error(`Error fetching models for ${providerId}:`, error);
    return [];
  }
}
