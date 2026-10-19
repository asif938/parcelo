"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchJson, toQueryString } from "@/lib/api/client";
import type { AdminDashboardStats, AuditLogListResult } from "@/types/admin";

export function useAdminDashboardStats() {
  return useQuery({
    queryKey: ["admin", "dashboard-stats"],
    queryFn: () => fetchJson<AdminDashboardStats>("/api/admin/dashboard-stats"),
  });
}

export function useAuditLogs(params: { limit?: number; page?: number } = {}) {
  return useQuery({
    queryKey: ["admin", "audit-logs", params],
    queryFn: () => fetchJson<AuditLogListResult>(`/api/admin/audit-logs${toQueryString(params)}`),
  });
}
