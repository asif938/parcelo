import { AdminShipmentPage } from "@/components/shipments/admin-shipment-page";

export default async function AdminShipmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <AdminShipmentPage id={id} />;
}
