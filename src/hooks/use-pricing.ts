"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { mutateJson } from "@/lib/api/client";
import type { CreatePricingRuleInput, PriceQuote, PriceQuoteInput, PricingRule } from "@/types/pricing";

export function useCreatePricingRule() {
  return useMutation({
    mutationFn: (input: CreatePricingRuleInput) =>
      mutateJson<PricingRule>("/api/pricing/rules", "POST", input),
    onSuccess: () => toast.success("Pricing rule created."),
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useGetQuote() {
  return useMutation({
    mutationFn: (input: PriceQuoteInput) =>
      mutateJson<PriceQuote>("/api/pricing/quote", "POST", input),
    onError: (error: Error) => toast.error(error.message),
  });
}
