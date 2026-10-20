"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { UserCog } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { FormSelectField } from "@/components/forms/form-select-field";
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
import { useCouriers } from "@/hooks/use-couriers";
import { useAssignCourier } from "@/hooks/use-shipments";
import { applyServerErrors } from "@/lib/forms/apply-server-errors";
import { assignCourierSchema, type AssignCourierFormValues } from "@/lib/validations/shipment";

export function AssignCourierDialog({ shipmentId }: { shipmentId: string }) {
  const [open, setOpen] = useState(false);
  const couriersQuery = useCouriers();
  const assignCourier = useAssignCourier();

  const form = useForm<AssignCourierFormValues>({
    resolver: zodResolver(assignCourierSchema),
    defaultValues: { courierId: "" },
  });

  function onSubmit(values: AssignCourierFormValues) {
    assignCourier.mutate(
      { id: shipmentId, input: values },
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
          <UserCog /> Assign courier
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Assign Courier</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <FormSelectField
              control={form.control}
              name="courierId"
              label="Courier"
              placeholder={couriersQuery.isLoading ? "Loading..." : "Select courier"}
              options={(couriersQuery.data ?? []).map((courier) => ({
                value: courier.id,
                label: courier.name,
              }))}
            />
            <DialogFooter>
              <Button type="submit" disabled={assignCourier.isPending}>
                {assignCourier.isPending ? "Assigning..." : "Assign courier"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
