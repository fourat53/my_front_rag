import { Schema, models, model } from "mongoose";
import { User } from "@/types/user.type";

const userSchema = new Schema<User>({
  name: String,
  email: {
    type: String,
    unique: true,
  },
  emailVerified: Boolean,
  image: String,
});

export const UserModel = models.User || model("User", userSchema);
