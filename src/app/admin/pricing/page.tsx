import { CreatePricingRuleForm } from "@/components/admin/create-pricing-rule-form";
import { PricingQuoteTool } from "@/components/admin/pricing-quote-tool";

export default function AdminPricingPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Pricing</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Create pricing rules for routes and weight tiers, and test them with the quote
          calculator. The API doesn&apos;t expose a way to list existing rules, so use the
          calculator to verify a rule after creating it.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <CreatePricingRuleForm />
        <PricingQuoteTool />
      </div>
    </div>
  );
}
