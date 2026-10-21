import { EarningsList } from "@/components/earnings/earnings-list";

export default function CourierEarningsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Earnings</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Track what you&apos;ve earned from completed deliveries.
        </p>
      </div>
      <EarningsList />
    </div>
  );
}
