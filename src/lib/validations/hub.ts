import { z } from "zod";

function isPositiveInteger(value: string) {
  return value.trim() !== "" && Number.isInteger(Number(value)) && Number(value) > 0;
}

export const createHubSchema = z.object({
  code: z.string().trim().min(2, "Code must be at least 2 characters").max(30),
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(150),
  address: z.string().trim().min(3, "Address is too short").max(300),
  zoneId: z.string().min(1, "Zone is required"),
  capacity: z.string().trim().refine(isPositiveInteger, "Capacity must be a positive whole number"),
});

export type CreateHubFormValues = z.infer<typeof createHubSchema>;

export const updateHubSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(150),
  address: z.string().trim().min(3, "Address is too short").max(300),
  capacity: z.string().trim().refine(isPositiveInteger, "Capacity must be a positive whole number"),
});

export type UpdateHubFormValues = z.infer<typeof updateHubSchema>;
