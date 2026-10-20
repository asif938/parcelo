"use client";

import { ErrorState } from "@/components/error-state";

export default function ProviderError({ error, reset }: { error: Error; reset: () => void }) {
  return <ErrorState error={error} reset={reset} />;
}
