import type { PaginationMeta } from "@/types/api";

export type EarningStatus = "PENDING" | "PAID";

export interface CourierEarning {
  id: string;
  courierId: string;
  shipmentId: string;
  amount: string;
  status: EarningStatus;
  paidAt: string | null;
  createdAt: string;
  shipment: { trackingNumber: string };
}

export interface EarningsListResult {
  earnings: CourierEarning[];
  meta: PaginationMeta;
  totalEarned: number;
}

export interface EarningsQueryParams {
  page?: number;
  limit?: number;
  status?: EarningStatus;
}
