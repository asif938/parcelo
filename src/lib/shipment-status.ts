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
