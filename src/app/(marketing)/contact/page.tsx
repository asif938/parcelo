import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the Parcelo team.",
};

const CONTACT_METHODS = [
  { icon: Mail, label: "Email", value: "support@parcelo.app" },
  { icon: Phone, label: "Phone", value: "+1 (555) 010-0100" },
  { icon: MapPin, label: "Headquarters", value: "New York, NY" },
];

export default function ContactPage() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-10 px-4 py-20">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Contact us</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Questions about a shipment, becoming a delivery provider, or
          partnering with Parcelo? Reach out.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {CONTACT_METHODS.map((method) => (
          <div key={method.label} className="rounded-xl border bg-card p-6">
            <method.icon className="size-5 text-primary" />
            <h3 className="mt-3 text-sm font-semibold">{method.label}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{method.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
