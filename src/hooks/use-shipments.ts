"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchJson, toQueryString } from "@/lib/api/client";
import type { ShipmentListResult } from "@/types/shipment";

interface ShipmentQueryParams {
  limit?: number;
  page?: number;
  status?: string;
  sortBy?: "createdAt" | "updatedAt" | "priceAmount";
  sortOrder?: "asc" | "desc";
}

export function useShipments(params: ShipmentQueryParams = {}) {
  return useQuery({
    queryKey: ["shipments", params],
    queryFn: () => fetchJson<ShipmentListResult>(`/api/shipments${toQueryString(params)}`),
  });
}

export function useAssignedShipments(params: ShipmentQueryParams = {}) {
  return useQuery({
    queryKey: ["shipments", "my-assigned", params],
    queryFn: () =>
      fetchJson<ShipmentListResult>(`/api/shipments/my-assigned${toQueryString(params)}`),
  });
}
