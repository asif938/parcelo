import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function CourierUtilizationBar({
  busy,
  available,
  isLoading,
  isError,
  errorMessage,
  onRetry,
}: {
  busy: number;
  available: number;
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
  onRetry?: () => void;
}) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-3 py-2">
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-4 w-40" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-2 py-10 text-center text-sm text-muted-foreground">
        <span>{errorMessage ?? "Failed to load courier utilization."}</span>
        {onRetry && (
          <Button variant="outline" size="sm" onClick={onRetry}>
            Retry
          </Button>
        )}
      </div>
    );
  }

  const total = busy + available;

  if (total === 0) {
    return (
      <p className="py-10 text-center text-sm text-muted-foreground">
        No couriers registered yet.
      </p>
    );
  }

  const busyPercent = Math.round((busy / total) * 100);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex h-6 w-full overflow-hidden rounded-md bg-muted">
        {busy > 0 && (
          <div
            className="h-full bg-chart-4"
            style={{ width: `${(busy / total) * 100}%` }}
            title={`${busy} busy`}
          />
        )}
        {available > 0 && (
          <div
            className="h-full bg-chart-1"
            style={{ width: `${(available / total) * 100}%` }}
            title={`${available} available`}
          />
        )}
      </div>
      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-chart-4" />
          Busy: {busy} ({busyPercent}%)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-chart-1" />
          Available: {available} ({100 - busyPercent}%)
        </span>
      </div>
    </div>
  );
}
