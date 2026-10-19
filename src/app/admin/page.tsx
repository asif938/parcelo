import { AlertTriangle, Building2, Package, ScrollText, Tag, Users, Wallet } from "lucide-react";
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

const RECENT_ACTIVITY_ROWS = 5;

const QUICK_LINKS = [
  { title: "Manage Users", href: "/admin/users", icon: Users },
  { title: "Zones & Hubs", href: "/admin/zones-hubs", icon: Building2 },
  { title: "Pricing", href: "/admin/pricing", icon: Tag },
  { title: "Audit Logs", href: "/admin/audit-logs", icon: ScrollText },
];

export default function AdminOverviewPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Platform Overview</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Monitor shipments, couriers, and revenue across Parcelo.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Shipments" icon={Package} />
        <StatCard label="Active Couriers" icon={Users} />
        <StatCard label="Total Revenue" icon={Wallet} />
        <StatCard label="Open Issues" icon={AlertTriangle} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {QUICK_LINKS.map((link) => (
          <Button key={link.href} asChild variant="outline" className="h-auto justify-start py-3">
            <Link href={link.href}>
              <link.icon /> {link.title}
            </Link>
          </Button>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event</TableHead>
                <TableHead>User</TableHead>
                <TableHead className="text-right">Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: RECENT_ACTIVITY_ROWS }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton className="h-4 w-40" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-28" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="ml-auto h-4 w-16" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <p className="mt-4 text-center text-xs text-muted-foreground">
            Live audit log data connects to the API in Day 3.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
