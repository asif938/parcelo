export interface PricingRule {
  id: string;
  originZoneId: string;
  destinationZoneId: string;
  serviceType: "STANDARD" | "EXPRESS";
  minWeightKg: string;
  maxWeightKg: string;
  basePrice: string;
  perKgRate: string;
  isActive: boolean;
  effectiveFrom: string;
  createdAt: string;
}

export interface CreatePricingRuleInput {
  originZoneId: string;
  destinationZoneId: string;
  serviceType: "STANDARD" | "EXPRESS";
  minWeightKg: number;
  maxWeightKg: number;
  basePrice: number;
  perKgRate: number;
}

export interface PriceQuoteInput {
  originZoneId: string;
  destinationZoneId: string;
  serviceType: "STANDARD" | "EXPRESS";
  weightKg: number;
}

export interface PriceQuote {
  price: number;
  currency: string;
  basePrice: number;
  perKgRate: number;
  weightKg: number;
  serviceType: "STANDARD" | "EXPRESS";
}
