import { Model } from "@/types/model.type";
import { Schema, models, model } from "mongoose";

const modelSchema = new Schema<Model>({
  name: String,
  providerId: String,
  description: String,
});

export const ModelModel = models.Model || model<Model>("Model", modelSchema);
