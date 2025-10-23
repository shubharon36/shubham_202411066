// src/app/(main)/products/[id]/page.tsx
import ProductDetailClient from "./ProductDetailClient";

export const dynamic = "force-dynamic";

const API = process.env.NEXT_PUBLIC_API_URL!; // e.g. https://your-backend/api

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const res = await fetch(`${API}/products/${id}`, { cache: "no-store" });
  if (!res.ok) {
    return (
      <div style={{ padding: 24, textAlign: "center" }}>
        Product not found.
      </div>
    );
  }

  const data = await res.json();
  const product = { id: data.product._id || data.product.id, ...data.product };

  return <ProductDetailClient product={product} />;
}
