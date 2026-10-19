"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchJson } from "@/lib/api/client";
import type { ZoneListResult } from "@/types/zone";

export function useZones() {
  return useQuery({
    queryKey: ["zones"],
    queryFn: async () => (await fetchJson<ZoneListResult>("/api/zones")).zones,
    staleTime: 10 * 60 * 1000,
  });
}
