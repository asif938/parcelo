import type { PaginationMeta } from "@/types/api";

export type PaymentStatus = "PENDING" | "SUCCEEDED" | "FAILED" | "REFUNDED";

export interface PaymentShipmentSummary {
  trackingNumber: string;
  status?: string;
}

export interface Payment {
  id: string;
  shipmentId: string;
  customerId: string;
  amount: string;
  currency: string;
  status: PaymentStatus;
  stripeSessionId: string | null;
  stripePaymentIntentId: string | null;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
  shipment: PaymentShipmentSummary;
}

export interface PaymentListResult {
  payments: Payment[];
  meta: PaginationMeta;
}

export interface PaymentDetailResult {
  payment: Payment;
}

export interface InitiatePaymentResult {
  payment: Payment;
  checkoutUrl: string | null;
}
