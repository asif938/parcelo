import { env } from "@/lib/env";

export interface BackendFieldError {
  path: string;
  message: string;
}

interface BackendEnvelope<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: BackendFieldError[];
}

export class BackendApiError extends Error {
  status: number;
  errors?: BackendFieldError[];

  constructor(status: number, message: string, errors?: BackendFieldError[]) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

export async function backendFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${env.apiBaseUrl}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...init.headers,
      },
      cache: "no-store",
    });
  } catch {
    throw new BackendApiError(502, "Unable to reach the server. Please try again.");
  }

  const json = (await res.json().catch(() => null)) as BackendEnvelope<T> | null;

  if (!res.ok || !json?.success) {
    throw new BackendApiError(
      res.status,
      json?.message ?? "Something went wrong. Please try again.",
      json?.errors,
    );
  }

  return json.data as T;
}
