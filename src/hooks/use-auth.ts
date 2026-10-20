"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { mutateJson } from "@/lib/api/client";
import { ROLE_HOME } from "@/lib/routes";
import type { LoginInput, RegisterInput } from "@/lib/validations/auth";
import { useAuthStore, type AuthUser } from "@/stores/auth-store";
import type { ApiEnvelope } from "@/types/api";

export const AUTH_ME_QUERY_KEY = ["auth", "me"] as const;

function isSafeRedirect(url: string | undefined): url is string {
  return typeof url === "string" && url.startsWith("/") && !url.startsWith("//");
}

export function useCurrentUser() {
  const setUser = useAuthStore((state) => state.setUser);

  return useQuery({
    queryKey: AUTH_ME_QUERY_KEY,
    queryFn: async () => {
      const res = await fetch("/api/auth/me");
      const json = (await res.json()) as ApiEnvelope<{ user: AuthUser }>;
      if (!res.ok || !json.success || !json.data) {
        setUser(null);
        return null;
      }
      setUser(json.data.user);
      return json.data.user;
    },
    retry: false,
    staleTime: 60 * 1000,
  });
}

export function useLogin(callbackUrl?: string) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: (values: LoginInput) =>
      mutateJson<{ user: AuthUser }>("/api/auth/login", "POST", values),
    onSuccess: ({ user }) => {
      setUser(user);
      queryClient.setQueryData(AUTH_ME_QUERY_KEY, user);
      toast.success(`Welcome back, ${user.name}`);
      router.push(isSafeRedirect(callbackUrl) ? callbackUrl : ROLE_HOME[user.role]);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useRegister() {
  const router = useRouter();

  return useMutation({
    mutationFn: (values: RegisterInput) =>
      mutateJson<{ user: AuthUser }>("/api/auth/register", "POST", values),
    onSuccess: () => {
      toast.success("Account created. Please log in.");
      router.push("/login");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: () => mutateJson<null>("/api/auth/logout", "POST"),
    onSuccess: () => {
      setUser(null);
      queryClient.removeQueries({ queryKey: AUTH_ME_QUERY_KEY });
      router.push("/login");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}
