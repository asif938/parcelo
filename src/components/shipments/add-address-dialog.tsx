"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
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
import { useCreateAddress } from "@/hooks/use-addresses";
import { useZones } from "@/hooks/use-zones";
import { applyServerErrors } from "@/lib/forms/apply-server-errors";
import { createAddressSchema, type CreateAddressFormValues } from "@/lib/validations/shipment";
import type { Address } from "@/types/address";

export function AddAddressDialog({ onCreated }: { onCreated: (address: Address) => void }) {
  const [open, setOpen] = useState(false);
  const zonesQuery = useZones();
  const createAddress = useCreateAddress();

  const form = useForm<CreateAddressFormValues>({
    resolver: zodResolver(createAddressSchema),
    defaultValues: {
      label: "",
      addressLine: "",
      city: "",
      zoneId: "",
      contactName: "",
      contactPhone: "",
    },
  });

  function onSubmit(values: CreateAddressFormValues) {
    createAddress.mutate(values, {
      onSuccess: (address) => {
        onCreated(address);
        setOpen(false);
        form.reset();
      },
      onError: (error) => applyServerErrors(form, error),
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" size="sm">
          <Plus /> Add new address
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Address</DialogTitle>
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
              <Button type="submit" disabled={createAddress.isPending}>
                {createAddress.isPending ? "Adding..." : "Add address"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
