import { Schema, models, model } from "mongoose";
import { Provider } from "@/types/provider.type";

const providerSchema = new Schema<Provider>({
  label: String,
  name: String,
  models: Schema.Types.Mixed,
});

export const ProviderModel =
  models.Provider || model<Provider>("Provider", providerSchema);
