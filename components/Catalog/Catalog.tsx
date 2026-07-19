"use client";

import { useMemo, useState } from "react";
import { CATEGORIES, FINISHES, SIZES, type Product } from "@/lib/products";
import { COLOR_FAMILIES } from "@/lib/colorFamilies";
import ProductCard from "./ProductCard";
import ProductModal from "./ProductModal";
import Reveal from "../Reveal";
import styles from "./Catalog.module.css";

type Filters = {
  category: string | null;
  finish: string | null;
  size: string | null;
  color: string | null;
};

const EMPTY_FILTERS: Filters = { category: null, finish: null, size: null, color: null };

function matchesColorFamily(colors: string[], familyName: string | null): boolean {
  if (!familyName) return true;
  const family = COLOR_FAMILIES.find((f) => f.name === familyName);
  if (!family) return true;
  return colors.some((c) => family.match.includes(c.toUpperCase()));
}

export default function Catalog({ products }: { products: Product[] }) {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [openId, setOpenId] = useState<string | null>(null);

  const results = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter((p) => {
      if (filters.category && p.category !== filters.category) return false;
      if (filters.finish && p.finish !== filters.finish) return false;
      if (filters.size && p.size !== filters.size) return false;
      if (!matchesColorFamily(p.colors, filters.color)) return false;
      if (q) {
        const hay = `${p.name} ${p.category} ${p.desc} ${p.tags.join(" ")} ${p.use.join(" ")}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [products, search, filters]);

  const openProduct = products.find((p) => p.id === openId) ?? null;

  const toggle = (key: keyof Filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: prev[key] === value ? null : value }));
  };

  const clearAll = () => {
    setSearch("");
    setFilters(EMPTY_FILTERS);
  };

  const hasActiveFilters =
    !!search || !!filters.category || !!filters.finish || !!filters.size || !!filters.color;

  return (
    <section className={styles.section} id="collections">
      <div className={styles.inner}>
        <div className={styles.head}>
          <span className="ghost-num">03</span>
          <div className={`s-label ${styles.headLabel}`}>
            <span className="s-index">03</span>Our Collections
          </div>
          <h2 className="s-title">
            Every Tile, <em>Every Story</em>
          </h2>

          <div className={styles.searchWrap}>
            <div className={styles.searchBox}>
              <span>🔍</span>
              <input
                className={styles.searchInput}
                type="text"
                placeholder="Search tiles by name, style, color, room..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className={styles.layout}>
          <aside className={styles.filters}>
            <div className={styles.filterHead}>
              <span className={styles.filterTitle}>Filters</span>
              {hasActiveFilters && (
                <button className={styles.filterClear} onClick={clearAll}>
                  Clear All
                </button>
              )}
            </div>

            <div className={styles.filterGroup}>
              <span className={styles.filterLabel}>Category</span>
              <div className={styles.chipGroup}>
                {CATEGORIES.map((c) => (
                  <button
                    key={c}
                    className={`${styles.chip} ${filters.category === c ? styles.active : ""}`}
                    onClick={() => toggle("category", c)}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.filterGroup}>
              <span className={styles.filterLabel}>Finish</span>
              <div className={styles.chipGroup}>
                {FINISHES.map((f) => (
                  <button
                    key={f}
                    className={`${styles.chip} ${filters.finish === f ? styles.active : ""}`}
                    onClick={() => toggle("finish", f)}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.filterGroup}>
              <span className={styles.filterLabel}>Size</span>
              <div className={styles.chipGroup}>
                {SIZES.map((s) => (
                  <button
                    key={s}
                    className={`${styles.chip} ${filters.size === s ? styles.active : ""}`}
                    onClick={() => toggle("size", s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.filterGroup}>
              <span className={styles.filterLabel}>Color</span>
              <div className={styles.colorGrid}>
                {COLOR_FAMILIES.map((c) => (
                  <button
                    key={c.name}
                    className={`${styles.colorChip} ${filters.color === c.name ? styles.active : ""}`}
                    style={{ background: c.hex }}
                    title={c.name}
                    onClick={() => toggle("color", c.name)}
                  />
                ))}
              </div>
            </div>
          </aside>

          <div>
            <div className={styles.resultsBar}>
              <span className={styles.count}>
                <strong>{results.length}</strong>
                tiles found
              </span>
            </div>

            {results.length === 0 ? (
              <div className={styles.empty}>
                <div className={styles.emptyIc}>🔍</div>
                <div className={styles.emptyTitle}>No tiles found</div>
                <div className={styles.emptySub}>Try adjusting your search or filters</div>
              </div>
            ) : (
              <div className={styles.grid}>
                {results.map((p, i) => (
                  <Reveal key={p.id} delay={(i % 3) * 90}>
                    <ProductCard product={p} onOpen={setOpenId} />
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {openProduct && (
        <ProductModal product={openProduct} onClose={() => setOpenId(null)} />
      )}
    </section>
  );
}
