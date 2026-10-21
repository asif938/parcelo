"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { FormSelectField } from "@/components/forms/form-select-field";
import { FormTextField } from "@/components/forms/form-text-field";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useCreatePricingRule } from "@/hooks/use-pricing";
import { useZones } from "@/hooks/use-zones";
import { applyServerErrors } from "@/lib/forms/apply-server-errors";
import {
  createPricingRuleSchema,
  type CreatePricingRuleFormValues,
} from "@/lib/validations/pricing";

const SERVICE_TYPE_OPTIONS = [
  { value: "STANDARD", label: "Standard" },
  { value: "EXPRESS", label: "Express" },
];

export function CreatePricingRuleForm() {
  const zonesQuery = useZones();
  const createRule = useCreatePricingRule();

  const form = useForm<CreatePricingRuleFormValues>({
    resolver: zodResolver(createPricingRuleSchema),
    defaultValues: {
      originZoneId: "",
      destinationZoneId: "",
      serviceType: "STANDARD",
      minWeightKg: "0",
      maxWeightKg: "",
      basePrice: "",
      perKgRate: "",
    },
  });

  function onSubmit(values: CreatePricingRuleFormValues) {
    createRule.mutate(
      {
        originZoneId: values.originZoneId,
        destinationZoneId: values.destinationZoneId,
        serviceType: values.serviceType,
        minWeightKg: Number(values.minWeightKg),
        maxWeightKg: Number(values.maxWeightKg),
        basePrice: Number(values.basePrice),
        perKgRate: Number(values.perKgRate),
      },
      {
        onSuccess: () => form.reset(),
        onError: (error) => applyServerErrors(form, error),
      },
    );
  }

  const zoneOptions = (zonesQuery.data ?? []).map((zone) => ({ value: zone.id, label: zone.name }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Pricing Rule</CardTitle>
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
            <FormSelectField
              control={form.control}
              name="serviceType"
              label="Service type"
              options={SERVICE_TYPE_OPTIONS}
            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormTextField
                control={form.control}
                name="minWeightKg"
                label="Min weight (kg)"
                type="number"
                step="0.01"
                min="0"
              />
              <FormTextField
                control={form.control}
                name="maxWeightKg"
                label="Max weight (kg)"
                type="number"
                step="0.01"
                min="0"
              />
              <FormTextField
                control={form.control}
                name="basePrice"
                label="Base price"
                type="number"
                step="0.01"
                min="0"
              />
              <FormTextField
                control={form.control}
                name="perKgRate"
                label="Per-kg rate"
                type="number"
                step="0.01"
                min="0"
              />
            </div>
            <Button type="submit" disabled={createRule.isPending} className="self-start">
              {createRule.isPending ? "Creating..." : "Create rule"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
