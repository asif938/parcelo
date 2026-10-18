import type { ReactNode } from "react";

import { AppHeader } from "@/components/layout/app-header";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import type { AuthUser } from "@/stores/auth-store";

export function AppShell({
  user,
  title,
  children,
}: {
  user: AuthUser;
  title: string;
  children: ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar role={user.role} />
      <SidebarInset>
        <AppHeader user={user} title={title} />
        <main className="flex flex-1 flex-col gap-4 p-4 md:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
