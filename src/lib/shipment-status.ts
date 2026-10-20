import type { ShipmentStatus } from "@/types/shipment";

export const SHIPMENT_STATUS_LABEL: Record<ShipmentStatus, string> = {
  CREATED: "Created",
  PICKUP_SCHEDULED: "Pickup Scheduled",
  COURIER_ASSIGNED: "Courier Assigned",
  PICKED_UP: "Picked Up",
  AT_ORIGIN_HUB: "At Origin Hub",
  IN_TRANSIT: "In Transit",
  AT_DESTINATION_HUB: "At Destination Hub",
  OUT_FOR_DELIVERY: "Out for Delivery",
  DELIVERED: "Delivered",
  FAILED_DELIVERY_ATTEMPT: "Failed Delivery",
  RETURN_TO_SENDER: "Return to Sender",
  RETURNED: "Returned",
  CANCELLED: "Cancelled",
};

export const SHIPMENT_STATUSES = Object.keys(SHIPMENT_STATUS_LABEL) as [
  ShipmentStatus,
  ...ShipmentStatus[],
];

const DESTRUCTIVE_STATUSES = new Set<ShipmentStatus>([
  "FAILED_DELIVERY_ATTEMPT",
  "RETURN_TO_SENDER",
  "RETURNED",
  "CANCELLED",
]);

export function shipmentStatusBadgeVariant(status: ShipmentStatus) {
  if (DESTRUCTIVE_STATUSES.has(status)) return "destructive" as const;
  if (status === "DELIVERED") return "secondary" as const;
  return "outline" as const;
}

export function isExceptionStatus(status: ShipmentStatus) {
  return DESTRUCTIVE_STATUSES.has(status);
}

export interface ShipmentStatusCount {
  status: ShipmentStatus;
  label: string;
  count: number;
}

export function statusCountsFromRecord(
  record: Partial<Record<ShipmentStatus, number>>,
): ShipmentStatusCount[] {
  return SHIPMENT_STATUSES.map((status) => ({
    status,
    label: SHIPMENT_STATUS_LABEL[status],
    count: record[status] ?? 0,
  }));
}

export function statusCountsFromShipments(
  shipments: { status: ShipmentStatus }[],
): ShipmentStatusCount[] {
  const record: Partial<Record<ShipmentStatus, number>> = {};
  for (const shipment of shipments) {
    record[shipment.status] = (record[shipment.status] ?? 0) + 1;
  }
  return statusCountsFromRecord(record);
}
