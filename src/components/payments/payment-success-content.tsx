"use client";

import { CheckCircle2, Loader2, RefreshCw, XCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { usePayment, usePayments } from "@/hooks/use-payments";
import { formatCurrency } from "@/lib/format";
import { PAYMENT_STATUS_LABEL } from "@/lib/payment-status";

export function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const sessionPayments = usePayments({ limit: 50 });
  const matchedPaymentId = useMemo(() => {
    if (!sessionId) return null;
    return (
      sessionPayments.data?.payments.find((payment) => payment.stripeSessionId === sessionId)
        ?.id ?? null
    );
  }, [sessionId, sessionPayments.data]);

  const paymentDetail = usePayment(matchedPaymentId ?? "", {
    enabled: Boolean(matchedPaymentId),
  });

  if (!sessionId) {
    return (
      <StatusCard
        icon={<XCircle className="size-10 text-destructive" />}
        title="We couldn't confirm this payment"
        description="No payment session was provided. If you completed a checkout, check your payment history below."
      >
        <Link href="/dashboard/payments">
          <Button variant="outline">Go to payment history</Button>
        </Link>
      </StatusCard>
    );
  }

  if (sessionPayments.isLoading || (matchedPaymentId && paymentDetail.isLoading)) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </CardContent>
      </Card>
    );
  }

  if (!matchedPaymentId || !paymentDetail.data) {
    return (
      <StatusCard
        icon={<XCircle className="size-10 text-destructive" />}
        title="We couldn't find this payment"
        description="Your checkout session wasn't matched to a payment on your account. If you were charged, it will appear in your payment history shortly."
      >
        <Link href="/dashboard/payments">
          <Button variant="outline">Go to payment history</Button>
        </Link>
      </StatusCard>
    );
  }

  const payment = paymentDetail.data;

  if (payment.status === "SUCCEEDED") {
    return (
      <StatusCard
        icon={<CheckCircle2 className="size-10 text-primary" />}
        title="Payment successful"
        description={`We've received your payment of ${formatCurrency(payment.amount, payment.currency)} for shipment ${payment.shipment.trackingNumber}.`}
      >
        <Link href={`/dashboard/shipments/${payment.shipmentId}`}>
          <Button>View shipment</Button>
        </Link>
        <Link href="/dashboard/payments">
          <Button variant="outline">Payment history</Button>
        </Link>
      </StatusCard>
    );
  }

  if (payment.status === "PENDING") {
    return (
      <StatusCard
        icon={<Loader2 className="size-10 animate-spin text-muted-foreground" />}
        title="Confirming your payment"
        description="Stripe is still finalizing this payment. This can take a few seconds."
      >
        <Button variant="outline" onClick={() => paymentDetail.refetch()}>
          <RefreshCw /> Check again
        </Button>
      </StatusCard>
    );
  }

  return (
    <StatusCard
      icon={<XCircle className="size-10 text-destructive" />}
      title={`Payment ${PAYMENT_STATUS_LABEL[payment.status].toLowerCase()}`}
      description={`This payment for shipment ${payment.shipment.trackingNumber} was not completed. You can try paying again from the shipment page.`}
    >
      <Link href={`/dashboard/shipments/${payment.shipmentId}`}>
        <Button>Go to shipment</Button>
      </Link>
    </StatusCard>
  );
}

function StatusCard({
  icon,
  title,
  description,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="mx-auto max-w-md">
      <CardContent className="flex flex-col items-center gap-4 pt-6 text-center">
        {icon}
        <div>
          <CardTitle>{title}</CardTitle>
          <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2">{children}</div>
      </CardContent>
    </Card>
  );
}
