import { HubsPanel } from "@/components/admin/hubs-panel";
import { ZonesPanel } from "@/components/admin/zones-panel";

export default function AdminZonesHubsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Zones & Hubs</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage the delivery zones and sorting hubs that power routing and pricing.
        </p>
      </div>
      <ZonesPanel />
      <HubsPanel />
    </div>
  );
}
