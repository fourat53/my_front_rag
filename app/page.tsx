import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "@/components/layout/logout-button";

export default async function HomePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div className="flex h-screen items-center justify-center p-4">
      {session ? (
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">
            Welcome, {session.user.name || session.user.email}!
          </h1>
          <p className="text-muted-foreground">
            You are successfully logged in.
          </p>
          <LogoutButton className="mt-4" />
        </div>
      ) : (
        <div className="text-center space-y-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">
              Welcome to the App
            </h1>
            <p className="text-lg text-muted-foreground">
              Please log in to continue.
            </p>
          </div>
          <Link href="/login" className="inline-block">
            <Button size="lg" className="px-8">
              Log In
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
