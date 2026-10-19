import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { AppShell } from "@/components/layout/app-shell";
import type { AppRole } from "@/components/layout/nav-config";
import { AuthProvider } from "@/components/providers/auth-provider";
import { getServerSession } from "@/lib/auth/session";
import { ROLE_HOME } from "@/lib/routes";

export async function ProtectedLayout({
  title,
  role,
  children,
}: {
  title: string;
  role: AppRole;
  children: ReactNode;
}) {
  const user = await getServerSession();
  if (!user) redirect("/login");
  if (user.role !== role) redirect(ROLE_HOME[user.role]);

  return (
    <AuthProvider initialUser={user}>
      <AppShell user={user} title={title}>
        {children}
      </AppShell>
    </AuthProvider>
  );
}
