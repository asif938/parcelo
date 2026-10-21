"use client";

import { Trash2 } from "lucide-react";

import { CreateZoneDialog } from "@/components/admin/create-zone-dialog";
import { EditZoneDialog } from "@/components/admin/edit-zone-dialog";
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
import { TableMessageRow } from "@/components/dashboard/table-message-row";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDeleteZone, useZones } from "@/hooks/use-zones";

const SKELETON_ROWS = 4;
const COL_SPAN = 4;

export function ZonesPanel() {
  const zonesQuery = useZones();
  const deleteZone = useDeleteZone();
  const zones = zonesQuery.data ?? [];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Zones</CardTitle>
        <CreateZoneDialog />
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Region</TableHead>
              <TableHead className="w-24" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {zonesQuery.isLoading &&
              Array.from({ length: SKELETON_ROWS }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-8 w-16" />
                  </TableCell>
                </TableRow>
              ))}

            {zonesQuery.isError && (
              <TableMessageRow colSpan={COL_SPAN}>
                <div className="flex flex-col items-center gap-2">
                  <span>
                    {zonesQuery.error instanceof Error
                      ? zonesQuery.error.message
                      : "Failed to load zones."}
                  </span>
                  <Button variant="outline" size="sm" onClick={() => zonesQuery.refetch()}>
                    Retry
                  </Button>
                </div>
              </TableMessageRow>
            )}

            {!zonesQuery.isLoading && !zonesQuery.isError && zones.length === 0 && (
              <TableMessageRow colSpan={COL_SPAN}>No zones yet.</TableMessageRow>
            )}

            {!zonesQuery.isLoading &&
              !zonesQuery.isError &&
              zones.map((zone) => (
                <TableRow key={zone.id}>
                  <TableCell className="font-medium">{zone.name}</TableCell>
                  <TableCell>{zone.city}</TableCell>
                  <TableCell>{zone.region ?? "—"}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <EditZoneDialog zone={zone} />
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Trash2 />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete this zone?</AlertDialogTitle>
                            <AlertDialogDescription>
                              {zone.name} will be removed from the zone list. This cannot be
                              undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Keep zone</AlertDialogCancel>
                            <AlertDialogAction
                              variant="destructive"
                              onClick={() => deleteZone.mutate(zone.id)}
                            >
                              Delete zone
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
