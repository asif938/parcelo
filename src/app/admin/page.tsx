"use client";

import { AlertTriangle, Building2, Package, ScrollText, Tag, Users, Wallet } from "lucide-react";
import Link from "next/link";

import { CourierUtilizationBar } from "@/components/charts/courier-utilization-bar";
import { ShipmentStatusChart } from "@/components/charts/shipment-status-chart";
import { StatCard } from "@/components/dashboard/stat-card";
import { TableMessageRow } from "@/components/dashboard/table-message-row";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAdminDashboardStats, useAuditLogs } from "@/hooks/use-admin-dashboard";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { statusCountsFromRecord } from "@/lib/shipment-status";

const RECENT_ACTIVITY_ROWS = 5;

const QUICK_LINKS = [
  { title: "Manage Users", href: "/admin/users", icon: Users },
  { title: "Zones & Hubs", href: "/admin/zones-hubs", icon: Building2 },
  { title: "Pricing", href: "/admin/pricing", icon: Tag },
  { title: "Audit Logs", href: "/admin/audit-logs", icon: ScrollText },
];

function humanizeAction(action: string) {
  return action
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default function AdminOverviewPage() {
  const stats = useAdminDashboardStats();
  const activity = useAuditLogs({ limit: RECENT_ACTIVITY_ROWS });

  const logs = activity.data?.logs ?? [];
  const openIssues =
    (stats.data?.shipmentsByStatus.FAILED_DELIVERY_ATTEMPT ?? 0) +
    (stats.data?.shipmentsByStatus.RETURN_TO_SENDER ?? 0);
  const statusCounts = statusCountsFromRecord(stats.data?.shipmentsByStatus ?? {});

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Platform Overview</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Monitor shipments, couriers, and revenue across Parcelo.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Shipments"
          icon={Package}
          value={String(stats.data?.totalShipments ?? 0)}
          isLoading={stats.isLoading}
          isError={stats.isError}
        />
        <StatCard
          label="Active Couriers"
          icon={Users}
          value={String(stats.data?.courierUtilization.total ?? 0)}
          isLoading={stats.isLoading}
          isError={stats.isError}
        />
        <StatCard
          label="Total Revenue"
          icon={Wallet}
          value={formatCurrency(stats.data?.revenue ?? 0)}
          isLoading={stats.isLoading}
          isError={stats.isError}
        />
        <StatCard
          label="Open Issues"
          icon={AlertTriangle}
          value={String(openIssues)}
          isLoading={stats.isLoading}
          isError={stats.isError}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {QUICK_LINKS.map((link) => (
          <Button key={link.href} asChild variant="outline" className="h-auto justify-start py-3">
            <Link href={link.href}>
              <link.icon /> {link.title}
            </Link>
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Shipments by Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ShipmentStatusChart
              data={statusCounts}
              isLoading={stats.isLoading}
              isError={stats.isError}
              errorMessage={stats.error instanceof Error ? stats.error.message : undefined}
              onRetry={() => stats.refetch()}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Courier Utilization</CardTitle>
          </CardHeader>
          <CardContent>
            <CourierUtilizationBar
              busy={stats.data?.courierUtilization.busy ?? 0}
              available={stats.data?.courierUtilization.available ?? 0}
              isLoading={stats.isLoading}
              isError={stats.isError}
              errorMessage={stats.error instanceof Error ? stats.error.message : undefined}
              onRetry={() => stats.refetch()}
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event</TableHead>
                <TableHead>User</TableHead>
                <TableHead className="text-right">Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activity.isLoading &&
                Array.from({ length: RECENT_ACTIVITY_ROWS }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton className="h-4 w-40" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-28" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="ml-auto h-4 w-16" />
                    </TableCell>
                  </TableRow>
                ))}

              {activity.isError && (
                <TableMessageRow colSpan={3}>
                  <div className="flex flex-col items-center gap-2">
                    <span>
                      {activity.error instanceof Error
                        ? activity.error.message
                        : "Failed to load recent activity."}
                    </span>
                    <Button variant="outline" size="sm" onClick={() => activity.refetch()}>
                      Retry
                    </Button>
                  </div>
                </TableMessageRow>
              )}

              {!activity.isLoading && !activity.isError && logs.length === 0 && (
                <TableMessageRow colSpan={3}>No recent activity yet.</TableMessageRow>
              )}

              {!activity.isLoading &&
                !activity.isError &&
                logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-medium">
                      {humanizeAction(log.action)} ({log.entityType})
                    </TableCell>
                    <TableCell>{log.actor?.name ?? "System"}</TableCell>
                    <TableCell className="text-right">{formatDateTime(log.createdAt)}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
