const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";
const TOKEN_KEY = "jp_tokens";

export interface Tokens {
  access: string;
  refresh: string;
}

export function getTokens(): Tokens | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(TOKEN_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Tokens;
  } catch {
    return null;
  }
}

export function setTokens(tokens: Tokens) {
  localStorage.setItem(TOKEN_KEY, JSON.stringify(tokens));
}

export function clearTokens() {
  localStorage.removeItem(TOKEN_KEY);
}

async function refreshAccessToken(): Promise<string | null> {
  const tokens = getTokens();
  if (!tokens?.refresh) return null;
  const res = await fetch(`${API_BASE_URL}/auth/token/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh: tokens.refresh }),
  });
  if (!res.ok) {
    clearTokens();
    return null;
  }
  const data = await res.json();
  setTokens({ access: data.access, refresh: tokens.refresh });
  return data.access as string;
}

export class ApiError extends Error {
  status: number;
  data: unknown;
  constructor(message: string, status: number, data: unknown) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  isForm?: boolean;
  auth?: boolean;
}

export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, isForm, auth = true, headers, ...rest } = options;
  const doFetch = async (): Promise<Response> => {
    const finalHeaders: Record<string, string> = { ...(headers as Record<string, string>) };
    if (!isForm && body !== undefined) finalHeaders["Content-Type"] = "application/json";
    if (auth) {
      const tokens = getTokens();
      if (tokens?.access) finalHeaders["Authorization"] = `Bearer ${tokens.access}`;
    }
    return fetch(`${API_BASE_URL}${path}`, {
      ...rest,
      headers: finalHeaders,
      body: body === undefined ? undefined : isForm ? (body as FormData) : JSON.stringify(body),
    });
  };

  let res = await doFetch();

  if (res.status === 401 && auth) {
    const newAccess = await refreshAccessToken();
    if (newAccess) {
      res = await doFetch();
    }
  }

  if (!res.ok) {
    let data: unknown = null;
    try {
      data = await res.json();
    } catch {
      // ignore non-JSON error bodies
    }
    throw new ApiError(`Request to ${path} failed with ${res.status}`, res.status, data);
  }

  if (res.status === 204 || res.status === 205) return undefined as T;
  return (await res.json()) as T;
}

export function apiUrl(path: string) {
  return `${API_BASE_URL}${path}`;
}

interface PaginatedLike<T> {
  results: T[];
  next: string | null;
}

export async function fetchAllPages<T>(path: string): Promise<T[]> {
  let results: T[] = [];
  let next: string | null = path;
  while (next) {
    const relative = next.startsWith(API_BASE_URL) ? next.slice(API_BASE_URL.length) : next;
    const page: PaginatedLike<T> = await apiFetch<PaginatedLike<T>>(relative);
    results = results.concat(page.results);
    next = page.next;
  }
  return results;
}

export function mediaUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  const origin = API_BASE_URL.replace(/\/api\/?$/, "");
  return `${origin}${path}`;
}
