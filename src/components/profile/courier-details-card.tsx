"use client";

import { Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useUpdateAvailability } from "@/hooks/use-courier-self";
import { useMyProfile } from "@/hooks/use-profile";
import { useZones } from "@/hooks/use-zones";

const VEHICLE_TYPE_LABEL: Record<string, string> = {
  BICYCLE: "Bicycle",
  MOTORBIKE: "Motorbike",
  VAN: "Van",
  TRUCK: "Truck",
};

export function CourierDetailsCard() {
  const profileQuery = useMyProfile();
  const zonesQuery = useZones();
  const updateAvailability = useUpdateAvailability();

  if (profileQuery.isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </CardContent>
      </Card>
    );
  }

  const courierProfile = profileQuery.data?.courierProfile;

  if (profileQuery.isError || !courierProfile) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-2 pt-6 text-center text-sm">
          <span>
            {profileQuery.error instanceof Error
              ? profileQuery.error.message
              : "No courier profile found."}
          </span>
        </CardContent>
      </Card>
    );
  }

  const zoneName =
    zonesQuery.data?.find((zone) => zone.id === courierProfile.zoneId)?.name ??
    courierProfile.zoneId ??
    "Unassigned";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Courier Details</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Availability</span>
          <Button
            variant="outline"
            size="sm"
            disabled={updateAvailability.isPending}
            onClick={() => updateAvailability.mutate(!courierProfile.isAvailable)}
          >
            <Badge variant={courierProfile.isAvailable ? "secondary" : "outline"}>
              {courierProfile.isAvailable ? "Available" : "Unavailable"}
            </Badge>
          </Button>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Vehicle</span>
          <span className="font-medium">{VEHICLE_TYPE_LABEL[courierProfile.vehicleType]}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">License number</span>
          <span className="font-medium">{courierProfile.licenseNumber}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Zone</span>
          <span className="font-medium">{zoneName}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Rating</span>
          <span className="flex items-center gap-1 font-medium">
            <Star className="size-3.5 fill-current" /> {courierProfile.rating}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Total deliveries</span>
          <span className="font-medium">{courierProfile.totalDeliveries}</span>
        </div>
      </CardContent>
    </Card>
  );
}
