"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { fetchJson, mutateJson } from "@/lib/api/client";
import type { CreateHubInput, Hub, HubListResult, UpdateHubInput } from "@/types/hub";

export function useHubs() {
  return useQuery({
    queryKey: ["hubs"],
    queryFn: async () => (await fetchJson<HubListResult>("/api/hubs")).hubs,
  });
}

export function useCreateHub() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateHubInput) => mutateJson<Hub>("/api/hubs", "POST", input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hubs"] });
      toast.success("Hub created.");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useUpdateHub() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...input }: UpdateHubInput & { id: string }) =>
      mutateJson<Hub>(`/api/hubs/${id}`, "PATCH", input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hubs"] });
      toast.success("Hub updated.");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useDeleteHub() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => mutateJson<null>(`/api/hubs/${id}`, "DELETE"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hubs"] });
      toast.success("Hub deleted.");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}
