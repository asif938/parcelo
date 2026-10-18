import type { Metadata } from "next";
import { Check } from "lucide-react";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Parcelo pricing is based on origin and destination zone, parcel weight, and service type, with an instant quote before you ship.",
};

const FACTORS = [
  "Origin and destination zone",
  "Parcel weight",
  "Service type — standard or express",
];

export default function PricingPage() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-10 px-4 py-20">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Pricing</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Every shipment is priced from a base rate plus a per-kilogram rate
          for its zone pair and service type. You&apos;ll always see the
          exact price before you confirm a shipment.
        </p>
      </div>

      <div className="rounded-xl border bg-card p-6">
        <h2 className="font-semibold">What determines your price</h2>
        <ul className="mt-4 space-y-3">
          {FACTORS.map((factor) => (
            <li key={factor} className="flex items-center gap-2 text-sm text-muted-foreground">
              <Check className="size-4 text-primary" />
              {factor}
            </li>
          ))}
        </ul>
      </div>

      <p className="text-sm text-muted-foreground">
        Sign in and start a shipment to get an instant quote for your
        specific route and parcel — no hidden fees, no estimates.
      </p>
    </div>
  );
}
