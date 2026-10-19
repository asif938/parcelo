"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { AddAddressDialog } from "@/components/shipments/add-address-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useAddresses } from "@/hooks/use-addresses";
import { useCreateShipment } from "@/hooks/use-shipments";
import { createShipmentSchema, type CreateShipmentFormValues } from "@/lib/validations/shipment";

export function CreateShipmentForm() {
  const router = useRouter();
  const addressesQuery = useAddresses();
  const createShipment = useCreateShipment();

  const form = useForm<CreateShipmentFormValues>({
    resolver: zodResolver(createShipmentSchema),
    defaultValues: {
      pickupAddressId: "",
      deliveryAddressId: "",
      serviceType: "STANDARD",
      parcelWeightKg: "",
      parcelDescription: "",
      parcelValue: "",
    },
  });

  function onSubmit(values: CreateShipmentFormValues) {
    createShipment.mutate(
      {
        pickupAddressId: values.pickupAddressId,
        deliveryAddressId: values.deliveryAddressId,
        serviceType: values.serviceType,
        parcelWeightKg: Number(values.parcelWeightKg),
        parcelDescription: values.parcelDescription || undefined,
        parcelValue: values.parcelValue ? Number(values.parcelValue) : undefined,
      },
      {
        onSuccess: (shipment) => {
          router.push(`/dashboard/shipments/${shipment.id}`);
        },
      },
    );
  }

  const addresses = addressesQuery.data ?? [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Shipment details</CardTitle>
      </CardHeader>
      <CardContent>
        {addressesQuery.isLoading ? (
          <div className="flex flex-col gap-3">
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
              {addresses.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  You don&apos;t have any saved addresses yet. Add one below to continue.
                </p>
              )}

              <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                <div className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="pickupAddressId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pickup address</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select address" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {addresses.map((address) => (
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
                            {addresses.map((address) => (
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
                </div>
                <AddAddressDialog
                  onCreated={(address) => {
                    if (!form.getValues("pickupAddressId")) {
                      form.setValue("pickupAddressId", address.id);
                    } else if (!form.getValues("deliveryAddressId")) {
                      form.setValue("deliveryAddressId", address.id);
                    }
                  }}
                />
              </div>

              <FormField
                control={form.control}
                name="serviceType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select service" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="STANDARD">Standard</SelectItem>
                        <SelectItem value="EXPRESS">Express</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="parcelWeightKg"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Parcel weight (kg)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" min="0" placeholder="2.5" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="parcelDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (optional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="What's in the parcel?" {...field} />
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
                      <Input type="number" step="0.01" min="0" placeholder="0.00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={createShipment.isPending} className="self-start">
                {createShipment.isPending ? "Creating..." : "Create shipment"}
              </Button>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
}
