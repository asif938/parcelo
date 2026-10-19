"use client";

import { ShipmentDetail } from "@/components/shipments/shipment-detail";
import { UpdateStatusDialog } from "@/components/shipments/update-status-dialog";
import { useShipment } from "@/hooks/use-shipments";

export function CourierShipmentPage({ id }: { id: string }) {
  const shipmentQuery = useShipment(id);
  const shipment = shipmentQuery.data;

  return (
    <ShipmentDetail
      id={id}
      backHref="/provider/shipments"
      actions={
        shipment && (
          <UpdateStatusDialog shipmentId={shipment.id} currentStatus={shipment.status} />
        )
      }
    />
  );
}
