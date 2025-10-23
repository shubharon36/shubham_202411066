import ProductDetailClient from "./ProductDetailClient";

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  try {
    const { id } = await params;
    
    const API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || 'https://shubham-202411066.onrender.com';
    const url = `${API_URL}/api/products/${id}`;
    
    console.log('Fetching product from:', url);
    
    const res = await fetch(url, { 
      cache: "no-store",
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!res.ok) {
      console.error(`Failed to fetch product: ${res.status}`);
      return (
        <div style={{ padding: 48, textAlign: "center" }}>
          <h2>Product not found</h2>
          <p style={{ color: '#6B7280', marginTop: 8 }}>
            The product you're looking for doesn't exist or has been removed.
          </p>
          <a href="/products" style={{ color: '#8B5CF6', marginTop: 16, display: 'inline-block' }}>
            ← Back to Products
          </a>
        </div>
      );
    }

    const data = await res.json();
    const product = { 
      id: data.product._id || data.product.id, 
      ...data.product 
    };

    return <ProductDetailClient product={product} />;
  } catch (error) {
    console.error('Error loading product:', error);
    return (
      <div style={{ padding: 48, textAlign: "center" }}>
        <h2>Error loading product</h2>
        <p style={{ color: '#6B7280', marginTop: 8 }}>
          {error instanceof Error ? error.message : 'Please try again later'}
        </p>
        <a href="/products" style={{ color: '#8B5CF6', marginTop: 16, display: 'inline-block' }}>
          ← Back to Products
        </a>
      </div>
    );
  }
}
