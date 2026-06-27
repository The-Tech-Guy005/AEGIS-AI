import { auth, currentUser } from "@clerk/nextjs/server";
import { Header } from "@/components/layout/Header";
import { DashboardProfile } from "@/components/auth/DashboardProfile";

export default async function DashboardPage() {
  const { userId } = await auth();
  const user = await currentUser();

  return (
    <div className="min-h-full bg-background">
      <Header />
      <main className="mx-auto max-w-6xl px-6 py-16">
        <h1 className="mb-2 text-3xl font-bold">Dashboard</h1>
        <p className="mb-8 text-muted-foreground">
          Welcome back. Your session is secured with Clerk.
        </p>

        <DashboardProfile
          clerkUserId={userId ?? ""}
          email={user?.primaryEmailAddress?.emailAddress ?? ""}
          fullName={user?.fullName ?? "User"}
          imageUrl={user?.imageUrl}
        />
      </main>
    </div>
  );
}
