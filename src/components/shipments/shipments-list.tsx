"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { ShipmentFilters } from "@/components/shipments/shipment-filters";
import { ShipmentQuickView } from "@/components/shipments/shipment-quick-view";
import { ShipmentsPagination } from "@/components/shipments/shipments-pagination";
import { TableMessageRow } from "@/components/dashboard/table-message-row";
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
import { useShipments, useShipmentSearch } from "@/hooks/use-shipments";
import { formatCurrency, formatDate } from "@/lib/format";
import { SHIPMENT_STATUS_LABEL, shipmentStatusBadgeVariant } from "@/lib/shipment-status";

const PAGE_SIZE = 10;
const SKELETON_ROWS = 6;

export function ShipmentsList({
  basePath,
  showCourierColumn = false,
}: {
  basePath: string;
  showCourierColumn?: boolean;
}) {
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page") ?? "1") || 1;
  const status = searchParams.get("status") ?? undefined;
  const q = (searchParams.get("q") ?? "").trim();
  const isSearching = q.length > 0;

  const listQuery = useShipments(
    { page, limit: PAGE_SIZE, status, sortBy: "createdAt", sortOrder: "desc" },
    { enabled: !isSearching },
  );
  const searchQuery = useShipmentSearch({ q, page, limit: PAGE_SIZE }, { enabled: isSearching });

  const active = isSearching ? searchQuery : listQuery;
  const shipments = active.data?.shipments ?? [];
  const colSpan = showCourierColumn ? 9 : 8;

  return (
    <div className="flex flex-col gap-4">
      <ShipmentFilters />

      <Card>
        <CardContent className="overflow-x-auto pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tracking #</TableHead>
                <TableHead>Pickup</TableHead>
                <TableHead>Destination</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Status</TableHead>
                {showCourierColumn && <TableHead>Courier</TableHead>}
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Date</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {active.isLoading &&
                Array.from({ length: SKELETON_ROWS }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-16" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-20 rounded-full" />
                    </TableCell>
                    {showCourierColumn && (
                      <TableCell>
                        <Skeleton className="h-4 w-20" />
                      </TableCell>
                    )}
                    <TableCell className="text-right">
                      <Skeleton className="ml-auto h-4 w-16" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="ml-auto h-4 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="size-6" />
                    </TableCell>
                  </TableRow>
                ))}

              {active.isError && (
                <TableMessageRow colSpan={colSpan}>
                  <div className="flex flex-col items-center gap-2">
                    <span>
                      {active.error instanceof Error
                        ? active.error.message
                        : "Failed to load shipments."}
                    </span>
                    <Button variant="outline" size="sm" onClick={() => active.refetch()}>
                      Retry
                    </Button>
                  </div>
                </TableMessageRow>
              )}

              {!active.isLoading && !active.isError && shipments.length === 0 && (
                <TableMessageRow colSpan={colSpan}>
                  {isSearching
                    ? `No shipments match "${q}".`
                    : "No shipments match these filters."}
                </TableMessageRow>
              )}

              {!active.isLoading &&
                !active.isError &&
                shipments.map((shipment) => (
                  <TableRow key={shipment.id}>
                    <TableCell className="font-medium">
                      <Link href={`${basePath}/${shipment.id}`} className="hover:underline">
                        {shipment.trackingNumber}
                      </Link>
                    </TableCell>
                    <TableCell>{shipment.pickupAddress.city}</TableCell>
                    <TableCell>{shipment.deliveryAddress.city}</TableCell>
                    <TableCell>{shipment.serviceType}</TableCell>
                    <TableCell>
                      <Badge variant={shipmentStatusBadgeVariant(shipment.status)}>
                        {SHIPMENT_STATUS_LABEL[shipment.status]}
                      </Badge>
                    </TableCell>
                    {showCourierColumn && (
                      <TableCell>{shipment.assignedCourier?.name ?? "Unassigned"}</TableCell>
                    )}
                    <TableCell className="text-right">
                      {formatCurrency(shipment.priceAmount, shipment.currency)}
                    </TableCell>
                    <TableCell className="text-right">{formatDate(shipment.createdAt)}</TableCell>
                    <TableCell>
                      <ShipmentQuickView
                        shipmentId={shipment.id}
                        fullPageHref={`${basePath}/${shipment.id}`}
                      />
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {!isSearching && <ShipmentsPagination meta={listQuery.data?.meta} />}
      {isSearching && <ShipmentsPagination meta={searchQuery.data?.meta} />}
    </div>
  );
}
