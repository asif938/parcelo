"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

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
import { useUpdateZone } from "@/hooks/use-zones";
import { applyServerErrors } from "@/lib/forms/apply-server-errors";
import { updateZoneSchema, type UpdateZoneFormValues } from "@/lib/validations/zone";
import type { Zone } from "@/types/zone";

export function EditZoneDialog({ zone }: { zone: Zone }) {
  const [open, setOpen] = useState(false);
  const updateZone = useUpdateZone();

  const form = useForm<UpdateZoneFormValues>({
    resolver: zodResolver(updateZoneSchema),
    defaultValues: {
      name: zone.name,
      city: zone.city,
      region: zone.region ?? "",
    },
  });

  function onSubmit(values: UpdateZoneFormValues) {
    updateZone.mutate(
      { id: zone.id, ...values, region: values.region || undefined },
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
          <Pencil />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Zone</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <FormTextField control={form.control} name="name" label="Name" />
            <FormTextField control={form.control} name="city" label="City" />
            <FormTextField control={form.control} name="region" label="Region (optional)" />
            <DialogFooter>
              <Button type="submit" disabled={updateZone.isPending}>
                {updateZone.isPending ? "Saving..." : "Save changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
