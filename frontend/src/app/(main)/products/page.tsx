// src/app/(main)/products/page.tsx
import { ProductGrid } from "./_components/ProductGrid";
import { ProductFilters } from "./_components/ProductFilters";

export const dynamic = "force-dynamic";

const API = process.env.NEXT_PUBLIC_API_URL!; // e.g. https://your-backend/api

type Search = {
  page?: string;
  query?: string;      // from your UI
  category?: string;
  sort?: "price_asc" | "price_desc" | "name_asc" | "name_desc";
};

function isPriceSort(s?: string): s is "price_asc" | "price_desc" {
  return s === "price_asc" || s === "price_desc";
}
function isNameSort(s?: string): s is "name_asc" | "name_desc" {
  return s === "name_asc" || s === "name_desc";
}

async function getProducts(spObj: Search) {
  const sp = new URLSearchParams();
  const page = Number(spObj.page ?? 1);
  sp.set("page", String(page));

  // your backend expects ?search=... (not ?query=...)
  if (spObj.query) sp.set("search", spObj.query);
  if (spObj.category) sp.set("category", spObj.category);

  // server-side price sorting
  if (isPriceSort(spObj.sort)) {
    sp.set("sortOrder", spObj.sort === "price_asc" ? "asc" : "desc");
  }

  const res = await fetch(`${API}/products?${sp.toString()}`, { cache: "no-store" });

  if (!res.ok) {
    return { products: [], totalPages: 1 };
  }

  const data = await res.json();

  let products = (data.products || []).map((p: any) => ({
    id: p._id || p.id,
    ...p,
  }));

  // client-side name sorting (backend doesn’t support name sort)
  if (isNameSort(spObj.sort)) {
    products.sort((a: any, b: any) => {
      const na = String(a.name ?? "").toLowerCase();
      const nb = String(b.name ?? "").toLowerCase();
      return spObj.sort === "name_asc" ? na.localeCompare(nb) : nb.localeCompare(na);
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
  searchParams: Promise<Search>;
}) {
  const sp = await searchParams;

  const { products, totalPages } = await getProducts(sp ?? {});

  return (
    <div style={{ display: "grid", gap: "var(--spacing-lg)" }}>
      <ProductFilters />
      <ProductGrid products={products} totalPages={totalPages} />
    </div>
  );
}
