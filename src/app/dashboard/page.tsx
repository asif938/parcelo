import { CheckCircle2, Package, PackagePlus, Truck, Wallet } from "lucide-react";
import Link from "next/link";

import { StatCard } from "@/components/dashboard/stat-card";
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

const RECENT_SHIPMENT_ROWS = 4;

export default function DashboardOverviewPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">My Shipments</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Track and manage the shipments you&apos;ve created.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/shipments/new">
            <PackagePlus /> New Shipment
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Active Shipments" icon={Package} />
        <StatCard label="In Transit" icon={Truck} />
        <StatCard label="Delivered" icon={CheckCircle2} />
        <StatCard label="Total Spent" icon={Wallet} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Shipments</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tracking #</TableHead>
                <TableHead>Destination</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: RECENT_SHIPMENT_ROWS }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-20 rounded-full" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="ml-auto h-4 w-20" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <p className="mt-4 text-center text-xs text-muted-foreground">
            Live shipment data connects to the API in Day 3.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
