import { CustomerShipmentPage } from "@/components/shipments/customer-shipment-page";

export default async function CustomerShipmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CustomerShipmentPage id={id} />;
}
