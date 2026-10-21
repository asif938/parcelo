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
import { useUpdateHub } from "@/hooks/use-hubs";
import { applyServerErrors } from "@/lib/forms/apply-server-errors";
import { updateHubSchema, type UpdateHubFormValues } from "@/lib/validations/hub";
import type { Hub } from "@/types/hub";

export function EditHubDialog({ hub }: { hub: Hub }) {
  const [open, setOpen] = useState(false);
  const updateHub = useUpdateHub();

  const form = useForm<UpdateHubFormValues>({
    resolver: zodResolver(updateHubSchema),
    defaultValues: {
      name: hub.name,
      address: hub.address,
      capacity: String(hub.capacity),
    },
  });

  function onSubmit(values: UpdateHubFormValues) {
    updateHub.mutate(
      { id: hub.id, ...values, capacity: Number(values.capacity) },
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
          <DialogTitle>Edit Hub</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <FormTextField control={form.control} name="name" label="Name" />
            <FormTextField control={form.control} name="address" label="Address" />
            <FormTextField
              control={form.control}
              name="capacity"
              label="Capacity"
              type="number"
              min="1"
              step="1"
            />
            <DialogFooter>
              <Button type="submit" disabled={updateHub.isPending}>
                {updateHub.isPending ? "Saving..." : "Save changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
