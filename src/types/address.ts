export interface Address {
  id: string;
  label: string;
  addressLine: string;
  city: string;
  zoneId: string;
  contactName: string;
  contactPhone: string;
  createdAt: string;
}

export interface AddressListResult {
  addresses: Address[];
}

export interface CreateAddressInput {
  label: string;
  addressLine: string;
  city: string;
  zoneId: string;
  contactName: string;
  contactPhone: string;
}
