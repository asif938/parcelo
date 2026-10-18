import type { Metadata } from "next";
import { Building2, Package, Truck } from "lucide-react";

export const metadata: Metadata = {
  title: "About",
  description:
    "Parcelo connects customers, delivery providers, and operations teams on one platform to move parcels from pickup to delivery.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-10 px-4 py-20">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">About Parcelo</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Parcelo is a courier and logistics platform built around a simple
          idea: every shipment should be easy to create, easy to track, and
          easy to operate. We connect three groups on one system — customers
          who ship parcels, delivery providers who move them, and operations
          staff who keep the network running.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        {[
          {
            icon: Package,
            title: "For customers",
            description:
              "Create a shipment, get an instant price quote, schedule pickup, and track delivery from a single dashboard.",
          },
          {
            icon: Truck,
            title: "For delivery providers",
            description:
              "See assigned shipments, update status as a parcel moves, and track earnings for every completed delivery.",
          },
          {
            icon: Building2,
            title: "For operations",
            description:
              "Manage zones, hubs, pricing, and courier assignment, with full visibility into every shipment on the network.",
          },
        ].map((item) => (
          <div key={item.title} className="rounded-xl border bg-card p-6">
            <item.icon className="size-6 text-primary" />
            <h3 className="mt-4 font-semibold">{item.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
