"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { fetchJson, mutateJson, toQueryString } from "@/lib/api/client";
import type { EarningsListResult, EarningsQueryParams } from "@/types/courier-earning";
import type { MyCourierProfile } from "@/types/user";

export function useMyEarnings(params: EarningsQueryParams = {}) {
  return useQuery({
    queryKey: ["couriers", "me", "earnings", params],
    queryFn: () =>
      fetchJson<EarningsListResult>(`/api/couriers/me/earnings${toQueryString(params)}`),
  });
}

export function useUpdateAvailability() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (isAvailable: boolean) =>
      mutateJson<{ courierProfile: MyCourierProfile }>(
        "/api/couriers/me/availability",
        "PATCH",
        { isAvailable },
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users", "me"] });
      toast.success("Availability updated.");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}
