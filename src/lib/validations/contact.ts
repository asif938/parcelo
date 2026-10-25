import { z } from "zod";

export const contactMessageSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email address").max(150),
  subject: z.string().trim().min(1, "Subject is required").max(150),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(2000),
});

export type ContactMessageFormValues = z.infer<typeof contactMessageSchema>;

export const contactSettingsSchema = z.object({
  email: z.string().trim().email("Invalid email address").max(150),
  phone: z.string().trim().min(3, "Phone must be at least 3 characters").max(40),
  location: z.string().trim().min(2, "Location must be at least 2 characters").max(200),
});

export type ContactSettingsFormValues = z.infer<typeof contactSettingsSchema>;
