"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { fetchJson, mutateJson, toQueryString } from "@/lib/api/client";
import type { AdminRole, AdminUser, AdminUserListResult, AdminUserQueryParams } from "@/types/admin";

export function useAdminUsers(params: AdminUserQueryParams = {}) {
  return useQuery({
    queryKey: ["admin", "users", params],
    queryFn: () => fetchJson<AdminUserListResult>(`/api/admin/users${toQueryString(params)}`),
  });
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: AdminRole }) =>
      mutateJson<AdminUser>(`/api/admin/users/${id}/role`, "PATCH", { role }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      toast.success("User role updated.");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useUpdateUserStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      mutateJson<AdminUser>(`/api/admin/users/${id}/status`, "PATCH", { isActive }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      toast.success("User status updated.");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}
