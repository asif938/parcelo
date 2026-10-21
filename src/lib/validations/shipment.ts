import { z } from "zod";

import { SHIPMENT_STATUSES } from "@/lib/shipment-status";

function isPositiveNumber(value: string) {
  return value.trim() !== "" && Number.isFinite(Number(value)) && Number(value) > 0;
}

export const createShipmentSchema = z
  .object({
    pickupAddressId: z.string().min(1, "Pickup address is required"),
    deliveryAddressId: z.string().min(1, "Delivery address is required"),
    serviceType: z.enum(["STANDARD", "EXPRESS"]),
    parcelWeightKg: z
      .string()
      .trim()
      .refine(isPositiveNumber, "Weight must be greater than 0")
      .refine((value) => Number(value) <= 1000, "Weight must be 1000 kg or less"),
    parcelDescription: z.string().trim().max(500).optional(),
    parcelValue: z
      .string()
      .trim()
      .optional()
      .refine((value) => !value || isPositiveNumber(value), "Value must be greater than 0"),
  })
  .refine((data) => data.pickupAddressId !== data.deliveryAddressId, {
    message: "Pickup and delivery addresses must be different",
    path: ["deliveryAddressId"],
  });

export type CreateShipmentFormValues = z.infer<typeof createShipmentSchema>;

export const updateShipmentSchema = z.object({
  deliveryAddressId: z.string().min(1, "Delivery address is required"),
  parcelDescription: z.string().trim().max(500).optional(),
  parcelValue: z
    .string()
    .trim()
    .optional()
    .refine((value) => !value || isPositiveNumber(value), "Value must be greater than 0"),
});

export type UpdateShipmentFormValues = z.infer<typeof updateShipmentSchema>;

export const createAddressSchema = z.object({
  label: z.string().trim().min(1, "Label is required").max(100),
  addressLine: z.string().trim().min(1, "Address is required").max(200),
  city: z.string().trim().min(1, "City is required").max(100),
  zoneId: z.string().min(1, "Zone is required"),
  contactName: z.string().trim().min(1, "Contact name is required").max(100),
  contactPhone: z.string().trim().min(1, "Contact phone is required").max(30),
});

export type CreateAddressFormValues = z.infer<typeof createAddressSchema>;

export const updateAddressSchema = z.object({
  label: z.string().trim().min(1, "Label is required").max(100),
  addressLine: z.string().trim().min(1, "Address is required").max(200),
  city: z.string().trim().min(1, "City is required").max(100),
  zoneId: z.string().min(1, "Zone is required"),
  contactName: z.string().trim().min(1, "Contact name is required").max(100),
  contactPhone: z.string().trim().min(1, "Contact phone is required").max(30),
});

export type UpdateAddressFormValues = z.infer<typeof updateAddressSchema>;

export const updateStatusSchema = z.object({
  status: z.enum(SHIPMENT_STATUSES),
  note: z.string().trim().max(500).optional(),
  location: z.string().trim().max(200).optional(),
});

export type UpdateStatusFormValues = z.infer<typeof updateStatusSchema>;

export const assignCourierSchema = z.object({
  courierId: z.string().min(1, "Select a courier"),
});

export type AssignCourierFormValues = z.infer<typeof assignCourierSchema>;
