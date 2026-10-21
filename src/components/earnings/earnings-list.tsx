"use client";

import { Wallet } from "lucide-react";
import { useSearchParams } from "next/navigation";

import { StatCard } from "@/components/dashboard/stat-card";
import { TableMessageRow } from "@/components/dashboard/table-message-row";
import { EarningsFilters } from "@/components/earnings/earnings-filters";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ShipmentsPagination } from "@/components/shipments/shipments-pagination";
import { useMyEarnings } from "@/hooks/use-courier-self";
import { formatCurrency, formatDateTime } from "@/lib/format";
import type { EarningStatus } from "@/types/courier-earning";

const PAGE_SIZE = 10;
const SKELETON_ROWS = 6;
const COL_SPAN = 4;

export function EarningsList() {
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page") ?? "1") || 1;
  const status = (searchParams.get("status") as EarningStatus | null) ?? undefined;

  const earningsQuery = useMyEarnings({ page, limit: PAGE_SIZE, status });
  const earnings = earningsQuery.data?.earnings ?? [];

  return (
    <div className="flex flex-col gap-4">
      <StatCard
        label="Total Earned"
        icon={Wallet}
        value={formatCurrency(earningsQuery.data?.totalEarned ?? 0)}
        isLoading={earningsQuery.isLoading}
        isError={earningsQuery.isError}
      />

      <EarningsFilters />

      <Card>
        <CardContent className="overflow-x-auto pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Shipment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {earningsQuery.isLoading &&
                Array.from({ length: SKELETON_ROWS }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-16 rounded-full" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="ml-auto h-4 w-16" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="ml-auto h-4 w-20" />
                    </TableCell>
                  </TableRow>
                ))}

              {earningsQuery.isError && (
                <TableMessageRow colSpan={COL_SPAN}>
                  <div className="flex flex-col items-center gap-2">
                    <span>
                      {earningsQuery.error instanceof Error
                        ? earningsQuery.error.message
                        : "Failed to load earnings."}
                    </span>
                    <Button variant="outline" size="sm" onClick={() => earningsQuery.refetch()}>
                      Retry
                    </Button>
                  </div>
                </TableMessageRow>
              )}

              {!earningsQuery.isLoading && !earningsQuery.isError && earnings.length === 0 && (
                <TableMessageRow colSpan={COL_SPAN}>No earnings yet.</TableMessageRow>
              )}

              {!earningsQuery.isLoading &&
                !earningsQuery.isError &&
                earnings.map((earning) => (
                  <TableRow key={earning.id}>
                    <TableCell className="font-medium">
                      {earning.shipment.trackingNumber}
                    </TableCell>
                    <TableCell>
                      <Badge variant={earning.status === "PAID" ? "secondary" : "outline"}>
                        {earning.status === "PAID" ? "Paid" : "Pending"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">{formatCurrency(earning.amount)}</TableCell>
                    <TableCell className="text-right">
                      {formatDateTime(earning.createdAt)}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <ShipmentsPagination meta={earningsQuery.data?.meta} />
    </div>
  );
}
