"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

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

  return useMutation({
    mutationFn: (id: string) => mutateJson<null>(`/api/shipments/${id}`, "DELETE"),
    onSuccess: () => {
      invalidateShipments();
      toast.success("Shipment deleted.");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useCancelShipment() {
  const invalidateShipments = useInvalidateShipments();

  return useMutation({
    mutationFn: (id: string) => mutateJson<Shipment>(`/api/shipments/${id}/cancel`, "POST"),
    onSuccess: () => {
      invalidateShipments();
      toast.success("Shipment cancelled.");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useRequestPickup() {
  const invalidateShipments = useInvalidateShipments();

  return useMutation({
    mutationFn: (id: string) =>
      mutateJson<Shipment>(`/api/shipments/${id}/pickup-request`, "POST"),
    onSuccess: () => {
      invalidateShipments();
      toast.success("Pickup requested.");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useAssignCourier() {
  const invalidateShipments = useInvalidateShipments();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: AssignCourierInput }) =>
      mutateJson<Shipment>(`/api/shipments/${id}/assign-courier`, "POST", input),
    onSuccess: () => {
      invalidateShipments();
      toast.success("Courier assigned.");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useUpdateShipmentStatus() {
  const invalidateShipments = useInvalidateShipments();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateShipmentStatusInput }) =>
      mutateJson<Shipment>(`/api/shipments/${id}/status`, "PATCH", input),
    onSuccess: () => {
      invalidateShipments();
      toast.success("Status updated.");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}
