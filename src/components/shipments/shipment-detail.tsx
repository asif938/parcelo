"use client";

import { ArrowLeft, MapPin, Package, Truck } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useShipment, useShipmentTracking } from "@/hooks/use-shipments";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { SHIPMENT_STATUS_LABEL, shipmentStatusBadgeVariant } from "@/lib/shipment-status";
import type { ShipmentStatusHistoryEntry } from "@/types/shipment";

export function ShipmentDetail({
  id,
  backHref,
  fullPageHref,
}: {
  id: string;
  backHref?: string;
  fullPageHref?: string;
}) {
  const shipmentQuery = useShipment(id);
  const trackingQuery = useShipmentTracking(id);

  if (shipmentQuery.isLoading) {
    return <ShipmentDetailSkeleton />;
  }

  if (shipmentQuery.isError || !shipmentQuery.data) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
          <p className="text-sm text-muted-foreground">
            {shipmentQuery.error instanceof Error
              ? shipmentQuery.error.message
              : "Failed to load this shipment."}
          </p>
          <Button variant="outline" size="sm" onClick={() => shipmentQuery.refetch()}>
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  const shipment = shipmentQuery.data;

  return (
    <div className="flex flex-col gap-6">
      {backHref && (
        <Link
          href={backHref}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> Back to shipments
        </Link>
      )}

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">{shipment.trackingNumber}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {shipment.serviceType} · Created {formatDateTime(shipment.createdAt)}
          </p>
        </div>
        <Badge variant={shipmentStatusBadgeVariant(shipment.status)} className="text-sm">
          {SHIPMENT_STATUS_LABEL[shipment.status]}
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Package className="size-4" /> Parcel
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-1 text-sm">
            <p>{shipment.parcelDescription ?? "No description provided"}</p>
            <p className="text-muted-foreground">{shipment.parcelWeightKg} kg</p>
            <p className="text-muted-foreground">
              {formatCurrency(shipment.priceAmount, shipment.currency)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Truck className="size-4" /> Courier
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-1 text-sm">
            <p>{shipment.assignedCourier?.name ?? "Unassigned"}</p>
            {shipment.assignedCourier?.phone && (
              <p className="text-muted-foreground">{shipment.assignedCourier.phone}</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <MapPin className="size-4" /> Pickup
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-1 text-sm">
            <p className="font-medium">{shipment.pickupAddress.contactName}</p>
            <p className="text-muted-foreground">{shipment.pickupAddress.addressLine}</p>
            <p className="text-muted-foreground">{shipment.pickupAddress.city}</p>
            <p className="text-muted-foreground">{shipment.pickupAddress.contactPhone}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <MapPin className="size-4" /> Destination
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-1 text-sm">
            <p className="font-medium">{shipment.deliveryAddress.contactName}</p>
            <p className="text-muted-foreground">{shipment.deliveryAddress.addressLine}</p>
            <p className="text-muted-foreground">{shipment.deliveryAddress.city}</p>
            <p className="text-muted-foreground">{shipment.deliveryAddress.contactPhone}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tracking History</CardTitle>
        </CardHeader>
        <CardContent>
          <ShipmentTrackingTimeline
            isLoading={trackingQuery.isLoading}
            isError={trackingQuery.isError}
            history={trackingQuery.data?.history}
            onRetry={() => trackingQuery.refetch()}
          />
        </CardContent>
      </Card>

      {fullPageHref && (
        <Button asChild variant="outline" size="sm" className="self-start">
          <Link href={fullPageHref}>View full page</Link>
        </Button>
      )}
    </div>
  );
}

function ShipmentTrackingTimeline({
  isLoading,
  isError,
  history,
  onRetry,
}: {
  isLoading: boolean;
  isError: boolean;
  history?: ShipmentStatusHistoryEntry[];
  onRetry: () => void;
}) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-10 w-full" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-2 py-6 text-center text-sm text-muted-foreground">
        <span>Failed to load tracking history.</span>
        <Button variant="outline" size="sm" onClick={onRetry}>
          Retry
        </Button>
      </div>
    );
  }

  if (!history || history.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-muted-foreground">No tracking history yet.</p>
    );
  }

  return (
    <ol className="flex flex-col gap-4">
      {history.map((entry) => (
        <li key={entry.id} className="flex items-start gap-3">
          <Badge variant={shipmentStatusBadgeVariant(entry.status)} className="mt-0.5 shrink-0">
            {SHIPMENT_STATUS_LABEL[entry.status]}
          </Badge>
          <div className="flex flex-col gap-0.5 text-sm">
            {entry.note && <p>{entry.note}</p>}
            <p className="text-xs text-muted-foreground">
              {formatDateTime(entry.createdAt)}
              {entry.actor && ` · ${entry.actor.name} (${entry.actor.role})`}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}

function ShipmentDetailSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <Skeleton className="h-6 w-40" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index}>
            <CardContent className="flex flex-col gap-2 pt-6">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
