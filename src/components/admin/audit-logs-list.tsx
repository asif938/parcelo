"use client";

import { useSearchParams } from "next/navigation";

import { AuditLogDetailsDialog } from "@/components/admin/audit-log-details-dialog";
import { AuditLogsFilters } from "@/components/admin/audit-logs-filters";
import { TableMessageRow } from "@/components/dashboard/table-message-row";
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
import { useAuditLogs } from "@/hooks/use-admin-dashboard";
import { humanizeAction } from "@/lib/audit-log";
import { formatDateTime } from "@/lib/format";

const PAGE_SIZE = 15;
const SKELETON_ROWS = 8;
const COL_SPAN = 5;

export function AuditLogsList() {
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page") ?? "1") || 1;
  const action = searchParams.get("action") || undefined;
  const entityType = searchParams.get("entityType") || undefined;

  const logsQuery = useAuditLogs({ page, limit: PAGE_SIZE, action, entityType });
  const logs = logsQuery.data?.logs ?? [];

  return (
    <div className="flex flex-col gap-4">
      <AuditLogsFilters />

      <Card>
        <CardContent className="overflow-x-auto pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event</TableHead>
                <TableHead>Entity</TableHead>
                <TableHead>Actor</TableHead>
                <TableHead className="text-right">Time</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {logsQuery.isLoading &&
                Array.from({ length: SKELETON_ROWS }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton className="h-4 w-40" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-28" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="ml-auto h-4 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="size-6" />
                    </TableCell>
                  </TableRow>
                ))}

              {logsQuery.isError && (
                <TableMessageRow colSpan={COL_SPAN}>
                  <div className="flex flex-col items-center gap-2">
                    <span>
                      {logsQuery.error instanceof Error
                        ? logsQuery.error.message
                        : "Failed to load audit logs."}
                    </span>
                    <Button variant="outline" size="sm" onClick={() => logsQuery.refetch()}>
                      Retry
                    </Button>
                  </div>
                </TableMessageRow>
              )}

              {!logsQuery.isLoading && !logsQuery.isError && logs.length === 0 && (
                <TableMessageRow colSpan={COL_SPAN}>
                  No audit log entries match these filters.
                </TableMessageRow>
              )}

              {!logsQuery.isLoading &&
                !logsQuery.isError &&
                logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-medium">{humanizeAction(log.action)}</TableCell>
                    <TableCell>{log.entityType}</TableCell>
                    <TableCell>{log.actor?.name ?? "System"}</TableCell>
                    <TableCell className="text-right">{formatDateTime(log.createdAt)}</TableCell>
                    <TableCell>
                      <AuditLogDetailsDialog log={log} />
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <ShipmentsPagination meta={logsQuery.data?.meta} />
    </div>
  );
}
