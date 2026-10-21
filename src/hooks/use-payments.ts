"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { fetchJson, mutateJson, toQueryString } from "@/lib/api/client";
import type {
  InitiatePaymentResult,
  PaymentDetailResult,
  PaymentListResult,
  PaymentStatus,
} from "@/types/payment";

interface PaymentQueryParams {
  page?: number;
  limit?: number;
  status?: PaymentStatus;
}

export function usePayments(params: PaymentQueryParams = {}) {
  return useQuery({
    queryKey: ["payments", params],
    queryFn: () => fetchJson<PaymentListResult>(`/api/payments${toQueryString(params)}`),
  });
}

export function usePayment(id: string, options: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: ["payments", "detail", id],
    queryFn: async () => (await fetchJson<PaymentDetailResult>(`/api/payments/${id}`)).payment,
    enabled: options.enabled ?? Boolean(id),
  });
}

export function useInitiatePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (shipmentId: string) =>
      mutateJson<InitiatePaymentResult>("/api/payments/initiate", "POST", { shipmentId }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["payments"] }),
    onError: (error: Error) => toast.error(error.message),
  });
}
