function getApiBase() {
  if (typeof window !== 'undefined') {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      console.error('NEXT_PUBLIC_API_URL not set!');
      return 'https://shubham-202411066.onrender.com'; // Fallback
    }
    return apiUrl.replace(/\/+$/, '').replace(/\/api$/, '');
  }
  
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || 'https://shubham-202411066.onrender.com';
  return apiUrl.replace(/\/+$/, '').replace(/\/api$/, '');
}

export const API_BASE = getApiBase();

export async function apiFetch(path: string, init: RequestInit = {}) {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const headers = new Headers(init.headers as HeadersInit);
  if (!headers.has("Content-Type") && init.body) {
    headers.set("Content-Type", "application/json");
  }
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  const url = `${API_BASE}/api${cleanPath}`;
  
  console.log('API Request:', url);

  const res = await fetch(url, { ...init, headers });
  const text = await res.text();
  const data = text ? JSON.parse(text) : {};
  
  if (!res.ok) {
    const msg = data?.error || res.statusText || "Request failed";
    throw Object.assign(new Error(msg), { status: res.status, data });
  }
  
  return data;
}
