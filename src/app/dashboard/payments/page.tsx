import { PaymentsList } from "@/components/payments/payments-list";

export default function PaymentsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Payments</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Every payment attempt for your shipments.
        </p>
      </div>
      <PaymentsList />
    </div>
  );
}
