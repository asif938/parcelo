import type { Metadata } from "next";
import { ArrowRight, MapPinned, PackageSearch, Truck, Warehouse } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Standard and express shipment delivery, hub-to-hub transit, and real-time tracking, powered by Parcelo's courier network.",
};

const SERVICES = [
  {
    icon: PackageSearch,
    title: "Standard delivery",
    description:
      "Our everyday service for parcels that aren't time-critical, priced by distance and weight.",
  },
  {
    icon: Truck,
    title: "Express delivery",
    description:
      "Priority handling and faster transit for shipments that need to move quickly.",
  },
  {
    icon: Warehouse,
    title: "Hub-to-hub transit",
    description:
      "Longer routes are relayed through our sorting hub network, with every transfer leg logged for full traceability.",
  },
  {
    icon: MapPinned,
    title: "Live tracking",
    description:
      "Every shipment has a full status timeline, from creation through pickup, transit, and final delivery.",
  },
];

export default function ServicesPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-10 px-4 py-20">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Services</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Choose the service level that fits your shipment, and track it
          every step of the way.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {SERVICES.map((service) => (
          <div key={service.title} className="rounded-xl border bg-card p-6">
            <service.icon className="size-6 text-primary" />
            <h3 className="mt-4 font-semibold">{service.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{service.description}</p>
          </div>
        ))}
      </div>

      <div>
        <Button asChild>
          <Link href="/register">
            Create your first shipment <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
