import Image from 'next/image';

async function getProducts(searchParams: Record<string,string | string[] | undefined>) {
  const params = new URLSearchParams();
  if (searchParams.category) params.set('category', String(searchParams.category));
  if (searchParams.page) params.set('page', String(searchParams.page));
  if (searchParams.limit) params.set('limit', String(searchParams.limit));
  if (searchParams.search) params.set('search', String(searchParams.search));
  if (searchParams.sortOrder) params.set('sortOrder', String(searchParams.sortOrder));

  const base = process.env.NEXT_PUBLIC_API_BASE!;
  const res = await fetch(`${base}/products?${params.toString()}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to load products');
  return res.json() as Promise<{ products:any[]; pagination:any }>;
}

export default async function ProductsPage({ searchParams }: { searchParams: any }) {
  const { products, pagination } = await getProducts(searchParams);

  return (
    <main className="mx-auto max-w-6xl p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(p => (
          <div key={p._id} className="rounded-xl border p-4">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg">
              <Image src={p.imageUrl} alt={p.name} fill className="object-cover" />
            </div>
            <div className="mt-3">
              <div className="font-medium">{p.name}</div>
              <div className="text-sm text-muted-foreground">{p.category}</div>
              <div className="mt-1 font-semibold">${p.price.toFixed(2)}</div>
            </div>
          </div>
        ))}
      </div>
      {/* basic pager */}
      <div className="flex gap-3">
        <a className="btn" href={`?page=${Math.max(1, (pagination.page ?? 1) - 1)}`}>Prev</a>
        <a className="btn" href={`?page=${Math.min(pagination.pages, (pagination.page ?? 1) + 1)}`}>Next</a>
      </div>
    </main>
  );
}
