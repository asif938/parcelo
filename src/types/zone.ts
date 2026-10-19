export interface Zone {
  id: string;
  name: string;
  city: string;
  region: string | null;
}

export interface ZoneListResult {
  zones: Zone[];
}
