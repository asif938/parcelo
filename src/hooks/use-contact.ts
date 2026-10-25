"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { fetchJson, mutateJson } from "@/lib/api/client";
import type {
  ContactMessageInput,
  ContactMessageResult,
  ContactSettings,
  ContactSettingsResult,
  UpdateContactSettingsInput,
} from "@/types/contact";

export function useContactSettings() {
  return useQuery({
    queryKey: ["contact-settings"],
    queryFn: async () =>
      (await fetchJson<ContactSettingsResult>("/api/contact-settings")).settings,
  });
}

export function useUpdateContactSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateContactSettingsInput) =>
      mutateJson<ContactSettings>("/api/contact-settings", "PATCH", input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contact-settings"] });
      toast.success("Contact information updated.");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useSubmitContactMessage() {
  return useMutation({
    mutationFn: (input: ContactMessageInput) =>
      mutateJson<ContactMessageResult>("/api/contact", "POST", input),
  });
}
