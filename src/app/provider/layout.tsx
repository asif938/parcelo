import type { ReactNode } from "react";

import { AppShell } from "@/components/layout/app-shell";

export default function ProviderLayout({ children }: { children: ReactNode }) {
  return (
    <AppShell role="COURIER" title="My Tasks">
      {children}
    </AppShell>
  );
}
