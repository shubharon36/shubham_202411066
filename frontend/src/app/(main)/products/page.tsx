// src/app/(main)/products/page.tsx
import { ProductGrid } from "./_components/ProductGrid";
import { ProductFilters } from "./_components/ProductFilters";

export const dynamic = "force-dynamic";

// Build a safe API base that always includes /api (even if the env var forgot it)
const RAW = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000/api";
const API_BASE = (() => {
  const trimmed = RAW.replace(/\/$/, "");
  return trimmed.endsWith("/api") ? trimmed : `${trimmed}/api`;
})();

type Search = {
  page?: string;
  query?: string;
  category?: string;
  sort?: "price_asc" | "price_desc" | "name_asc" | "name_desc";
};

function isPriceSort(s?: string) {
  return s === "price_asc" || s === "price_desc";
}
function isNameSort(s?: string) {
  return s === "name_asc" || s === "name_desc";
}

async function getProducts(params: {
  page: number;
  query?: string;
  category?: string;
  sort?: Search["sort"];
}) {
  const sp = new URLSearchParams();
  sp.set("page", String(params.page));
  if (params.query) sp.set("query", params.query);
  if (params.category) sp.set("category", params.category);

  // Map UI price sorts -> backend sortOrder (server-side sorting!)
  if (isPriceSort(params.sort)) {
    sp.set("sortOrder", params.sort === "price_asc" ? "asc" : "desc");
  }

  const res = await fetch(`${API_BASE}/products?${sp.toString()}`, { cache: "no-store" });
  if (!res.ok) {
    // Helpful error to show in UI if you want
    throw new Error(`API ${res.status} ${res.statusText} for ${API_BASE}/products?${sp.toString()}`);
  }
  const data = await res.json();

  let products = (data.products || []).map((p: any) => ({
    id: p._id || p.id,
    ...p,
  }));

  // Name sorting (client-side) only if requested
  if (isNameSort(params.sort)) {
    products.sort((a: any, b: any) => {
      const na = String(a.name ?? "").toLowerCase();
      const nb = String(b.name ?? "").toLowerCase();
      return params.sort === "name_asc" ? na.localeCompare(nb) : nb.localeCompare(na);
    });
  }

  return {
    products,
    totalPages: Number(data?.pagination?.pages ?? 1),
  };
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Search;
}) {
  const page = Number(searchParams?.page ?? 1);

  const { products, totalPages } = await getProducts({
    page,
    query: searchParams?.query,
    category: searchParams?.category,
    sort: searchParams?.sort,
  });

  return (
    <div style={{ display: "grid", gap: "var(--spacing-lg)" }}>
      <ProductFilters />
      <ProductGrid products={products} totalPages={totalPages} />
    </div>
  );
}
