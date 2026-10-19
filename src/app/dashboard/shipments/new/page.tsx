import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { CreateShipmentForm } from "@/components/shipments/create-shipment-form";

export default function NewShipmentPage() {
  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/dashboard/shipments"
        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Back to shipments
      </Link>
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">New Shipment</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Fill in the parcel and address details to create a new shipment.
        </p>
      </div>
      <CreateShipmentForm />
    </div>
  );
}
