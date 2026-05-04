"use server";

import { Model } from "@/types/model";
import { ragUrl } from "@/public/data/env-vars";

export async function fetchModelsFromProvider(
  providerId: string,
): Promise<Model[]> {
  try {
    const response = await fetch(`${ragUrl}/models/${providerId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

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
