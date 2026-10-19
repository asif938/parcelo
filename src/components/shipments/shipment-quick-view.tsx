"use client";

import { Eye } from "lucide-react";
import { useState } from "react";

import { ShipmentDetail } from "@/components/shipments/shipment-detail";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function ShipmentQuickView({
  shipmentId,
  fullPageHref,
}: {
  shipmentId: string;
  fullPageHref: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon-sm" aria-label="Quick view">
          <Eye />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Shipment Details</DialogTitle>
        </DialogHeader>
        {open && <ShipmentDetail id={shipmentId} fullPageHref={fullPageHref} />}
      </DialogContent>
    </Dialog>
  );
}
