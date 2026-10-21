"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
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
import { useCreateZone } from "@/hooks/use-zones";
import { applyServerErrors } from "@/lib/forms/apply-server-errors";
import { createZoneSchema, type CreateZoneFormValues } from "@/lib/validations/zone";

export function CreateZoneDialog() {
  const [open, setOpen] = useState(false);
  const createZone = useCreateZone();

  const form = useForm<CreateZoneFormValues>({
    resolver: zodResolver(createZoneSchema),
    defaultValues: { name: "", city: "", region: "" },
  });

  function onSubmit(values: CreateZoneFormValues) {
    createZone.mutate(
      { ...values, region: values.region || undefined },
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
          <Plus /> New zone
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Zone</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <FormTextField control={form.control} name="name" label="Name" placeholder="Downtown" />
            <FormTextField control={form.control} name="city" label="City" placeholder="New York" />
            <FormTextField
              control={form.control}
              name="region"
              label="Region (optional)"
              placeholder="Northeast"
            />
            <DialogFooter>
              <Button type="submit" disabled={createZone.isPending}>
                {createZone.isPending ? "Creating..." : "Create zone"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
