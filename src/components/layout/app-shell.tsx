import type { ReactNode } from "react";

import { AppHeader } from "@/components/layout/app-header";
import { AppSidebar } from "@/components/layout/app-sidebar";
import type { AppRole } from "@/components/layout/nav-config";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export function AppShell({
  role,
  title,
  children,
}: {
  role: AppRole;
  title: string;
  children: ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar role={role} />
      <SidebarInset>
        <AppHeader role={role} title={title} />
        <main className="flex flex-1 flex-col gap-4 p-4 md:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
