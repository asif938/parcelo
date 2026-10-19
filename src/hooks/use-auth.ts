"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { ROLE_HOME } from "@/lib/routes";
import type { LoginInput, RegisterInput } from "@/lib/validations/auth";
import { useAuthStore, type AuthUser } from "@/stores/auth-store";

interface ApiEnvelope<T> {
  success: boolean;
  message?: string;
  data?: T;
}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  const json = (await res.json().catch(() => ({}))) as ApiEnvelope<T>;
  if (!res.ok || !json.success) {
    throw new Error(json.message ?? "Something went wrong. Please try again.");
  }
  return json.data as T;
}

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
      request<{ user: AuthUser }>("/api/auth/login", { body: JSON.stringify(values) }),
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
      request<{ user: AuthUser }>("/api/auth/register", { body: JSON.stringify(values) }),
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
    mutationFn: () => request<null>("/api/auth/logout"),
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
