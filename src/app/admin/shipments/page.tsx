import { ShipmentsList } from "@/components/shipments/shipments-list";

export default function AdminShipmentsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">All Shipments</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Search, filter, and review every shipment on the platform.
        </p>
      </div>
      <ShipmentsList basePath="/admin/shipments" showCourierColumn />
    </div>
  );
}
