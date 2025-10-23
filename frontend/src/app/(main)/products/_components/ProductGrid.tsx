"use client";
import { ProductCard } from "@/app/components/ui/organisms/ProductCard";
import type { Product } from "@/app/types";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/app/components/ui/atoms/Button";
import styles from "@/styles/product-grid.module.css";

interface ProductGridProps {
  products: Product[];
  totalPages?: number;
}

export function ProductGrid({ products, totalPages = 1 }: ProductGridProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const currentPage = Number(searchParams.get("page") ?? 1);

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className={styles.container}>
      {products.length > 0 ? (
        <>
          <div className={styles.grid}>
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          <div className={styles.pagination}>
            <Button
              variant="outline"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1}
            >
              Previous
            </Button>
            <span className={styles.pageInfo}>
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
            >
              Next
            </Button>
          </div>
        </>
      ) : (
        <div className={styles.emptyState}>
          <p className={styles.emptyText}>No products found.</p>
        </div>
      )}
    </div>
  );
}
