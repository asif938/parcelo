"use client";

import { Trash2 } from "lucide-react";

import { CreateHubDialog } from "@/components/admin/create-hub-dialog";
import { EditHubDialog } from "@/components/admin/edit-hub-dialog";
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
import { Badge } from "@/components/ui/badge";
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
import { useDeleteHub, useHubs, useUpdateHub } from "@/hooks/use-hubs";

const SKELETON_ROWS = 4;
const COL_SPAN = 6;

export function HubsPanel() {
  const hubsQuery = useHubs();
  const updateHub = useUpdateHub();
  const deleteHub = useDeleteHub();
  const hubs = hubsQuery.data ?? [];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Hubs</CardTitle>
        <CreateHubDialog />
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Zone</TableHead>
              <TableHead className="text-right">Capacity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-24" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {hubsQuery.isLoading &&
              Array.from({ length: SKELETON_ROWS }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="ml-auto h-4 w-12" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-8 w-16" />
                  </TableCell>
                </TableRow>
              ))}

            {hubsQuery.isError && (
              <TableMessageRow colSpan={COL_SPAN}>
                <div className="flex flex-col items-center gap-2">
                  <span>
                    {hubsQuery.error instanceof Error
                      ? hubsQuery.error.message
                      : "Failed to load hubs."}
                  </span>
                  <Button variant="outline" size="sm" onClick={() => hubsQuery.refetch()}>
                    Retry
                  </Button>
                </div>
              </TableMessageRow>
            )}

            {!hubsQuery.isLoading && !hubsQuery.isError && hubs.length === 0 && (
              <TableMessageRow colSpan={COL_SPAN}>No hubs yet.</TableMessageRow>
            )}

            {!hubsQuery.isLoading &&
              !hubsQuery.isError &&
              hubs.map((hub) => (
                <TableRow key={hub.id}>
                  <TableCell className="font-medium">{hub.code}</TableCell>
                  <TableCell>{hub.name}</TableCell>
                  <TableCell>{hub.zone.name}</TableCell>
                  <TableCell className="text-right">{hub.capacity}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={updateHub.isPending}
                      onClick={() => updateHub.mutate({ id: hub.id, isActive: !hub.isActive })}
                    >
                      <Badge variant={hub.isActive ? "secondary" : "destructive"}>
                        {hub.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </Button>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <EditHubDialog hub={hub} />
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Trash2 />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete this hub?</AlertDialogTitle>
                            <AlertDialogDescription>
                              {hub.name} will be deactivated and removed from the hub list. This
                              cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Keep hub</AlertDialogCancel>
                            <AlertDialogAction
                              variant="destructive"
                              onClick={() => deleteHub.mutate(hub.id)}
                            >
                              Delete hub
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
