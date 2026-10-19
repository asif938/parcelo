import type { ApiEnvelope } from "@/types/api";

export async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  const json = (await res.json().catch(() => ({}))) as ApiEnvelope<T>;
  if (!res.ok || !json.success || json.data === undefined) {
    throw new Error(json.message ?? "Something went wrong. Please try again.");
  }
  return json.data;
}

export function toQueryString(params: object) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params) as [string, string | number | undefined][]) {
    if (value !== undefined) search.set(key, String(value));
  }
  const query = search.toString();
  return query ? `?${query}` : "";
}
