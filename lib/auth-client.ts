import { createAuthClient } from "better-auth/react";
import { baseURL } from "./env-vars";

export const authClient = createAuthClient({ baseURL });

export const { signIn, signUp, useSession, signOut } = authClient;
