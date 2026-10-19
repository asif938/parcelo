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
  createdAt: string;
  actor: AuditLogActor | null;
}

export interface AuditLogListResult {
  logs: AuditLogEntry[];
  meta: PaginationMeta;
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
