import { PackagePlus } from "lucide-react";
import Link from "next/link";

import { ShipmentsList } from "@/components/shipments/shipments-list";
import { Button } from "@/components/ui/button";

export default function CustomerShipmentsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">My Shipments</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Search and filter every shipment you&apos;ve created.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/shipments/new">
            <PackagePlus /> New Shipment
          </Link>
        </Button>
      </div>
      <ShipmentsList basePath="/dashboard/shipments" />
    </div>
  );
}
