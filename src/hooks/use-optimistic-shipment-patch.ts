"use client";

import { useQueryClient } from "@tanstack/react-query";

import type { Shipment, ShipmentListResult } from "@/types/shipment";

function isShipmentList(data: unknown): data is ShipmentListResult {
  return Boolean(data) && Array.isArray((data as ShipmentListResult).shipments);
}

export function useOptimisticShipmentPatch() {
  const queryClient = useQueryClient();

  function patch(id: string, changes: Partial<Shipment>) {
    const previous = queryClient.getQueriesData({ queryKey: ["shipments"] });

    queryClient.setQueriesData({ queryKey: ["shipments"] }, (data) => {
      if (!isShipmentList(data)) return data;
      return {
        ...data,
        shipments: data.shipments.map((shipment) =>
          shipment.id === id ? { ...shipment, ...changes } : shipment,
        ),
      };
    });

    queryClient.setQueryData<Shipment>(["shipments", "detail", id], (current) =>
      current ? { ...current, ...changes } : current,
    );

    return () => {
      previous.forEach(([key, data]) => queryClient.setQueryData(key, data));
    };
  }

  function remove(id: string) {
    const previous = queryClient.getQueriesData({ queryKey: ["shipments"] });

    queryClient.setQueriesData({ queryKey: ["shipments"] }, (data) => {
      if (!isShipmentList(data)) return data;
      return { ...data, shipments: data.shipments.filter((shipment) => shipment.id !== id) };
    });

    return () => {
      previous.forEach(([key, data]) => queryClient.setQueryData(key, data));
    };
  }

  return { patch, remove };
}
