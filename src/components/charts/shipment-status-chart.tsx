"use client";

import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipContentProps,
} from "recharts";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { isExceptionStatus, type ShipmentStatusCount } from "@/lib/shipment-status";

const BAR_HEIGHT = 28;
const CHART_MARGIN = { top: 4, right: 24, bottom: 4, left: 0 };

function ChartTooltip({ active, payload }: TooltipContentProps) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload as ShipmentStatusCount;
  return (
    <div className="rounded-md border bg-popover px-3 py-2 text-sm text-popover-foreground shadow-md">
      <p className="font-medium">{point.label}</p>
      <p className="text-muted-foreground">{point.count} shipments</p>
    </div>
  );
}

export function ShipmentStatusChart({
  data,
  isLoading,
  isError,
  errorMessage,
  onRetry,
}: {
  data: ShipmentStatusCount[];
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
  onRetry?: () => void;
}) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-2 py-2">
        {data.map((entry) => (
          <Skeleton key={entry.status} className="h-6 w-full" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-2 py-10 text-center text-sm text-muted-foreground">
        <span>{errorMessage ?? "Failed to load shipment status data."}</span>
        {onRetry && (
          <Button variant="outline" size="sm" onClick={onRetry}>
            Retry
          </Button>
        )}
      </div>
    );
  }

  const total = data.reduce((sum, entry) => sum + entry.count, 0);

  if (total === 0) {
    return (
      <p className="py-10 text-center text-sm text-muted-foreground">
        No shipment data to visualize yet.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <ResponsiveContainer width="100%" height={data.length * BAR_HEIGHT + 16}>
        <BarChart data={data} layout="vertical" margin={CHART_MARGIN} barCategoryGap={6}>
          <XAxis type="number" allowDecimals={false} stroke="var(--muted-foreground)" fontSize={12} />
          <YAxis
            type="category"
            dataKey="label"
            width={128}
            stroke="var(--muted-foreground)"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={ChartTooltip} cursor={{ fill: "var(--muted)" }} />
          <Bar dataKey="count" radius={[0, 4, 4, 0]} maxBarSize={18}>
            {data.map((entry) => (
              <Cell
                key={entry.status}
                fill={isExceptionStatus(entry.status) ? "var(--destructive)" : "var(--chart-3)"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <p className="text-xs text-muted-foreground">
        <span className="mr-1 inline-block size-2 rounded-full bg-destructive align-middle" />
        Red bars indicate cancelled, returned, or failed deliveries.
      </p>
    </div>
  );
}
