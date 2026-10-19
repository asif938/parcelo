"use client";

import { CancelShipmentButton } from "@/components/shipments/cancel-shipment-button";
import { ShipmentDetail } from "@/components/shipments/shipment-detail";
import { UpdateShipmentDialog } from "@/components/shipments/update-shipment-dialog";
import { useShipment } from "@/hooks/use-shipments";
import type { ShipmentStatus } from "@/types/shipment";

const EDITABLE_STATUSES = new Set<ShipmentStatus>(["CREATED"]);
const CANCELLABLE_STATUSES = new Set<ShipmentStatus>([
  "CREATED",
  "PICKUP_SCHEDULED",
  "COURIER_ASSIGNED",
]);

export function CustomerShipmentPage({ id }: { id: string }) {
  const shipmentQuery = useShipment(id);
  const shipment = shipmentQuery.data;

  return (
    <ShipmentDetail
      id={id}
      backHref="/dashboard/shipments"
      actions={
        shipment && (
          <>
            {EDITABLE_STATUSES.has(shipment.status) && (
              <UpdateShipmentDialog shipment={shipment} />
            )}
            {CANCELLABLE_STATUSES.has(shipment.status) && (
              <CancelShipmentButton shipmentId={shipment.id} />
            )}
          </>
        )
      }
    />
  );
}
