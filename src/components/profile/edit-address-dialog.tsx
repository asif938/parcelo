"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { FormSelectField } from "@/components/forms/form-select-field";
import { FormTextField } from "@/components/forms/form-text-field";
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
import { useUpdateAddress } from "@/hooks/use-addresses";
import { useZones } from "@/hooks/use-zones";
import { applyServerErrors } from "@/lib/forms/apply-server-errors";
import { updateAddressSchema, type UpdateAddressFormValues } from "@/lib/validations/shipment";
import type { Address } from "@/types/address";

export function EditAddressDialog({ address }: { address: Address }) {
  const [open, setOpen] = useState(false);
  const zonesQuery = useZones();
  const updateAddress = useUpdateAddress();

  const form = useForm<UpdateAddressFormValues>({
    resolver: zodResolver(updateAddressSchema),
    defaultValues: {
      label: address.label,
      addressLine: address.addressLine,
      city: address.city,
      zoneId: address.zoneId ?? "",
      contactName: address.contactName,
      contactPhone: address.contactPhone,
    },
  });

  function onSubmit(values: UpdateAddressFormValues) {
    updateAddress.mutate(
      { id: address.id, ...values },
      {
        onSuccess: () => setOpen(false),
        onError: (error) => applyServerErrors(form, error),
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" size="sm">
          <Pencil />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Address</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <FormTextField
              control={form.control}
              name="label"
              label="Label"
              placeholder="Home, Office, Warehouse..."
            />
            <FormTextField
              control={form.control}
              name="addressLine"
              label="Address"
              placeholder="123 Main St"
            />
            <div className="grid grid-cols-2 gap-4">
              <FormTextField
                control={form.control}
                name="city"
                label="City"
                placeholder="New York"
              />
              <FormSelectField
                control={form.control}
                name="zoneId"
                label="Zone"
                placeholder={zonesQuery.isLoading ? "Loading..." : "Select zone"}
                options={(zonesQuery.data ?? []).map((zone) => ({
                  value: zone.id,
                  label: zone.name,
                }))}
              />
            </div>
            <FormTextField
              control={form.control}
              name="contactName"
              label="Contact name"
              placeholder="Jane Doe"
            />
            <FormTextField
              control={form.control}
              name="contactPhone"
              label="Contact phone"
              type="tel"
              placeholder="+1 555 010 0100"
            />
            <DialogFooter>
              <Button type="submit" disabled={updateAddress.isPending}>
                {updateAddress.isPending ? "Saving..." : "Save changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
