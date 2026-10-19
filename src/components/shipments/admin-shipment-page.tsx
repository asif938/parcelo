"use client";

import { AssignCourierDialog } from "@/components/shipments/assign-courier-dialog";
import { DeleteShipmentButton } from "@/components/shipments/delete-shipment-button";
import { ShipmentDetail } from "@/components/shipments/shipment-detail";
import { UpdateStatusDialog } from "@/components/shipments/update-status-dialog";
import { useShipment } from "@/hooks/use-shipments";

export function AdminShipmentPage({ id }: { id: string }) {
  const shipmentQuery = useShipment(id);
  const shipment = shipmentQuery.data;

  return (
    <ShipmentDetail
      id={id}
      backHref="/admin/shipments"
      actions={
        shipment && (
          <>
            <AssignCourierDialog shipmentId={shipment.id} />
            <UpdateStatusDialog shipmentId={shipment.id} currentStatus={shipment.status} />
            <DeleteShipmentButton shipmentId={shipment.id} redirectHref="/admin/shipments" />
          </>
        )
      }
    />
  );
}
