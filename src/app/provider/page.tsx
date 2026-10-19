"use client";

import { CheckCircle2, ClipboardList, PackageSearch, Truck } from "lucide-react";
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
import { useAssignedShipments, useShipments } from "@/hooks/use-shipments";
import { isToday } from "@/lib/format";
import { SHIPMENT_STATUS_LABEL, shipmentStatusBadgeVariant } from "@/lib/shipment-status";
import type { ShipmentStatus } from "@/types/shipment";

const ASSIGNED_SHIPMENT_ROWS = 4;
const IN_PROGRESS_STATUSES = new Set<ShipmentStatus>([
  "PICKED_UP",
  "AT_ORIGIN_HUB",
  "IN_TRANSIT",
  "AT_DESTINATION_HUB",
  "OUT_FOR_DELIVERY",
]);
const PICKUP_PENDING_STATUSES = new Set<ShipmentStatus>(["COURIER_ASSIGNED", "PICKUP_SCHEDULED"]);

export default function ProviderTasksPage() {
  const assigned = useAssignedShipments({ limit: 50 });
  const delivered = useShipments({ status: "DELIVERED", limit: 50 });

  const assignedShipments = assigned.data?.shipments ?? [];
  const isLoading = assigned.isLoading;
  const isError = assigned.isError;

  const assignedCount = assigned.data?.meta.total ?? 0;
  const inProgressCount = assignedShipments.filter((s) => IN_PROGRESS_STATUSES.has(s.status)).length;
  const pickupPendingCount = assignedShipments.filter((s) =>
    PICKUP_PENDING_STATUSES.has(s.status),
  ).length;
  const completedTodayCount = (delivered.data?.shipments ?? []).filter((s) =>
    isToday(s.updatedAt),
  ).length;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">My Assigned Shipments</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Shipments assigned to you for pickup and delivery.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Assigned Tasks"
          icon={ClipboardList}
          value={String(assignedCount)}
          isLoading={isLoading}
          isError={isError}
        />
        <StatCard
          label="In Progress"
          icon={Truck}
          value={String(inProgressCount)}
          isLoading={isLoading}
          isError={isError}
        />
        <StatCard
          label="Completed Today"
          icon={CheckCircle2}
          value={String(completedTodayCount)}
          isLoading={delivered.isLoading}
          isError={delivered.isError}
        />
        <StatCard
          label="Pickup Pending"
          icon={PackageSearch}
          value={String(pickupPendingCount)}
          isLoading={isLoading}
          isError={isError}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Assigned Shipments</CardTitle>
          <CardAction>
            <Button asChild variant="outline" size="sm">
              <Link href="/provider/shipments">View all</Link>
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tracking #</TableHead>
                <TableHead>Pickup</TableHead>
                <TableHead>Destination</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading &&
                Array.from({ length: ASSIGNED_SHIPMENT_ROWS }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-32" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="ml-auto h-5 w-20 rounded-full" />
                    </TableCell>
                  </TableRow>
                ))}

              {isError && (
                <TableMessageRow colSpan={4}>
                  <div className="flex flex-col items-center gap-2">
                    <span>
                      {assigned.error instanceof Error
                        ? assigned.error.message
                        : "Failed to load assigned shipments."}
                    </span>
                    <Button variant="outline" size="sm" onClick={() => assigned.refetch()}>
                      Retry
                    </Button>
                  </div>
                </TableMessageRow>
              )}

              {!isLoading && !isError && assignedShipments.length === 0 && (
                <TableMessageRow colSpan={4}>
                  You have no assigned shipments right now.
                </TableMessageRow>
              )}

              {!isLoading &&
                !isError &&
                assignedShipments.slice(0, ASSIGNED_SHIPMENT_ROWS).map((shipment) => (
                  <TableRow key={shipment.id}>
                    <TableCell className="font-medium">{shipment.trackingNumber}</TableCell>
                    <TableCell>{shipment.pickupAddress.city}</TableCell>
                    <TableCell>{shipment.deliveryAddress.city}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant={shipmentStatusBadgeVariant(shipment.status)}>
                        {SHIPMENT_STATUS_LABEL[shipment.status]}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
