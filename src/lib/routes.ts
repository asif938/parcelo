import type { AppRole } from "@/components/layout/nav-config";

export const ROLE_HOME: Record<AppRole, string> = {
  CUSTOMER: "/dashboard",
  COURIER: "/provider",
  ADMIN: "/admin",
};

export const PROTECTED_ROUTE_PREFIXES: Record<AppRole, string> = {
  CUSTOMER: "/dashboard",
  COURIER: "/provider",
  ADMIN: "/admin",
};

export const AUTH_ONLY_ROUTES = ["/login", "/register"] as const;
