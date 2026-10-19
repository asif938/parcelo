import { CourierShipmentPage } from "@/components/shipments/courier-shipment-page";

export default async function ProviderShipmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CourierShipmentPage id={id} />;
}
