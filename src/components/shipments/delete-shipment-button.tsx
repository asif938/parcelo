"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

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
import { useDeleteShipment } from "@/hooks/use-shipments";

export function DeleteShipmentButton({
  shipmentId,
  redirectHref,
}: {
  shipmentId: string;
  redirectHref: string;
}) {
  const router = useRouter();
  const deleteShipment = useDeleteShipment();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <Trash2 /> Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this shipment?</AlertDialogTitle>
          <AlertDialogDescription>
            This permanently removes the shipment from the platform. This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Keep shipment</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={() =>
              deleteShipment.mutate(shipmentId, {
                onSuccess: () => router.push(redirectHref),
              })
            }
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
