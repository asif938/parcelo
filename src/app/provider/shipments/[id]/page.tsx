import { ShipmentDetail } from "@/components/shipments/shipment-detail";

export default async function ProviderShipmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ShipmentDetail id={id} backHref="/provider/shipments" />;
}
