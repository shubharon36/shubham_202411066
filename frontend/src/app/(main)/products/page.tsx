import { ProductGrid } from "./_components/ProductGrid";
import { ProductFilters } from "./_components/ProductFilters";

export const dynamic = "force-dynamic";

const API = process.env.NEXT_PUBLIC_API_URL as string; // no fallback

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
  page: number; query?: string; category?: string; sort?: Search["sort"];
}) {
  if (!API?.startsWith("http")) {
    throw new Error("NEXT_PUBLIC_API_URL not set");
  }

  const sp = new URLSearchParams();
  sp.set("page", String(params.page));
  if (params.query) sp.set("search", params.query);
  if (params.category) sp.set("category", params.category);
  if (isPriceSort(params.sort)) sp.set("sortOrder", params.sort === "price_asc" ? "asc" : "desc");

  const res = await fetch(`${API}/products?${sp.toString()}`, { cache: "no-store" });
  if (!res.ok) {
    const t = await res.text().catch(() => "");
    throw new Error(`API ${res.status} for /products: ${t || res.statusText}`);
  }
  const data = await res.json();

  let products = (data.products || []).map((p: any) => ({ id: p._id || p.id, ...p }));
  if (isNameSort(params.sort)) {
    products.sort((a: any, b: any) => {
      const na = String(a.name ?? "").toLowerCase();
      const nb = String(b.name ?? "").toLowerCase();
      return params.sort === "name_asc" ? na.localeCompare(nb) : nb.localeCompare(na);
    });
  }

  return { products, totalPages: Number(data?.pagination?.pages ?? 1) };
}

export default async function ProductsPage({ searchParams }: { searchParams: Promise<Search> }) {
  const sp = await searchParams;
  const page = Number(sp?.page ?? 1);

  const { products, totalPages } = await getProducts({
    page,
    query: sp?.query,
    category: sp?.category,
    sort: sp?.sort,
  });

  return (
    <div style={{ display: "grid", gap: "var(--spacing-lg)" }}>
      <ProductFilters />
      <ProductGrid products={products} totalPages={totalPages} />
    </div>
  );
}
