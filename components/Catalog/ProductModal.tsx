"use client";

import { useEffect } from "react";
import type { Product } from "@/lib/products";
import { STORE, waLink } from "@/lib/store";
import styles from "./ProductModal.module.css";

export default function ProductModal({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const waMessage = `Hi Tile Story! I'm interested in "${product.name}" (${product.id}). Could you share more details and pricing?`;

  return (
    <div
      className={styles.overlay}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={styles.card}>
        <button className={styles.close} onClick={onClose} aria-label="Close">
          ✕
        </button>

        <div className={styles.imgWrap}>{product.name}</div>

        <div className={styles.body}>
          <div className={styles.cat}>{product.category}</div>
          <h3 className={styles.name}>{product.name}</h3>
          <div className={styles.id}>{product.id}</div>
          <p className={styles.desc}>{product.desc}</p>

          <div className={styles.specs}>
            <div className={styles.specItem}>
              <span className={styles.specLabel}>Size</span>
              <span className={styles.specValue}>{product.size}</span>
            </div>
            <div className={styles.specItem}>
              <span className={styles.specLabel}>Finish</span>
              <span className={styles.specValue}>{product.finish}</span>
            </div>
          </div>

          <div>
            <span className={styles.specLabel}>Colors</span>
            <div className={styles.colorsRow}>
              {product.colors.map((c) => (
                <span
                  key={c}
                  className={styles.colorDot}
                  style={{ background: c }}
                  title={c}
                />
              ))}
            </div>
          </div>

          <div className={styles.tags}>
            {product.use.map((u) => (
              <span key={u} className={styles.tag}>
                {u}
              </span>
            ))}
          </div>

          <div className={styles.actions}>
            <a
              className={styles.waBtn}
              href={waLink(waMessage)}
              target="_blank"
              rel="noopener noreferrer"
            >
              Enquire on WhatsApp
            </a>
            <a className={styles.callBtn} href={`tel:${STORE.phoneTel}`}>
              Call
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
