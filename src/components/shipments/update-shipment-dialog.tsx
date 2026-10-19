"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAddresses } from "@/hooks/use-addresses";
import { useUpdateShipment } from "@/hooks/use-shipments";
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
      { onSuccess: () => setOpen(false) },
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
            <FormField
              control={form.control}
              name="deliveryAddressId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Delivery address</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select address" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {(addressesQuery.data ?? []).map((address) => (
                        <SelectItem key={address.id} value={address.id}>
                          {address.label} — {address.city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="parcelDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="parcelValue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Declared value (optional)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" min="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
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
