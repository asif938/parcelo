import { ShipmentDetail } from "@/components/shipments/shipment-detail";

export default async function CustomerShipmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ShipmentDetail id={id} backHref="/dashboard/shipments" />;
}
