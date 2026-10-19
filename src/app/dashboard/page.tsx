"use client";

import { CheckCircle2, Package, PackagePlus, Truck, Wallet } from "lucide-react";
import Link from "next/link";

import { StatCard } from "@/components/dashboard/stat-card";
import { TableMessageRow } from "@/components/dashboard/table-message-row";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useShipments } from "@/hooks/use-shipments";
import { formatCurrency, formatDate } from "@/lib/format";
import { SHIPMENT_STATUS_LABEL, shipmentStatusBadgeVariant } from "@/lib/shipment-status";
import type { ShipmentStatus } from "@/types/shipment";

const RECENT_SHIPMENT_ROWS = 4;
const TERMINAL_STATUSES = new Set<ShipmentStatus>(["DELIVERED", "CANCELLED"]);

export default function DashboardOverviewPage() {
  const { data, isLoading, isError, error, refetch } = useShipments({
    limit: 50,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const shipments = data?.shipments ?? [];
  const activeCount = shipments.filter((s) => !TERMINAL_STATUSES.has(s.status)).length;
  const inTransitCount = shipments.filter((s) => s.status === "IN_TRANSIT").length;
  const deliveredCount = shipments.filter((s) => s.status === "DELIVERED").length;
  const totalSpent = shipments
    .filter((s) => s.status !== "CANCELLED")
    .reduce((sum, s) => sum + Number.parseFloat(s.priceAmount), 0);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">My Shipments</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Track and manage the shipments you&apos;ve created.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/shipments/new">
            <PackagePlus /> New Shipment
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Active Shipments"
          icon={Package}
          value={String(activeCount)}
          isLoading={isLoading}
          isError={isError}
        />
        <StatCard
          label="In Transit"
          icon={Truck}
          value={String(inTransitCount)}
          isLoading={isLoading}
          isError={isError}
        />
        <StatCard
          label="Delivered"
          icon={CheckCircle2}
          value={String(deliveredCount)}
          isLoading={isLoading}
          isError={isError}
        />
        <StatCard
          label="Total Spent"
          icon={Wallet}
          value={formatCurrency(totalSpent)}
          isLoading={isLoading}
          isError={isError}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Shipments</CardTitle>
          <CardAction>
            <Button asChild variant="outline" size="sm">
              <Link href="/dashboard/shipments">View all</Link>
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tracking #</TableHead>
                <TableHead>Destination</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading &&
                Array.from({ length: RECENT_SHIPMENT_ROWS }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-20 rounded-full" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="ml-auto h-4 w-20" />
                    </TableCell>
                  </TableRow>
                ))}

              {isError && (
                <TableMessageRow colSpan={4}>
                  <div className="flex flex-col items-center gap-2">
                    <span>
                      {error instanceof Error ? error.message : "Failed to load shipments."}
                    </span>
                    <Button variant="outline" size="sm" onClick={() => refetch()}>
                      Retry
                    </Button>
                  </div>
                </TableMessageRow>
              )}

              {!isLoading && !isError && shipments.length === 0 && (
                <TableMessageRow colSpan={4}>
                  You haven&apos;t created any shipments yet.
                </TableMessageRow>
              )}

              {!isLoading &&
                !isError &&
                shipments.slice(0, RECENT_SHIPMENT_ROWS).map((shipment) => (
                  <TableRow key={shipment.id}>
                    <TableCell className="font-medium">{shipment.trackingNumber}</TableCell>
                    <TableCell>{shipment.deliveryAddress.city}</TableCell>
                    <TableCell>
                      <Badge variant={shipmentStatusBadgeVariant(shipment.status)}>
                        {SHIPMENT_STATUS_LABEL[shipment.status]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">{formatDate(shipment.createdAt)}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
