import {
  ArrowRight,
  Building2,
  CheckCircle2,
  CreditCard,
  MapPin,
  PackageCheck,
  Radar,
  ShieldCheck,
  Truck,
  UserRound,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const TRUST_ITEMS = [
  { icon: Radar, label: "Live shipment tracking" },
  { icon: ShieldCheck, label: "Secure Stripe payments" },
  { icon: UserRound, label: "Role-based dashboards" },
];

const CAPABILITIES = [
  { icon: PackageCheck, value: "Instant", label: "price quotes" },
  { icon: Truck, value: "Live", label: "courier dispatch" },
  { icon: MapPin, value: "Real-time", label: "shipment tracking" },
  { icon: ShieldCheck, value: "Stripe", label: "secured payments" },
];

const FEATURES = [
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
  {
    icon: CreditCard,
    title: "Secure online payments",
    description:
      "Pay for a shipment through Stripe checkout and get notified the moment a payment clears.",
  },
];

const STEPS = [
  {
    step: "01",
    title: "Create a shipment",
    description: "Enter pickup and drop-off details and get an instant price quote.",
  },
  {
    step: "02",
    title: "Get matched with a courier",
    description: "Operations assigns the nearest available delivery provider to your parcel.",
  },
  {
    step: "03",
    title: "Track it live",
    description: "Follow every status update from pickup to the final mile, in real time.",
  },
  {
    step: "04",
    title: "Delivered & confirmed",
    description: "Get notified the moment your parcel arrives and payment is settled.",
  },
];

const ROLES = [
  {
    icon: PackageCheck,
    title: "Customers",
    description:
      "Create shipments, pay securely, and track every parcel from a single dashboard.",
    href: "/register",
    accent: "from-primary to-blue-700",
    tile: "bg-primary/10 text-primary",
  },
  {
    icon: Truck,
    title: "Delivery providers",
    description:
      "See assigned shipments, update status on the move, and track earnings as you go.",
    href: "/register",
    accent: "from-amber-400 to-amber-600",
    tile: "bg-brand-accent/15 text-amber-600 dark:text-amber-400",
  },
  {
    icon: Building2,
    title: "Operations teams",
    description:
      "Manage zones, hubs, pricing, and courier assignment with full network visibility.",
    href: "/about",
    accent: "from-slate-500 to-slate-700",
    tile: "bg-slate-500/10 text-slate-600 dark:text-slate-300",
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-fade" />
        <div className="pointer-events-none absolute -top-32 -left-32 size-96 rounded-full bg-primary/15 blur-3xl" />
        <div className="pointer-events-none absolute top-20 -right-24 size-80 rounded-full bg-brand-accent/20 blur-3xl" />

        <div className="relative mx-auto grid max-w-6xl gap-16 px-4 py-20 lg:grid-cols-2 lg:items-center lg:py-28">
          <div className="animate-in fade-in slide-in-from-bottom-6 flex flex-col items-start gap-6 duration-700">
            <span className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500/60" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
              </span>
              Now live across customer, courier &amp; admin dashboards
            </span>
            <h1 className="max-w-xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Ship it. Track it.{" "}
              <span className="bg-gradient-to-r from-primary via-blue-600 to-brand-accent bg-clip-text text-transparent">
                Deliver it.
              </span>{" "}
              All in one platform.
            </h1>
            <p className="max-w-xl text-lg text-muted-foreground">
              Parcelo connects customers, delivery providers, and operations
              teams on a single platform to create shipments, assign couriers,
              and track every parcel from pickup to delivery.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                size="lg"
                className="shadow-lg shadow-primary/25 transition-shadow hover:shadow-xl hover:shadow-primary/35"
                asChild
              >
                <Link href="/register">
                  Get started <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/services">Explore services</Link>
              </Button>
            </div>
            <div className="mt-2 flex flex-wrap gap-5">
              {TRUST_ITEMS.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <item.icon className="size-4 text-primary" />
                  {item.label}
                </div>
              ))}
            </div>
          </div>

          <div className="animate-in fade-in zoom-in-95 relative mx-auto w-full max-w-md delay-150 duration-700 lg:max-w-none">
            <Image
              src="/illustrations/hero.jpg"
              alt="Parcelo shipment tracking dashboard illustration"
              width={600}
              height={520}
              priority
              unoptimized
              className="h-auto w-full"
            />

            <Card className="animate-float absolute top-[-3%] right-[-2%] w-52 gap-1 p-3 shadow-xl sm:w-56">
              <div className="flex items-center gap-2">
                <span className="size-2 shrink-0 rounded-full bg-primary" />
                <p className="text-sm font-semibold">CLP-2291 · In transit</p>
              </div>
              <p className="pl-4 text-xs text-muted-foreground">Updated 2 min ago</p>
            </Card>

            <Card className="animate-float-delayed absolute bottom-[-9%] left-[-30] w-44 gap-1 p-3 shadow-xl sm:w-48">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 shrink-0 text-emerald-500" />
                <p className="text-sm font-semibold">Delivered</p>
              </div>
              <p className="pl-6 text-xs text-muted-foreground">On time · 4.9★ rating</p>
            </Card>
          </div>
        </div>
      </section>

      <section className="border-y bg-muted/30">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-4 py-10 sm:grid-cols-4 sm:divide-x sm:divide-border">
          {CAPABILITIES.map((item) => (
            <div key={item.label} className="flex flex-col items-center gap-1.5 text-center sm:px-4">
              <item.icon className="size-5 text-primary" />
              <p className="text-lg font-bold tracking-tight">{item.value}</p>
              <p className="text-xs text-muted-foreground">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            Everything a logistics team needs
          </h2>
          <p className="mt-3 text-muted-foreground">
            Built for the full delivery lifecycle, from the first quote to the final payment.
          </p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature, index) => (
            <Card
              key={feature.title}
              className="group p-6 ring-1 ring-border transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10 hover:ring-primary/30"
            >
              <span
                className={
                  index % 2 === 0
                    ? "flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-110"
                    : "flex size-11 items-center justify-center rounded-xl bg-brand-accent/15 text-amber-600 transition-transform group-hover:scale-110 dark:text-amber-400"
                }
              >
                <feature.icon className="size-5" />
              </span>
              <h3 className="mt-4 font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </section>

      <section className="w-full bg-muted/40 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight">How Parcelo works</h2>
            <p className="mt-3 text-muted-foreground">
              Four steps take a parcel from quote to doorstep.
            </p>
          </div>
          <div className="relative mt-14">
            <div className="absolute top-5 right-0 left-0 hidden h-px bg-gradient-to-r from-transparent via-border to-transparent sm:block" />
            <div className="relative grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {STEPS.map((item) => (
                <div key={item.step} className="flex flex-col gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground ring-4 ring-background">
                    {item.step}
                  </span>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight">Built for every role</h2>
          <p className="mt-3 text-muted-foreground">
            One platform, three dashboards, each tailored to the work that matters.
          </p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {ROLES.map((role) => (
            <Link key={role.title} href={role.href} className="group">
              <Card className="h-full overflow-hidden p-0 ring-1 ring-border transition-all group-hover:-translate-y-1 group-hover:shadow-xl">
                <div className={`h-1.5 w-full bg-gradient-to-r ${role.accent}`} />
                <div className="p-6">
                  <span className={`flex size-11 items-center justify-center rounded-xl ${role.tile}`}>
                    <role.icon className="size-5" />
                  </span>
                  <h3 className="mt-4 font-semibold">{role.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{role.description}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                    Learn more
                    <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-24">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-blue-800 px-8 py-16 text-center sm:px-16">
          <div className="absolute inset-0 bg-grid-fade-light" />
          <div className="pointer-events-none absolute -top-16 -right-16 size-64 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-10 size-56 rounded-full bg-white/10 blur-3xl" />
          <h2 className="relative text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
            Ready to move your first parcel?
          </h2>
          <p className="relative mx-auto mt-3 max-w-xl text-primary-foreground/80">
            Create an account and get your first shipment quoted in minutes.
          </p>
          <div className="relative mt-8 flex flex-wrap justify-center gap-3">
            <Button size="lg" variant="secondary" className="shadow-lg shadow-black/10" asChild>
              <Link href="/register">
                Get started <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-white/10 hover:text-primary-foreground"
              asChild
            >
              <Link href="/contact">Contact us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
