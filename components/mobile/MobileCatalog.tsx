"use client";

import { useMemo, useState } from "react";
import { CATEGORIES, FINISHES, SIZES, type Product } from "@/lib/products";
import { COLOR_FAMILIES } from "@/lib/colorFamilies";
import { waLink } from "@/lib/store";
import { useRewards } from "../Rewards/RewardsContext";
import SectionBgVideo from "../SectionBgVideo";
import styles from "./MobileCatalog.module.css";

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

export default function MobileCatalog({ products }: { products: Product[] }) {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [openProduct, setOpenProduct] = useState<Product | null>(null);
  const { addPoints, hasEarned } = useRewards();

  const results = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter((p) => {
      if (filters.category && p.category !== filters.category) return false;
      if (filters.finish && p.finish !== filters.finish) return false;
      if (filters.size && p.size !== filters.size) return false;
      if (!matchesColorFamily(p.colors, filters.color)) return false;
      if (q) {
        const hay = `${p.name} ${p.category} ${p.desc} ${p.tags.join(" ")}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [products, search, filters]);

  const activeCount = Object.values(filters).filter(Boolean).length;

  const toggle = (key: keyof Filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: prev[key] === value ? null : value }));
    addPoints("used_filter", 10, "Filtered the Collection");
  };

  return (
    <section className={styles.section} id="collections">
      <SectionBgVideo src="/videos/catalog-section-bg.mp4" tint="light" />
      <div className={styles.head}>
        <span className={styles.label}>Our Collections</span>
        <h2 className={styles.title}>Every Tile, Every Story</h2>
      </div>

      <div className={styles.toolbar}>
        <div className={styles.searchBox}>
          <span>🔍</span>
          <input
            className={styles.searchInput}
            type="text"
            placeholder="Search tiles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button type="button" className={styles.filterBtn} onClick={() => setFilterSheetOpen(true)}>
          Filters {activeCount > 0 && <span className={styles.filterCount}>{activeCount}</span>}
        </button>
      </div>

      <div className={styles.count}>{results.length} tiles found</div>

      <div className={styles.grid}>
        {results.map((p) => (
          <button
            key={p.id}
            type="button"
            className={styles.card}
            onClick={() => {
              setOpenProduct(p);
              addPoints("viewed_product", 5, "Viewed a Tile");
            }}
          >
            <div className={styles.cardImgWrap}>
              {p.images[0] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.images[0]} alt={p.name} className={styles.cardImg} loading="lazy" />
              ) : (
                <div className={styles.cardImgPlaceholder}>{p.name}</div>
              )}
              <span className={styles.cardBadge}>{p.category}</span>
              {hasEarned(`favorite_${p.id}`) && <span className={styles.cardFav}>♥</span>}
            </div>
            <div className={styles.cardBody}>
              <div className={styles.cardName}>{p.name}</div>
              <div className={styles.cardMeta}>
                {p.size} · {p.finish}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Filter bottom sheet */}
      <div className={`${styles.sheetBackdrop} ${filterSheetOpen ? styles.sheetBackdropOpen : ""}`} onClick={() => setFilterSheetOpen(false)} />
      <div className={`${styles.filterSheet} ${filterSheetOpen ? styles.filterSheetOpen : ""}`}>
        <div className={styles.sheetHandle} />
        <div className={styles.sheetHeadRow}>
          <span className={styles.sheetTitle}>Filters</span>
          {activeCount > 0 && (
            <button type="button" className={styles.clearBtn} onClick={() => setFilters(EMPTY_FILTERS)}>
              Clear All
            </button>
          )}
        </div>
        <div className={styles.sheetScroll}>
          <FilterGroup label="Category" options={CATEGORIES as unknown as string[]} active={filters.category} onToggle={(v) => toggle("category", v)} />
          <FilterGroup label="Finish" options={FINISHES as unknown as string[]} active={filters.finish} onToggle={(v) => toggle("finish", v)} />
          <FilterGroup label="Size" options={SIZES as unknown as string[]} active={filters.size} onToggle={(v) => toggle("size", v)} />
          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}>Color</span>
            <div className={styles.colorGrid}>
              {COLOR_FAMILIES.map((c) => (
                <button
                  key={c.name}
                  type="button"
                  className={`${styles.colorChip} ${filters.color === c.name ? styles.colorChipActive : ""}`}
                  style={{ background: c.hex }}
                  aria-label={c.name}
                  onClick={() => toggle("color", c.name)}
                />
              ))}
            </div>
          </div>
        </div>
        <button type="button" className={styles.applyBtn} onClick={() => setFilterSheetOpen(false)}>
          Show {results.length} Tiles
        </button>
      </div>

      {/* Product detail sheet */}
      <div className={`${styles.sheetBackdrop} ${openProduct ? styles.sheetBackdropOpen : ""}`} onClick={() => setOpenProduct(null)} />
      {openProduct && (
        <div className={`${styles.productSheet} ${styles.productSheetOpen}`}>
          <div className={styles.sheetHandle} />
          <button type="button" className={styles.closeBtn} onClick={() => setOpenProduct(null)} aria-label="Close">
            ✕
          </button>
          <div className={styles.sheetScroll}>
            {openProduct.images[0] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={openProduct.images[0]} alt={openProduct.name} className={styles.detailImg} />
            ) : (
              <div className={styles.detailImgPlaceholder}>{openProduct.name}</div>
            )}
            <h3 className={styles.detailName}>{openProduct.name}</h3>
            <div className={styles.detailMeta}>
              {openProduct.size} · {openProduct.finish}
            </div>
            <p className={styles.detailDesc}>{openProduct.desc}</p>
            <div className={styles.detailColors}>
              {openProduct.colors.map((c) => (
                <span key={c} className={styles.colorDot} style={{ background: c }} />
              ))}
            </div>
            <a
              className={styles.waBtn}
              href={waLink(`Hi Tile Story! I'd like to know more about ${openProduct.name}.`)}
              target="_blank"
              rel="noopener noreferrer"
            >
              Ask About This Tile
            </a>
          </div>
        </div>
      )}
    </section>
  );
}

function FilterGroup({
  label,
  options,
  active,
  onToggle,
}: {
  label: string;
  options: string[];
  active: string | null;
  onToggle: (v: string) => void;
}) {
  return (
    <div className={styles.filterGroup}>
      <span className={styles.filterLabel}>{label}</span>
      <div className={styles.chipGroup}>
        {options.map((o) => (
          <button
            key={o}
            type="button"
            className={`${styles.chip} ${active === o ? styles.chipActive : ""}`}
            onClick={() => onToggle(o)}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}
