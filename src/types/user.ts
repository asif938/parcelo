export type VehicleType = "BICYCLE" | "MOTORBIKE" | "VAN" | "TRUCK";

export interface MyCourierProfile {
  id: string;
  userId: string;
  vehicleType: VehicleType;
  licenseNumber: string;
  zoneId: string | null;
  isAvailable: boolean;
  rating: string;
  totalDeliveries: number;
  createdAt: string;
  updatedAt: string;
}

export interface MyProfile {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: "CUSTOMER" | "COURIER" | "ADMIN";
  isActive: boolean;
  organizationId: string | null;
  organization: { id: string; name: string } | null;
  courierProfile: MyCourierProfile | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface UpdateProfileInput {
  name?: string;
  phone?: string;
}
