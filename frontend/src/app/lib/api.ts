// src/app/lib/api.ts
const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

// Small helper to safely join paths
function join(base: string, path: string) {
  if (!path) return base;
  return `${base.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
}

export async function apiFetch(
  path: string,
  options: RequestInit & { noAuth?: boolean } = {}
) {
  const url = join(BASE, path);

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  // attach token by default
  if (!options.noAuth) {
    try {
      const t = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (t) headers.Authorization = `Bearer ${t}`;
    } catch {}
  }

  const res = await fetch(url, { ...options, headers });

  let data: any = null;
  try {
    data = await res.json();
  } catch {
    // ignore non-JSON responses
  }

  if (!res.ok) {
    const message = data?.error || data?.message || `Request failed (${res.status})`;
    const err: any = new Error(message);
    err.status = res.status;
    throw err;
  }

  return data;
}
