"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { Input } from "@/app/components/ui/atoms/Input";
import styles from "@/styles/filters.module.css";

const categories = ["All", "Electronics", "Clothing", "Home & Garden", "Sports", "Books"];

const sortOptions = [
  { name: "Price: High to Low", value: "price_desc" },
  { name: "Price: Low to High", value: "price_asc" },
  { name: "Name: A to Z", value: "name_asc" },
  { name: "Name: Z to A", value: "name_desc" },
];

export function ProductFilters() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    params.set("page", "1");
    replace(`${pathname}?${params.toString()}`);
  };

  const handleSearch = useDebouncedCallback((term: string) => {
    handleFilterChange("query", term);
  }, 300);

  const selectedCategory = searchParams.get("category") ?? "";

  return (
    <div className={styles.container}>
      <form className={styles.form}>
        <div>
          <label htmlFor="search" className={styles.label}>Search</label>
          <Input
            id="search"
            type="text"
            onChange={(e) => handleSearch(e.target.value)}
            defaultValue={searchParams.get("query") ?? ""}
            placeholder="Search products..."
          />
        </div>

        <div className={styles.section}>
          <fieldset className={styles.fieldset}>
            <legend className={styles.legend}>Category</legend>
            <div className={styles.optionsList}>
              {categories.map((cat) => {
                const value = cat === "All" ? "" : cat;
                const checked = value === "" ? selectedCategory === "" : selectedCategory === value;
                return (
                  <div key={cat} className={styles.optionItem}>
                    <input
                      id={`category-${cat}`}
                      name="category"
                      type="radio"
                      value={value}
                      checked={checked}
                      onChange={(e) => handleFilterChange("category", e.target.value)}
                      className={styles.optionInput}
                    />
                    <label htmlFor={`category-${cat}`} className={styles.optionLabel}>
                      {cat}
                    </label>
                  </div>
                );
              })}
            </div>
          </fieldset>
        </div>

        <div className={styles.section}>
          <label htmlFor="sort" className={styles.label}>Sort by</label>
          <select
            id="sort"
            name="sort"
            onChange={(e) => handleFilterChange("sort", e.target.value)}
            defaultValue={searchParams.get("sort") ?? "price_desc"}
            className={styles.select}
          >
            {sortOptions.map((o) => (
              <option key={o.value} value={o.value}>{o.name}</option>
            ))}
          </select>
        </div>
      </form>
    </div>
  );
}
