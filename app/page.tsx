import ChatLayout from "@/components/chat/ChatLayout";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function HomePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return <ChatLayout session={session} />;
}
