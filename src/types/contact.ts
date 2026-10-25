export interface ContactSettings {
  email: string;
  phone: string;
  location: string;
  updatedAt: string | null;
}

export interface ContactSettingsResult {
  settings: ContactSettings;
}

export interface UpdateContactSettingsInput {
  email?: string;
  phone?: string;
  location?: string;
}

export interface ContactMessageInput {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactMessageResult {
  emailDelivered: boolean;
}
