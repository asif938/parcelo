"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchJson } from "@/lib/api/client";
import type { CourierListResult } from "@/types/admin";

export function useCouriers() {
  return useQuery({
    queryKey: ["admin", "couriers"],
    queryFn: async () =>
      (await fetchJson<CourierListResult>("/api/admin/couriers?limit=50")).users,
  });
}
