"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { FormSelectField } from "@/components/forms/form-select-field";
import { FormTextField } from "@/components/forms/form-text-field";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useGetQuote } from "@/hooks/use-pricing";
import { useZones } from "@/hooks/use-zones";
import { formatCurrency } from "@/lib/format";
import { quoteSchema, type QuoteFormValues } from "@/lib/validations/pricing";

const SERVICE_TYPE_OPTIONS = [
  { value: "STANDARD", label: "Standard" },
  { value: "EXPRESS", label: "Express" },
];

export function PricingQuoteTool() {
  const zonesQuery = useZones();
  const getQuote = useGetQuote();

  const form = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      originZoneId: "",
      destinationZoneId: "",
      serviceType: "STANDARD",
      weightKg: "",
    },
  });

  function onSubmit(values: QuoteFormValues) {
    getQuote.mutate({
      originZoneId: values.originZoneId,
      destinationZoneId: values.destinationZoneId,
      serviceType: values.serviceType,
      weightKg: Number(values.weightKg),
    });
  }

  const zoneOptions = (zonesQuery.data ?? []).map((zone) => ({ value: zone.id, label: zone.name }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quote Calculator</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormSelectField
                control={form.control}
                name="originZoneId"
                label="Origin zone"
                placeholder={zonesQuery.isLoading ? "Loading..." : "Select zone"}
                options={zoneOptions}
              />
              <FormSelectField
                control={form.control}
                name="destinationZoneId"
                label="Destination zone"
                placeholder={zonesQuery.isLoading ? "Loading..." : "Select zone"}
                options={zoneOptions}
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormSelectField
                control={form.control}
                name="serviceType"
                label="Service type"
                options={SERVICE_TYPE_OPTIONS}
              />
              <FormTextField
                control={form.control}
                name="weightKg"
                label="Weight (kg)"
                type="number"
                step="0.01"
                min="0"
              />
            </div>
            <Button type="submit" disabled={getQuote.isPending} className="self-start">
              {getQuote.isPending ? "Calculating..." : "Get quote"}
            </Button>
          </form>
        </Form>

        {getQuote.data && (
          <div className="mt-4 rounded-md border bg-muted/50 p-4 text-sm">
            <p className="text-lg font-semibold">
              {formatCurrency(getQuote.data.price, getQuote.data.currency)}
            </p>
            <p className="mt-1 text-muted-foreground">
              Base {formatCurrency(getQuote.data.basePrice, getQuote.data.currency)} +{" "}
              {formatCurrency(getQuote.data.perKgRate, getQuote.data.currency)}/kg ×{" "}
              {getQuote.data.weightKg}kg
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
