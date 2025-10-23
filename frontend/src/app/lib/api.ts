const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL?.startsWith("http")) {
  throw new Error(
    "NEXT_PUBLIC_API_URL is missing or invalid. " +
    "Set it in Vercel → Project → Settings → Environment Variables."
  );
}

export async function apiFetch(path: string, init: RequestInit = {}) {
  const url = path.startsWith("http")
    ? path
    : `${API_URL}${path.startsWith("/") ? "" : "/"}${path}`;

  const res = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`API ${res.status} ${res.statusText} for ${url}: ${text}`);
  }
  return res.json();
}
