"use client";

import { CreditCard } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useInitiatePayment } from "@/hooks/use-payments";

export function PayNowButton({ shipmentId }: { shipmentId: string }) {
  const initiatePayment = useInitiatePayment();

  function handleClick() {
    initiatePayment.mutate(shipmentId, {
      onSuccess: (result) => {
        if (!result.checkoutUrl) {
          toast.error("Could not start checkout. Please try again.");
          return;
        }
        window.location.href = result.checkoutUrl;
      },
    });
  }

  return (
    <Button size="sm" onClick={handleClick} disabled={initiatePayment.isPending}>
      <CreditCard /> {initiatePayment.isPending ? "Starting checkout..." : "Pay now"}
    </Button>
  );
}
