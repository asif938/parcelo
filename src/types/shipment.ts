import type { PaginationMeta } from "@/types/api";

export type ShipmentStatus =
  | "CREATED"
  | "PICKUP_SCHEDULED"
  | "COURIER_ASSIGNED"
  | "PICKED_UP"
  | "AT_ORIGIN_HUB"
  | "IN_TRANSIT"
  | "AT_DESTINATION_HUB"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "FAILED_DELIVERY_ATTEMPT"
  | "RETURN_TO_SENDER"
  | "RETURNED"
  | "CANCELLED";

export interface ShipmentAddress {
  id: string;
  label: string;
  addressLine: string;
  city: string;
  contactName: string;
  contactPhone: string;
}

export interface ShipmentCourier {
  id: string;
  name: string;
  phone: string;
}

export interface Shipment {
  id: string;
  trackingNumber: string;
  serviceType: "STANDARD" | "EXPRESS";
  status: ShipmentStatus;
  parcelWeightKg: string;
  parcelDescription: string | null;
  priceAmount: string;
  currency: string;
  createdAt: string;
  updatedAt: string;
  pickupAddress: ShipmentAddress;
  deliveryAddress: ShipmentAddress;
  assignedCourier: ShipmentCourier | null;
}

export interface ShipmentListResult {
  shipments: Shipment[];
  meta: PaginationMeta;
}

export interface CreateShipmentInput {
  pickupAddressId: string;
  deliveryAddressId: string;
  serviceType: "STANDARD" | "EXPRESS";
  parcelWeightKg: number;
  parcelDescription?: string;
  parcelValue?: number;
}

export interface UpdateShipmentInput {
  deliveryAddressId?: string;
  parcelDescription?: string;
  parcelValue?: number;
}

export interface UpdateShipmentStatusInput {
  status: ShipmentStatus;
  note?: string;
  location?: string;
}

export interface AssignCourierInput {
  courierId?: string;
}

export interface ShipmentDetailResult {
  shipment: Shipment;
}

export interface ShipmentStatusHistoryEntry {
  id: string;
  status: ShipmentStatus;
  note: string | null;
  location: string | null;
  createdAt: string;
  actor: { id: string; name: string; role: string } | null;
}

export interface ShipmentTrackingResult {
  trackingNumber: string;
  status: ShipmentStatus;
  history: ShipmentStatusHistoryEntry[];
}
