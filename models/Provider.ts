import mongoose, { Schema, Document, Model as MongooseModel } from "mongoose";

export type Model = {
  id: string;
  name: string;
  providerId: string;
  description?: string;
};

export const ModelSchema = new Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    providerId: { type: String, required: true },
    description: { type: String },
  },
  { _id: false },
);

export interface IProvider extends Document {
  id: string;
  label: string;
  name: string;
  models: Model[];
}

const ProviderMongooseSchema = new Schema<IProvider>(
  {
    id: { type: String, required: true, unique: true },
    label: { type: String, required: true },
    name: { type: String, required: true },
    models: [ModelSchema],
  },
  { timestamps: true },
);

export const ProviderModel: MongooseModel<IProvider> =
  mongoose.models.Provider ||
  mongoose.model<IProvider>("Provider", ProviderMongooseSchema, "providers");
