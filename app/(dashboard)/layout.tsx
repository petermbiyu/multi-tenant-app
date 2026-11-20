import { auth } from "@/lib/auth";
import { authClient } from "@/lib/auth-client";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

export const instant = false;

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const { data: session, isPending: isUserLoading } = authClient.useSession();
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    redirect("/auth");
  }
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="py-8">
        <div className="container max-auto px-4">{children}</div>
      </main>
    </div>
  );
}
