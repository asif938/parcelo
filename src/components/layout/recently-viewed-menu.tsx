"use client";

import { History } from "lucide-react";
import Link from "next/link";

import type { AppRole } from "@/components/layout/nav-config";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ROLE_HOME } from "@/lib/routes";
import { SHIPMENT_STATUS_LABEL, shipmentStatusBadgeVariant } from "@/lib/shipment-status";
import { useRecentlyViewedStore } from "@/stores/recently-viewed-store";

export function RecentlyViewedMenu({ role }: { role: AppRole }) {
  const items = useRecentlyViewedStore((state) => state.items);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-sm" aria-label="Recently viewed shipments">
          <History className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>Recently viewed</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {items.length === 0 ? (
          <p className="px-2 py-3 text-sm text-muted-foreground">
            Shipments you open will show up here.
          </p>
        ) : (
          items.map((item) => (
            <DropdownMenuItem key={item.id} asChild>
              <Link
                href={`${ROLE_HOME[role]}/shipments/${item.id}`}
                className="flex items-center justify-between gap-2"
              >
                <span className="truncate text-sm">{item.trackingNumber}</span>
                <Badge
                  variant={shipmentStatusBadgeVariant(item.status)}
                  className="shrink-0 text-[10px]"
                >
                  {SHIPMENT_STATUS_LABEL[item.status]}
                </Badge>
              </Link>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
