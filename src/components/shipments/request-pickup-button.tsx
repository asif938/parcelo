"use client";

import { PackageCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useRequestPickup } from "@/hooks/use-shipments";

export function RequestPickupButton({ shipmentId }: { shipmentId: string }) {
  const requestPickup = useRequestPickup();

  return (
    <Button
      variant="outline"
      size="sm"
      disabled={requestPickup.isPending}
      onClick={() => requestPickup.mutate(shipmentId)}
    >
      <PackageCheck /> {requestPickup.isPending ? "Requesting..." : "Request pickup"}
    </Button>
  );
}
