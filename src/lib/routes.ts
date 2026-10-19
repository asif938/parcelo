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

export function roleForProtectedPath(pathname: string): AppRole | null {
  const entry = (Object.entries(PROTECTED_ROUTE_PREFIXES) as [AppRole, string][]).find(
    ([, prefix]) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
  return entry ? entry[0] : null;
}
