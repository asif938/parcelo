"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { fetchJson, mutateJson } from "@/lib/api/client";
import type { CreateZoneInput, UpdateZoneInput, Zone, ZoneListResult } from "@/types/zone";

export function useZones() {
  return useQuery({
    queryKey: ["zones"],
    queryFn: async () => (await fetchJson<ZoneListResult>("/api/zones")).zones,
    staleTime: 10 * 60 * 1000,
  });
}

export function useCreateZone() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateZoneInput) => mutateJson<Zone>("/api/zones", "POST", input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["zones"] });
      toast.success("Zone created.");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useUpdateZone() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...input }: UpdateZoneInput & { id: string }) =>
      mutateJson<Zone>(`/api/zones/${id}`, "PATCH", input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["zones"] });
      toast.success("Zone updated.");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useDeleteZone() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => mutateJson<null>(`/api/zones/${id}`, "DELETE"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["zones"] });
      toast.success("Zone deleted.");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}
