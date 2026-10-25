import type { Metadata } from "next";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";

import { ContactForm } from "@/components/marketing/contact-form";
import { BackendApiError, backendFetch } from "@/lib/api/backend";
import type { ContactSettings, ContactSettingsResult } from "@/types/contact";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the Parcelo team.",
};

const FALLBACK_SETTINGS: ContactSettings = {
  email: "support@parcelo.app",
  phone: "+1 (555) 010-0100",
  location: "New York, NY",
  updatedAt: null,
};

async function getContactSettings(): Promise<ContactSettings> {
  try {
    const result = await backendFetch<ContactSettingsResult>("/contact/settings");
    return result.settings;
  } catch (error) {
    if (!(error instanceof BackendApiError)) {
      console.error("Failed to load contact settings", error);
    }
    return FALLBACK_SETTINGS;
  }
}

export default async function ContactPage() {
  const settings = await getContactSettings();

  const contactMethods = [
    {
      icon: Mail,
      label: "Email us",
      value: settings.email,
      href: `mailto:${settings.email}`,
    },
    {
      icon: Phone,
      label: "Call us",
      value: settings.phone,
      href: `tel:${settings.phone.replace(/[^\d+]/g, "")}`,
    },
    {
      icon: MapPin,
      label: "Headquarters",
      value: settings.location,
      href: undefined,
    },
  ];

  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-fade" />
      <div className="pointer-events-none absolute -top-32 -left-32 size-96 rounded-full bg-primary/15 blur-3xl" />
      <div className="pointer-events-none absolute top-40 -right-24 size-80 rounded-full bg-brand-accent/20 blur-3xl" />

      <div className="relative mx-auto flex max-w-6xl flex-col gap-16 px-4 py-20 lg:py-28">
        <div className="animate-in fade-in slide-in-from-bottom-6 mx-auto max-w-2xl text-center duration-700">
          <span className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm">
            <MessageCircle className="size-3.5 text-primary" />
            We typically reply within one business day
          </span>
          <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
            Let&apos;s talk{" "}
            <span className="bg-gradient-to-r from-primary via-blue-600 to-brand-accent bg-clip-text text-transparent">
              logistics.
            </span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Questions about a shipment, becoming a delivery provider, or partnering with
            Parcelo? Reach out — we&apos;d love to hear from you.
          </p>
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-8 grid gap-6 duration-700 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] lg:items-start">
          <div className="flex flex-col gap-6">
            <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-primary to-blue-700 p-8 text-primary-foreground shadow-lg shadow-primary/20">
              <div className="pointer-events-none absolute -top-10 -right-10 size-40 rounded-full bg-white/10 blur-2xl" />
              <h2 className="text-xl font-semibold">Get in touch</h2>
              <p className="mt-2 text-sm text-primary-foreground/80">
                Reach the Parcelo team directly through any of the channels below.
              </p>

              <div className="mt-8 flex flex-col gap-5">
                {contactMethods.map((method) => {
                  const content = (
                    <div className="flex items-start gap-3">
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white/15">
                        <method.icon className="size-5" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-primary-foreground/70">
                          {method.label}
                        </p>
                        <p className="mt-0.5 truncate text-sm font-medium">{method.value}</p>
                      </div>
                    </div>
                  );

                  return method.href ? (
                    <a
                      key={method.label}
                      href={method.href}
                      className="rounded-lg transition-opacity hover:opacity-80"
                    >
                      {content}
                    </a>
                  ) : (
                    <div key={method.label}>{content}</div>
                  );
                })}
              </div>

              <div className="mt-8 flex items-center gap-2 border-t border-white/15 pt-6 text-xs text-primary-foreground/70">
                <Clock className="size-3.5" />
                Mon–Fri, 9am–6pm
              </div>
            </div>

            <div className="rounded-2xl border bg-card p-6">
              <h3 className="text-sm font-semibold">Looking for something specific?</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                For shipment-related questions, sign in and check your dashboard for real-time
                tracking and support options tied to your account.
              </p>
            </div>
          </div>

          <div className="w-full">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
