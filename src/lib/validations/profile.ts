import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  phone: z.string().trim().min(7, "Phone number is too short").max(20),
});

export type UpdateProfileFormValues = z.infer<typeof updateProfileSchema>;
