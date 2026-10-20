"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ListChecks } from "lucide-react";
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
import { useUpdateShipmentStatus } from "@/hooks/use-shipments";
import { applyServerErrors } from "@/lib/forms/apply-server-errors";
import { SHIPMENT_STATUS_LABEL, SHIPMENT_STATUSES } from "@/lib/shipment-status";
import { updateStatusSchema, type UpdateStatusFormValues } from "@/lib/validations/shipment";
import type { ShipmentStatus } from "@/types/shipment";

export function UpdateStatusDialog({
  shipmentId,
  currentStatus,
}: {
  shipmentId: string;
  currentStatus: ShipmentStatus;
}) {
  const [open, setOpen] = useState(false);
  const updateStatus = useUpdateShipmentStatus();

  const form = useForm<UpdateStatusFormValues>({
    resolver: zodResolver(updateStatusSchema),
    defaultValues: { status: currentStatus, note: "", location: "" },
  });

  function onSubmit(values: UpdateStatusFormValues) {
    updateStatus.mutate(
      {
        id: shipmentId,
        input: {
          status: values.status,
          note: values.note || undefined,
          location: values.location || undefined,
        },
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
          <ListChecks /> Update status
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Status</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <FormSelectField
              control={form.control}
              name="status"
              label="New status"
              placeholder="Select status"
              options={SHIPMENT_STATUSES.map((status) => ({
                value: status,
                label: SHIPMENT_STATUS_LABEL[status],
              }))}
            />
            <FormTextField
              control={form.control}
              name="location"
              label="Location (optional)"
              placeholder="e.g. Chicago hub"
            />
            <FormTextareaField
              control={form.control}
              name="note"
              label="Note (optional)"
              placeholder="What happened?"
            />
            <DialogFooter>
              <Button type="submit" disabled={updateStatus.isPending}>
                {updateStatus.isPending ? "Updating..." : "Update status"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
