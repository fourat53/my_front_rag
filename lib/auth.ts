import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { MongoClient } from "mongodb";

const authUrl =
  process.env.NEXT_PUBLIC_PROD_URL || process.env.NEXT_PUBLIC_DEV_URL;

const client = new MongoClient(process.env.MONGODB_URL as string);
const db = client.db();

export const auth = betterAuth({
  database: mongodbAdapter(db),
  baseURL: authUrl,
  secret: process.env.BETTER_AUTH_SECRET,
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
});
