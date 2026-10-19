import { ShipmentsList } from "@/components/shipments/shipments-list";

export default function ProviderShipmentsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">All My Shipments</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Search and filter every shipment ever assigned to you.
        </p>
      </div>
      <ShipmentsList basePath="/provider/shipments" />
    </div>
  );
}
