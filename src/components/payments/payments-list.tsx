"use client";

import { useSearchParams } from "next/navigation";

import { TableMessageRow } from "@/components/dashboard/table-message-row";
import { ShipmentsPagination } from "@/components/shipments/shipments-pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { usePayments } from "@/hooks/use-payments";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { PAYMENT_STATUS_LABEL, paymentStatusBadgeVariant } from "@/lib/payment-status";

const PAGE_SIZE = 10;
const SKELETON_ROWS = 6;
const COL_SPAN = 5;

export function PaymentsList() {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page") ?? "1") || 1;

  const paymentsQuery = usePayments({ page, limit: PAGE_SIZE });
  const payments = paymentsQuery.data?.payments ?? [];

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardContent className="overflow-x-auto pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Shipment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Paid</TableHead>
                <TableHead className="text-right">Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paymentsQuery.isLoading &&
                Array.from({ length: SKELETON_ROWS }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-16 rounded-full" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="ml-auto h-4 w-16" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="ml-auto h-4 w-20" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="ml-auto h-4 w-20" />
                    </TableCell>
                  </TableRow>
                ))}

              {paymentsQuery.isError && (
                <TableMessageRow colSpan={COL_SPAN}>
                  <div className="flex flex-col items-center gap-2">
                    <span>
                      {paymentsQuery.error instanceof Error
                        ? paymentsQuery.error.message
                        : "Failed to load payments."}
                    </span>
                    <Button variant="outline" size="sm" onClick={() => paymentsQuery.refetch()}>
                      Retry
                    </Button>
                  </div>
                </TableMessageRow>
              )}

              {!paymentsQuery.isLoading && !paymentsQuery.isError && payments.length === 0 && (
                <TableMessageRow colSpan={COL_SPAN}>No payments yet.</TableMessageRow>
              )}

              {!paymentsQuery.isLoading &&
                !paymentsQuery.isError &&
                payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium">{payment.shipment.trackingNumber}</TableCell>
                    <TableCell>
                      <Badge variant={paymentStatusBadgeVariant(payment.status)}>
                        {PAYMENT_STATUS_LABEL[payment.status]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(payment.amount, payment.currency)}
                    </TableCell>
                    <TableCell className="text-right">
                      {payment.paidAt ? formatDateTime(payment.paidAt) : "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatDateTime(payment.createdAt)}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <ShipmentsPagination meta={paymentsQuery.data?.meta} />
    </div>
  );
}
