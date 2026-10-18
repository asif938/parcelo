import { backendFetch } from "@/lib/api/backend";
import { getAuthCookies } from "@/lib/auth/cookies";
import type { AuthUser } from "@/stores/auth-store";

export async function fetchCurrentUser(accessToken: string): Promise<AuthUser> {
  const result = await backendFetch<{ user: AuthUser }>("/users/me", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return result.user;
}

export async function getServerSession(): Promise<AuthUser | null> {
  const { accessToken } = await getAuthCookies();
  if (!accessToken) return null;

  try {
    return await fetchCurrentUser(accessToken);
  } catch {
    return null;
  }
}
