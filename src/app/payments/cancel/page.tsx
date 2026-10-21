import { XCircle } from "lucide-react";
import Link from "next/link";

import { ProtectedLayout } from "@/components/layout/protected-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

export default function PaymentCancelPage() {
  return (
    <ProtectedLayout title="Payment result" role="CUSTOMER">
      <Card className="mx-auto max-w-md">
        <CardContent className="flex flex-col items-center gap-4 pt-6 text-center">
          <XCircle className="size-10 text-muted-foreground" />
          <div>
            <CardTitle>Payment cancelled</CardTitle>
            <p className="mt-2 text-sm text-muted-foreground">
              You cancelled checkout. No charge was made. You can try paying again any time from
              the shipment page.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Link href="/dashboard/shipments">
              <Button variant="outline">Back to shipments</Button>
            </Link>
            <Link href="/dashboard/payments">
              <Button variant="outline">Payment history</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </ProtectedLayout>
  );
}
