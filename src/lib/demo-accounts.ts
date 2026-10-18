import type { AppRole } from "@/components/layout/nav-config";

export interface DemoAccount {
  role: AppRole;
  label: string;
  email: string;
  password: string;
}

export const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    role: "ADMIN",
    label: "👨‍💼 Admin",
    email: "admin@courierlogistics.dev",
    password: "Passw0rd!123",
  },
  { role: "CUSTOMER", label: "👤 User", email: "alice@example.com", password: "Passw0rd!123" },
  { role: "COURIER", label: "🛠️ Provider", email: "carl@example.com", password: "Passw0rd!123" },
];
