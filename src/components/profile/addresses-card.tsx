"use client";

import { Trash2 } from "lucide-react";

import { EditAddressDialog } from "@/components/profile/edit-address-dialog";
import { AddAddressDialog } from "@/components/shipments/add-address-dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAddresses, useDeleteAddress } from "@/hooks/use-addresses";

export function AddressesCard() {
  const addressesQuery = useAddresses();
  const deleteAddress = useDeleteAddress();
  const addresses = addressesQuery.data ?? [];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>My Addresses</CardTitle>
        <AddAddressDialog onCreated={() => {}} />
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {addressesQuery.isLoading &&
          Array.from({ length: 2 }).map((_, index) => (
            <Skeleton key={index} className="h-16 w-full" />
          ))}

        {addressesQuery.isError && (
          <p className="text-sm text-muted-foreground">
            {addressesQuery.error instanceof Error
              ? addressesQuery.error.message
              : "Failed to load addresses."}
          </p>
        )}

        {!addressesQuery.isLoading && !addressesQuery.isError && addresses.length === 0 && (
          <p className="text-sm text-muted-foreground">
            You haven&apos;t added any addresses yet.
          </p>
        )}

        {!addressesQuery.isLoading &&
          !addressesQuery.isError &&
          addresses.map((address) => (
            <div key={address.id} className="flex items-start justify-between gap-3 rounded-md border p-3 text-sm">
              <div>
                <p className="font-medium">{address.label}</p>
                <p className="text-muted-foreground">
                  {address.addressLine}, {address.city}
                </p>
                <p className="text-muted-foreground">
                  {address.contactName} · {address.contactPhone}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <EditAddressDialog address={address} />
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button type="button" variant="outline" size="sm">
                      <Trash2 />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete this address?</AlertDialogTitle>
                      <AlertDialogDescription>
                        {address.label} will be removed from your saved addresses. This cannot be
                        undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Keep address</AlertDialogCancel>
                      <AlertDialogAction
                        variant="destructive"
                        onClick={() => deleteAddress.mutate(address.id)}
                      >
                        Delete address
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
      </CardContent>
    </Card>
  );
}
