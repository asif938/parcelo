import type { PaymentStatus } from "@/types/payment";

export const PAYMENT_STATUS_LABEL: Record<PaymentStatus, string> = {
  PENDING: "Pending",
  SUCCEEDED: "Paid",
  FAILED: "Failed",
  REFUNDED: "Refunded",
};

export function paymentStatusBadgeVariant(status: PaymentStatus) {
  if (status === "SUCCEEDED") return "secondary" as const;
  if (status === "FAILED") return "destructive" as const;
  return "outline" as const;
}
