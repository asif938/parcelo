import { ArrowRight, MapPin, PackageCheck, Truck } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-24 px-4 py-20">
      <section className="flex flex-col items-start gap-6">
        <h1 className="max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
          Ship it. Track it. Deliver it. All in one platform.
        </h1>
        <p className="max-w-xl text-lg text-muted-foreground">
          Parcelo connects customers, delivery providers, and operations
          teams on a single platform to create shipments, assign couriers,
          and track every parcel from pickup to delivery.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button size="lg" asChild>
            <Link href="/register">
              Get started <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/services">Explore services</Link>
          </Button>
        </div>
      </section>

      <section className="grid gap-6 sm:grid-cols-3">
        {[
          {
            icon: PackageCheck,
            title: "Create shipments in minutes",
            description:
              "Get an instant price quote and schedule pickup for any parcel, anywhere in your coverage zones.",
          },
          {
            icon: Truck,
            title: "Real-time courier dispatch",
            description:
              "Operations teams assign and reassign couriers and track every stage of the delivery lifecycle.",
          },
          {
            icon: MapPin,
            title: "End-to-end tracking",
            description:
              "Customers follow their shipment's full journey, from origin hub to final delivery, in real time.",
          },
        ].map((feature) => (
          <div key={feature.title} className="rounded-xl border bg-card p-6">
            <feature.icon className="size-6 text-primary" />
            <h3 className="mt-4 font-semibold">{feature.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {feature.description}
            </p>
          </div>
        ))}
      </section>
    </div>
  );
}
