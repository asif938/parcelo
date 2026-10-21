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
import { ROLE_LABEL } from "@/components/layout/nav-config";
import type { AdminRole } from "@/types/admin";

const ROLE_OPTIONS: AdminRole[] = ["CUSTOMER", "COURIER", "ADMIN"];
const ALL_VALUE = "ALL";

export function UsersFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchInput, setSearchInput] = useState(searchParams.get("q") ?? "");
  const debouncedSearch = useDebouncedValue(searchInput, 400);

  const role = searchParams.get("role") ?? ALL_VALUE;
  const status = searchParams.get("isActive") ?? ALL_VALUE;

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

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === ALL_VALUE) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    params.set("page", "1");
    router.replace(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Input
        placeholder="Search by name or email..."
        value={searchInput}
        onChange={(event) => setSearchInput(event.target.value)}
        className="max-w-xs"
      />
      <Select value={role} onValueChange={(value) => updateParam("role", value)}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="All roles" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL_VALUE}>All roles</SelectItem>
          {ROLE_OPTIONS.map((value) => (
            <SelectItem key={value} value={value}>
              {ROLE_LABEL[value]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={status} onValueChange={(value) => updateParam("isActive", value)}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="All statuses" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL_VALUE}>All statuses</SelectItem>
          <SelectItem value="true">Active</SelectItem>
          <SelectItem value="false">Suspended</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
