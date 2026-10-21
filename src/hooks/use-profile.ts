"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { fetchJson, mutateJson } from "@/lib/api/client";
import { AUTH_ME_QUERY_KEY } from "@/hooks/use-auth";
import { useAuthStore } from "@/stores/auth-store";
import type { MyProfile, UpdateProfileInput } from "@/types/user";

export function useMyProfile() {
  return useQuery({
    queryKey: ["users", "me"],
    queryFn: async () => (await fetchJson<{ user: MyProfile }>("/api/users/me")).user,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);
  const currentUser = useAuthStore((state) => state.user);

  return useMutation({
    mutationFn: (input: UpdateProfileInput) =>
      mutateJson<MyProfile>("/api/users/me", "PATCH", input),
    onSuccess: (user) => {
      if (currentUser) {
        setUser({ ...currentUser, name: user.name, phone: user.phone });
      }
      queryClient.invalidateQueries({ queryKey: ["users", "me"] });
      queryClient.invalidateQueries({ queryKey: AUTH_ME_QUERY_KEY });
      toast.success("Profile updated.");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}
