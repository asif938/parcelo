"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { UserCog } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCouriers } from "@/hooks/use-couriers";
import { useAssignCourier } from "@/hooks/use-shipments";
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
      { onSuccess: () => setOpen(false) },
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
            <FormField
              control={form.control}
              name="courierId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Courier</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue
                          placeholder={couriersQuery.isLoading ? "Loading..." : "Select courier"}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {(couriersQuery.data ?? []).map((courier) => (
                        <SelectItem key={courier.id} value={courier.id}>
                          {courier.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
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
