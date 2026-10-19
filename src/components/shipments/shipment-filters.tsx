"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { SHIPMENT_STATUS_LABEL } from "@/lib/shipment-status";
import type { ShipmentStatus } from "@/types/shipment";

const STATUS_OPTIONS = Object.keys(SHIPMENT_STATUS_LABEL) as ShipmentStatus[];
const ALL_STATUSES_VALUE = "ALL";

export function ShipmentFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchInput, setSearchInput] = useState(searchParams.get("q") ?? "");
  const debouncedSearch = useDebouncedValue(searchInput, 400);

  const status = searchParams.get("status") ?? ALL_STATUSES_VALUE;
  const isSearching = (searchParams.get("q") ?? "").trim().length > 0;

  useEffect(() => {
    const currentQ = searchParams.get("q") ?? "";
    const trimmed = debouncedSearch.trim();
    if (trimmed === currentQ) return;

    const params = new URLSearchParams(searchParams.toString());
    if (trimmed) {
      params.set("q", trimmed);
    } else {
      params.delete("q");
    }
    params.set("page", "1");
    router.replace(`${pathname}?${params.toString()}`);
  }, [debouncedSearch, pathname, router, searchParams]);

  function updateStatus(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === ALL_STATUSES_VALUE) {
      params.delete("status");
    } else {
      params.set("status", value);
    }
    params.set("page", "1");
    router.replace(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Input
        placeholder="Search by tracking #, city, or recipient..."
        value={searchInput}
        onChange={(event) => setSearchInput(event.target.value)}
        className="max-w-xs"
      />
      <Select value={status} onValueChange={updateStatus} disabled={isSearching}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="All statuses" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL_STATUSES_VALUE}>All statuses</SelectItem>
          {STATUS_OPTIONS.map((value) => (
            <SelectItem key={value} value={value}>
              {SHIPMENT_STATUS_LABEL[value]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {isSearching && (
        <p className="text-xs text-muted-foreground">Clear search to filter by status.</p>
      )}
    </div>
  );
}
