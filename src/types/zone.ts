export interface Zone {
  id: string;
  name: string;
  city: string;
  region: string | null;
}

export interface ZoneListResult {
  zones: Zone[];
}

export interface CreateZoneInput {
  name: string;
  city: string;
  region?: string;
}

export interface UpdateZoneInput {
  name?: string;
  city?: string;
  region?: string;
}
