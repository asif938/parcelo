"use client";

import { ErrorState } from "@/components/error-state";

export default function DashboardError({ error, reset }: { error: Error; reset: () => void }) {
  return <ErrorState error={error} reset={reset} />;
}
