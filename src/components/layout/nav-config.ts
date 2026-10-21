import type { LucideIcon } from "lucide-react";
import {
  Building2,
  ClipboardList,
  CreditCard,
  LayoutDashboard,
  Package,
  PackagePlus,
  ScrollText,
  Tag,
  User,
  Users,
  Wallet,
} from "lucide-react";

export type AppRole = "CUSTOMER" | "COURIER" | "ADMIN";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
}

export const ROLE_NAV: Record<AppRole, NavItem[]> = {
  CUSTOMER: [
    { title: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { title: "My Shipments", href: "/dashboard/shipments", icon: Package },
    { title: "New Shipment", href: "/dashboard/shipments/new", icon: PackagePlus },
    { title: "Payments", href: "/dashboard/payments", icon: CreditCard },
    { title: "Profile", href: "/dashboard/profile", icon: User },
  ],
  COURIER: [
    { title: "My Tasks", href: "/provider", icon: ClipboardList },
    { title: "Earnings", href: "/provider/earnings", icon: Wallet },
    { title: "Profile", href: "/provider/profile", icon: User },
  ],
  ADMIN: [
    { title: "Overview", href: "/admin", icon: LayoutDashboard },
    { title: "Shipments", href: "/admin/shipments", icon: Package },
    { title: "Users", href: "/admin/users", icon: Users },
    { title: "Zones & Hubs", href: "/admin/zones-hubs", icon: Building2 },
    { title: "Pricing", href: "/admin/pricing", icon: Tag },
    { title: "Audit Logs", href: "/admin/audit-logs", icon: ScrollText },
  ],
};

export const ROLE_LABEL: Record<AppRole, string> = {
  CUSTOMER: "Customer",
  COURIER: "Provider",
  ADMIN: "Admin",
};
