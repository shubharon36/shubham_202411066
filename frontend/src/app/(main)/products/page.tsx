import { ProductGrid } from "./_components/ProductGrid";
import { ProductFilters } from "./_components/ProductFilters";

export const dynamic = "force-dynamic";

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
  // Get API URL and ensure it doesn't end with /api
  let API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || 'https://shubham-202411066.onrender.com';
  
  // Remove trailing slashes and /api if present
  API_URL = API_URL.replace(/\/+$/, '').replace(/\/api$/, '');
  
  if (!API_URL?.startsWith("http")) {
    throw new Error("API URL not configured");
  }

  const sp = new URLSearchParams();
  sp.set("page", String(params.page));
  if (params.query) sp.set("search", params.query);
  if (params.category) sp.set("category", params.category);
  if (isPriceSort(params.sort)) sp.set("sortOrder", params.sort === "price_asc" ? "asc" : "desc");

  const url = `${API_URL}/api/products?${sp.toString()}`;
  console.log('Fetching from:', url);

  const res = await fetch(url, { 
    cache: "no-store",
    headers: {
      'Content-Type': 'application/json',
    }
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.error(`API error: ${res.status} - ${text}`);
    throw new Error(`Failed to fetch products: ${res.status}`);
  }

  const data = await res.json();
  let products = (data.products || []).map((p: any) => ({ 
    id: p._id || p.id, 
    ...p 
  }));

  if (isNameSort(params.sort)) {
    products.sort((a: any, b: any) => {
      const na = String(a.name ?? "").toLowerCase();
      const nb = String(b.name ?? "").toLowerCase();
      return params.sort === "name_asc" ? na.localeCompare(nb) : nb.localeCompare(na);
    });
  }

  return { 
    products, 
    totalPages: Number(data?.pagination?.pages ?? 1) 
  };
}

export default async function ProductsPage({ 
  searchParams 
}: { 
  searchParams: Promise<Search> 
}) {
  try {
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
  } catch (error) {
    console.error('Error loading products:', error);
    return (
      <div style={{ padding: '48px', textAlign: 'center' }}>
        <h2>Failed to load products</h2>
        <p style={{ color: '#6B7280', marginTop: '8px' }}>
          {error instanceof Error ? error.message : 'Please try again later'}
        </p>
      </div>
    );
  }
}
