"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import type { FieldPath } from "react-hook-form";

import { FormSelectField } from "@/components/forms/form-select-field";
import { FormTextField } from "@/components/forms/form-text-field";
import { FormTextareaField } from "@/components/forms/form-textarea-field";
import { StepIndicator } from "@/components/forms/step-indicator";
import { AddAddressDialog } from "@/components/shipments/add-address-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useAddresses } from "@/hooks/use-addresses";
import { useMultiStepForm } from "@/hooks/use-multi-step-form";
import { useCreateShipment } from "@/hooks/use-shipments";
import { applyServerErrors } from "@/lib/forms/apply-server-errors";
import { createShipmentSchema, type CreateShipmentFormValues } from "@/lib/validations/shipment";

const STEPS = ["Addresses", "Parcel & service", "Review"];

const STEP_FIELDS: FieldPath<CreateShipmentFormValues>[][] = [
  ["pickupAddressId", "deliveryAddressId"],
  ["serviceType", "parcelWeightKg", "parcelDescription", "parcelValue"],
  [],
];

const SERVICE_TYPE_LABEL: Record<CreateShipmentFormValues["serviceType"], string> = {
  STANDARD: "Standard",
  EXPRESS: "Express",
};

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

  const { step, isFirstStep, isLastStep, goNext, goBack } = useMultiStepForm(form, STEP_FIELDS);

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
  const values = form.getValues();
  const pickupAddress = addresses.find((address) => address.id === values.pickupAddressId);
  const deliveryAddress = addresses.find((address) => address.id === values.deliveryAddressId);

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
            <form
              onSubmit={(event) => {
                if (!isLastStep) {
                  event.preventDefault();
                  goNext();
                  return;
                }
                form.handleSubmit(onSubmit)(event);
              }}
              className="flex flex-col gap-6"
            >
              <StepIndicator steps={STEPS} currentStep={step} />

              {addresses.length === 0 && step === 0 && (
                <p className="text-sm text-muted-foreground">
                  You don&apos;t have any saved addresses yet. Add one below to continue.
                </p>
              )}

              {step === 0 && (
                <div className="flex flex-col gap-4">
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
                </div>
              )}

              {step === 1 && (
                <div className="flex flex-col gap-5">
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
                </div>
              )}

              {step === 2 && (
                <div className="flex flex-col gap-4 rounded-md border p-4 text-sm">
                  <div className="flex items-start justify-between gap-4">
                    <span className="text-muted-foreground">Pickup address</span>
                    <span className="text-right font-medium">
                      {pickupAddress ? `${pickupAddress.label} — ${pickupAddress.city}` : "—"}
                    </span>
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <span className="text-muted-foreground">Delivery address</span>
                    <span className="text-right font-medium">
                      {deliveryAddress ? `${deliveryAddress.label} — ${deliveryAddress.city}` : "—"}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex items-start justify-between gap-4">
                    <span className="text-muted-foreground">Service type</span>
                    <span className="text-right font-medium">
                      {SERVICE_TYPE_LABEL[values.serviceType]}
                    </span>
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <span className="text-muted-foreground">Parcel weight</span>
                    <span className="text-right font-medium">{values.parcelWeightKg} kg</span>
                  </div>
                  {values.parcelDescription && (
                    <div className="flex items-start justify-between gap-4">
                      <span className="text-muted-foreground">Description</span>
                      <span className="text-right font-medium">{values.parcelDescription}</span>
                    </div>
                  )}
                  {values.parcelValue && (
                    <div className="flex items-start justify-between gap-4">
                      <span className="text-muted-foreground">Declared value</span>
                      <span className="text-right font-medium">${values.parcelValue}</span>
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between">
                {!isFirstStep ? (
                  <Button type="button" variant="outline" onClick={goBack}>
                    Back
                  </Button>
                ) : (
                  <span />
                )}
                {isLastStep ? (
                  <Button type="submit" disabled={createShipment.isPending}>
                    {createShipment.isPending ? "Creating..." : "Create shipment"}
                  </Button>
                ) : (
                  <Button type="button" onClick={goNext}>
                    Next
                  </Button>
                )}
              </div>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
}
