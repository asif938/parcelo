"use client";

import { Ban } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useCancelShipment } from "@/hooks/use-shipments";

export function CancelShipmentButton({ shipmentId }: { shipmentId: string }) {
  const cancelShipment = useCancelShipment();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Ban /> Cancel shipment
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Cancel this shipment?</AlertDialogTitle>
          <AlertDialogDescription>
            This will mark the shipment as cancelled. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Keep shipment</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={() => cancelShipment.mutate(shipmentId)}
          >
            Cancel shipment
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
