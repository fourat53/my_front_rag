import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_PROD_URL || process.env.NEXT_PUBLIC_DEV_URL,
});

export const { signIn, signUp, useSession, signOut } = authClient;
