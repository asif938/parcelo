import { CheckCircle2, ClipboardList, Star, Truck } from "lucide-react";

import { StatCard } from "@/components/dashboard/stat-card";
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

const ASSIGNED_SHIPMENT_ROWS = 4;

export default function ProviderTasksPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">My Assigned Shipments</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Shipments assigned to you for pickup and delivery.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Assigned Tasks" icon={ClipboardList} />
        <StatCard label="In Progress" icon={Truck} />
        <StatCard label="Completed Today" icon={CheckCircle2} />
        <StatCard label="Rating" icon={Star} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Assigned Shipments</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tracking #</TableHead>
                <TableHead>Pickup</TableHead>
                <TableHead>Destination</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: ASSIGNED_SHIPMENT_ROWS }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="ml-auto h-5 w-20 rounded-full" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <p className="mt-4 text-center text-xs text-muted-foreground">
            Live task data connects to the API in Day 3.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
