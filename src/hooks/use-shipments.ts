"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { useOptimisticShipmentPatch } from "@/hooks/use-optimistic-shipment-patch";
import { fetchJson, mutateJson, toQueryString } from "@/lib/api/client";
import type {
  AssignCourierInput,
  CreateShipmentInput,
  Shipment,
  ShipmentDetailResult,
  ShipmentListResult,
  ShipmentTrackingResult,
  UpdateShipmentInput,
  UpdateShipmentStatusInput,
} from "@/types/shipment";

interface ShipmentQueryParams {
  limit?: number;
  page?: number;
  status?: string;
  sortBy?: "createdAt" | "updatedAt" | "priceAmount";
  sortOrder?: "asc" | "desc";
}

interface ShipmentSearchParams {
  q: string;
  limit?: number;
  page?: number;
}

interface QueryOptions {
  enabled?: boolean;
}

export function useShipments(params: ShipmentQueryParams = {}, options: QueryOptions = {}) {
  return useQuery({
    queryKey: ["shipments", params],
    queryFn: () => fetchJson<ShipmentListResult>(`/api/shipments${toQueryString(params)}`),
    enabled: options.enabled,
  });
}

export function useAssignedShipments(params: ShipmentQueryParams = {}, options: QueryOptions = {}) {
  return useQuery({
    queryKey: ["shipments", "my-assigned", params],
    queryFn: () =>
      fetchJson<ShipmentListResult>(`/api/shipments/my-assigned${toQueryString(params)}`),
    enabled: options.enabled,
  });
}

export function useShipmentSearch(params: ShipmentSearchParams, options: QueryOptions = {}) {
  return useQuery({
    queryKey: ["shipments", "search", params],
    queryFn: () =>
      fetchJson<ShipmentListResult>(`/api/shipments/search${toQueryString(params)}`),
    enabled: options.enabled,
  });
}

export function useShipment(id: string, options: QueryOptions = {}) {
  return useQuery({
    queryKey: ["shipments", "detail", id],
    queryFn: async () =>
      (await fetchJson<ShipmentDetailResult>(`/api/shipments/${id}`)).shipment,
    enabled: options.enabled ?? Boolean(id),
  });
}

export function useShipmentTracking(id: string, options: QueryOptions = {}) {
  return useQuery({
    queryKey: ["shipments", "tracking", id],
    queryFn: () => fetchJson<ShipmentTrackingResult>(`/api/shipments/${id}/tracking`),
    enabled: options.enabled ?? Boolean(id),
  });
}

function useInvalidateShipments() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: ["shipments"] });
}

export function useCreateShipment() {
  const invalidateShipments = useInvalidateShipments();

  return useMutation({
    mutationFn: (input: CreateShipmentInput) =>
      mutateJson<Shipment>("/api/shipments", "POST", input),
    onSuccess: () => {
      invalidateShipments();
      toast.success("Shipment created.");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useUpdateShipment(id: string) {
  const invalidateShipments = useInvalidateShipments();

  return useMutation({
    mutationFn: (input: UpdateShipmentInput) =>
      mutateJson<Shipment>(`/api/shipments/${id}`, "PATCH", input),
    onSuccess: () => {
      invalidateShipments();
      toast.success("Shipment updated.");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useDeleteShipment() {
  const invalidateShipments = useInvalidateShipments();
  const { remove } = useOptimisticShipmentPatch();

  return useMutation({
    mutationFn: (id: string) => mutateJson<null>(`/api/shipments/${id}`, "DELETE"),
    onMutate: (id: string) => remove(id),
    onSuccess: () => toast.success("Shipment deleted."),
    onError: (error: Error, _id, rollback) => {
      rollback?.();
      toast.error(error.message);
    },
    onSettled: () => invalidateShipments(),
  });
}

export function useCancelShipment() {
  const invalidateShipments = useInvalidateShipments();
  const { patch } = useOptimisticShipmentPatch();

  return useMutation({
    mutationFn: (id: string) => mutateJson<Shipment>(`/api/shipments/${id}/cancel`, "POST"),
    onMutate: (id: string) => patch(id, { status: "CANCELLED" }),
    onSuccess: () => toast.success("Shipment cancelled."),
    onError: (error: Error, _id, rollback) => {
      rollback?.();
      toast.error(error.message);
    },
    onSettled: () => invalidateShipments(),
  });
}

export function useRequestPickup() {
  const invalidateShipments = useInvalidateShipments();
  const { patch } = useOptimisticShipmentPatch();

  return useMutation({
    mutationFn: (id: string) =>
      mutateJson<Shipment>(`/api/shipments/${id}/pickup-request`, "POST"),
    onMutate: (id: string) => patch(id, { status: "PICKUP_SCHEDULED" }),
    onSuccess: () => toast.success("Pickup requested."),
    onError: (error: Error, _id, rollback) => {
      rollback?.();
      toast.error(error.message);
    },
    onSettled: () => invalidateShipments(),
  });
}

export function useAssignCourier() {
  const invalidateShipments = useInvalidateShipments();
  const { patch } = useOptimisticShipmentPatch();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: AssignCourierInput }) =>
      mutateJson<Shipment>(`/api/shipments/${id}/assign-courier`, "POST", input),
    onMutate: ({ id }: { id: string; input: AssignCourierInput }) =>
      patch(id, { status: "COURIER_ASSIGNED" }),
    onSuccess: () => toast.success("Courier assigned."),
    onError: (error: Error, _variables, rollback) => {
      rollback?.();
      toast.error(error.message);
    },
    onSettled: () => invalidateShipments(),
  });
}

export function useUpdateShipmentStatus() {
  const invalidateShipments = useInvalidateShipments();
  const { patch } = useOptimisticShipmentPatch();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateShipmentStatusInput }) =>
      mutateJson<Shipment>(`/api/shipments/${id}/status`, "PATCH", input),
    onMutate: ({ id, input }: { id: string; input: UpdateShipmentStatusInput }) =>
      patch(id, { status: input.status }),
    onSuccess: () => toast.success("Status updated."),
    onError: (error: Error, _variables, rollback) => {
      rollback?.();
      toast.error(error.message);
    },
    onSettled: () => invalidateShipments(),
  });
}
