import type { PaginationMeta } from "@/types/api";
import type { ShipmentStatus } from "@/types/shipment";

export interface AdminDashboardStats {
  totalUsers: number;
  totalShipments: number;
  shipmentsByStatus: Partial<Record<ShipmentStatus, number>>;
  revenue: number;
  deliverySuccessRatePercent: number;
  courierUtilization: {
    total: number;
    busy: number;
    available: number;
    utilizationPercent: number;
  };
}

export interface AuditLogActor {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface AuditLogEntry {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  changes: unknown;
  ipAddress: string | null;
  createdAt: string;
  actor: AuditLogActor | null;
}

export interface AuditLogListResult {
  logs: AuditLogEntry[];
  meta: PaginationMeta;
}

export interface AuditLogQueryParams {
  page?: number;
  limit?: number;
  action?: string;
  entityType?: string;
  actorUserId?: string;
}

export interface CourierSummary {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
}

export interface CourierListResult {
  users: CourierSummary[];
  meta: PaginationMeta;
}

export type AdminRole = "CUSTOMER" | "COURIER" | "ADMIN";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: AdminRole;
  isActive: boolean;
  organizationId: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface AdminUserListResult {
  users: AdminUser[];
  meta: PaginationMeta;
}

export interface AdminUserQueryParams {
  page?: number;
  limit?: number;
  role?: AdminRole;
  isActive?: boolean;
  q?: string;
}
