import type { Zone } from "@/types/zone";

export interface Hub {
  id: string;
  code: string;
  name: string;
  address: string;
  zoneId: string;
  capacity: number;
  isActive: boolean;
  zone: Zone;
  createdAt: string;
  updatedAt: string;
}

export interface HubListResult {
  hubs: Hub[];
}

export interface CreateHubInput {
  code: string;
  name: string;
  address: string;
  zoneId: string;
  capacity: number;
}

export interface UpdateHubInput {
  name?: string;
  address?: string;
  capacity?: number;
  isActive?: boolean;
}
