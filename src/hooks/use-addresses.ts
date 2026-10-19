"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { fetchJson, mutateJson } from "@/lib/api/client";
import type { Address, AddressListResult, CreateAddressInput } from "@/types/address";

export function useAddresses() {
  return useQuery({
    queryKey: ["addresses"],
    queryFn: async () => (await fetchJson<AddressListResult>("/api/addresses")).addresses,
  });
}

export function useCreateAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateAddressInput) =>
      mutateJson<Address>("/api/addresses", "POST", input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      toast.success("Address added.");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}
