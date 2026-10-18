import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { AppShell } from "@/components/layout/app-shell";
import { AuthProvider } from "@/components/providers/auth-provider";
import { getServerSession } from "@/lib/auth/session";

export async function ProtectedLayout({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  const user = await getServerSession();
  if (!user) redirect("/login");

  return (
    <AuthProvider initialUser={user}>
      <AppShell user={user} title={title}>
        {children}
      </AppShell>
    </AuthProvider>
  );
}
