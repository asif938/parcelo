"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import type { ReactNode } from "react";

import { AUTH_ME_QUERY_KEY } from "@/hooks/use-auth";
import { useAuthStore, type AuthUser } from "@/stores/auth-store";

export function AuthProvider({
  initialUser,
  children,
}: {
  initialUser: AuthUser | null;
  children: ReactNode;
}) {
  const setUser = useAuthStore((state) => state.setUser);
  const queryClient = useQueryClient();

  useEffect(() => {
    setUser(initialUser);
    queryClient.setQueryData(AUTH_ME_QUERY_KEY, initialUser);
  }, [initialUser, setUser, queryClient]);

  return <>{children}</>;
}
