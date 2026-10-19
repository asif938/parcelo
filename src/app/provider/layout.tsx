import type { ReactNode } from "react";

import { ProtectedLayout } from "@/components/layout/protected-layout";

export default function ProviderLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedLayout title="My Tasks" role="COURIER">
      {children}
    </ProtectedLayout>
  );
}
