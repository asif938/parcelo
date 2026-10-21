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
import { useCreateHub } from "@/hooks/use-hubs";
import { useZones } from "@/hooks/use-zones";
import { applyServerErrors } from "@/lib/forms/apply-server-errors";
import { createHubSchema, type CreateHubFormValues } from "@/lib/validations/hub";

export function CreateHubDialog() {
  const [open, setOpen] = useState(false);
  const zonesQuery = useZones();
  const createHub = useCreateHub();

  const form = useForm<CreateHubFormValues>({
    resolver: zodResolver(createHubSchema),
    defaultValues: { code: "", name: "", address: "", zoneId: "", capacity: "1000" },
  });

  function onSubmit(values: CreateHubFormValues) {
    createHub.mutate(
      { ...values, capacity: Number(values.capacity) },
      {
        onSuccess: () => {
          setOpen(false);
          form.reset();
        },
        onError: (error) => applyServerErrors(form, error),
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus /> New hub
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Hub</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <FormTextField control={form.control} name="code" label="Code" placeholder="NYC-01" />
            <FormTextField
              control={form.control}
              name="name"
              label="Name"
              placeholder="Manhattan Sorting Hub"
            />
            <FormTextField
              control={form.control}
              name="address"
              label="Address"
              placeholder="100 Hub Way, New York"
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
            <FormTextField
              control={form.control}
              name="capacity"
              label="Capacity"
              type="number"
              min="1"
              step="1"
            />
            <DialogFooter>
              <Button type="submit" disabled={createHub.isPending}>
                {createHub.isPending ? "Creating..." : "Create hub"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
