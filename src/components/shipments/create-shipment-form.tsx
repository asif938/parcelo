"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { FormSelectField } from "@/components/forms/form-select-field";
import { FormTextField } from "@/components/forms/form-text-field";
import { FormTextareaField } from "@/components/forms/form-textarea-field";
import { AddAddressDialog } from "@/components/shipments/add-address-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { useAddresses } from "@/hooks/use-addresses";
import { useCreateShipment } from "@/hooks/use-shipments";
import { applyServerErrors } from "@/lib/forms/apply-server-errors";
import { createShipmentSchema, type CreateShipmentFormValues } from "@/lib/validations/shipment";

export function CreateShipmentForm() {
  const router = useRouter();
  const addressesQuery = useAddresses();
  const createShipment = useCreateShipment();

  const form = useForm<CreateShipmentFormValues>({
    resolver: zodResolver(createShipmentSchema),
    defaultValues: {
      pickupAddressId: "",
      deliveryAddressId: "",
      serviceType: "STANDARD",
      parcelWeightKg: "",
      parcelDescription: "",
      parcelValue: "",
    },
  });

  function onSubmit(values: CreateShipmentFormValues) {
    createShipment.mutate(
      {
        pickupAddressId: values.pickupAddressId,
        deliveryAddressId: values.deliveryAddressId,
        serviceType: values.serviceType,
        parcelWeightKg: Number(values.parcelWeightKg),
        parcelDescription: values.parcelDescription || undefined,
        parcelValue: values.parcelValue ? Number(values.parcelValue) : undefined,
      },
      {
        onSuccess: (shipment) => {
          router.push(`/dashboard/shipments/${shipment.id}`);
        },
        onError: (error) => applyServerErrors(form, error),
      },
    );
  }

  const addresses = addressesQuery.data ?? [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Shipment details</CardTitle>
      </CardHeader>
      <CardContent>
        {addressesQuery.isLoading ? (
          <div className="flex flex-col gap-3">
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
              {addresses.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  You don&apos;t have any saved addresses yet. Add one below to continue.
                </p>
              )}

              <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                <div className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormSelectField
                    control={form.control}
                    name="pickupAddressId"
                    label="Pickup address"
                    placeholder="Select address"
                    options={addresses.map((address) => ({
                      value: address.id,
                      label: `${address.label} — ${address.city}`,
                    }))}
                  />
                  <FormSelectField
                    control={form.control}
                    name="deliveryAddressId"
                    label="Delivery address"
                    placeholder="Select address"
                    options={addresses.map((address) => ({
                      value: address.id,
                      label: `${address.label} — ${address.city}`,
                    }))}
                  />
                </div>
                <AddAddressDialog
                  onCreated={(address) => {
                    if (!form.getValues("pickupAddressId")) {
                      form.setValue("pickupAddressId", address.id);
                    } else if (!form.getValues("deliveryAddressId")) {
                      form.setValue("deliveryAddressId", address.id);
                    }
                  }}
                />
              </div>

              <FormSelectField
                control={form.control}
                name="serviceType"
                label="Service type"
                placeholder="Select service"
                options={[
                  { value: "STANDARD", label: "Standard" },
                  { value: "EXPRESS", label: "Express" },
                ]}
              />

              <FormTextField
                control={form.control}
                name="parcelWeightKg"
                label="Parcel weight (kg)"
                type="number"
                step="0.1"
                min="0"
                placeholder="2.5"
              />

              <FormTextareaField
                control={form.control}
                name="parcelDescription"
                label="Description (optional)"
                placeholder="What's in the parcel?"
              />

              <FormTextField
                control={form.control}
                name="parcelValue"
                label="Declared value (optional)"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
              />

              <Button type="submit" disabled={createShipment.isPending} className="self-start">
                {createShipment.isPending ? "Creating..." : "Create shipment"}
              </Button>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
}
