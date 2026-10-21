import { ProtectedLayout } from "@/components/layout/protected-layout";
import { PaymentSuccessContent } from "@/components/payments/payment-success-content";

export default function PaymentSuccessPage() {
  return (
    <ProtectedLayout title="Payment result" role="CUSTOMER">
      <PaymentSuccessContent />
    </ProtectedLayout>
  );
}
