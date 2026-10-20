"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { FormSelectField } from "@/components/forms/form-select-field";
import { FormTextField } from "@/components/forms/form-text-field";
import { FormTextareaField } from "@/components/forms/form-textarea-field";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useAddresses } from "@/hooks/use-addresses";
import { useUpdateShipment } from "@/hooks/use-shipments";
import { applyServerErrors } from "@/lib/forms/apply-server-errors";
import { updateShipmentSchema, type UpdateShipmentFormValues } from "@/lib/validations/shipment";
import type { Shipment } from "@/types/shipment";

export function UpdateShipmentDialog({ shipment }: { shipment: Shipment }) {
  const [open, setOpen] = useState(false);
  const addressesQuery = useAddresses();
  const updateShipment = useUpdateShipment(shipment.id);

  const form = useForm<UpdateShipmentFormValues>({
    resolver: zodResolver(updateShipmentSchema),
    defaultValues: {
      deliveryAddressId: shipment.deliveryAddress.id,
      parcelDescription: shipment.parcelDescription ?? "",
      parcelValue: "",
    },
  });

  function onSubmit(values: UpdateShipmentFormValues) {
    updateShipment.mutate(
      {
        deliveryAddressId: values.deliveryAddressId,
        parcelDescription: values.parcelDescription || undefined,
        parcelValue: values.parcelValue ? Number(values.parcelValue) : undefined,
      },
      {
        onSuccess: () => setOpen(false),
        onError: (error) => applyServerErrors(form, error),
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Pencil /> Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Shipment</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <FormSelectField
              control={form.control}
              name="deliveryAddressId"
              label="Delivery address"
              placeholder="Select address"
              options={(addressesQuery.data ?? []).map((address) => ({
                value: address.id,
                label: `${address.label} — ${address.city}`,
              }))}
            />
            <FormTextareaField control={form.control} name="parcelDescription" label="Description" />
            <FormTextField
              control={form.control}
              name="parcelValue"
              label="Declared value (optional)"
              type="number"
              step="0.01"
              min="0"
            />
            <DialogFooter>
              <Button type="submit" disabled={updateShipment.isPending}>
                {updateShipment.isPending ? "Saving..." : "Save changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
