import { z } from "zod";

function isNonNegativeNumber(value: string) {
  return value.trim() !== "" && Number.isFinite(Number(value)) && Number(value) >= 0;
}

function isPositiveNumber(value: string) {
  return value.trim() !== "" && Number.isFinite(Number(value)) && Number(value) > 0;
}

export const createPricingRuleSchema = z
  .object({
    originZoneId: z.string().min(1, "Origin zone is required"),
    destinationZoneId: z.string().min(1, "Destination zone is required"),
    serviceType: z.enum(["STANDARD", "EXPRESS"]),
    minWeightKg: z.string().trim().refine(isNonNegativeNumber, "Must be 0 or greater"),
    maxWeightKg: z.string().trim().refine(isPositiveNumber, "Must be greater than 0"),
    basePrice: z.string().trim().refine(isNonNegativeNumber, "Must be 0 or greater"),
    perKgRate: z.string().trim().refine(isNonNegativeNumber, "Must be 0 or greater"),
  })
  .refine((data) => Number(data.maxWeightKg) > Number(data.minWeightKg), {
    message: "Max weight must be greater than min weight",
    path: ["maxWeightKg"],
  });

export type CreatePricingRuleFormValues = z.infer<typeof createPricingRuleSchema>;

export const quoteSchema = z.object({
  originZoneId: z.string().min(1, "Origin zone is required"),
  destinationZoneId: z.string().min(1, "Destination zone is required"),
  serviceType: z.enum(["STANDARD", "EXPRESS"]),
  weightKg: z.string().trim().refine(isPositiveNumber, "Weight must be greater than 0"),
});

export type QuoteFormValues = z.infer<typeof quoteSchema>;
