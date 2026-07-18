"use client";

import { useRef } from "react";
import type { Product } from "@/lib/products";
import styles from "./ProductCard.module.css";

export default function ProductCard({
  product,
  onOpen,
}: {
  product: Product;
  onOpen: (id: string) => void;
}) {
  const ref = useRef<HTMLButtonElement | null>(null);

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(900px) rotateY(${px * 7}deg) rotateX(${-py * 7}deg) translateY(-6px)`;
  };

  const onLeave = () => {
    const el = ref.current;
    if (el) el.style.transform = "";
  };

  return (
    <button
      ref={ref}
      className={styles.card}
      onClick={() => onOpen(product.id)}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <div className={styles.imgWrap}>
        <div className={styles.imgPlaceholder}>{product.name}</div>
        <div className={styles.badge}>{product.category}</div>
        <span className={styles.view}>View</span>
      </div>
      <div className={styles.body}>
        <div className={styles.name}>{product.name}</div>
        <div className={styles.meta}>
          <span className={styles.size}>{product.size}</span>
          <span className={styles.dot} />
          <span className={styles.finish}>{product.finish}</span>
        </div>
        <div className={styles.colors}>
          {product.colors.map((c) => (
            <span
              key={c}
              className={styles.colorDot}
              style={{ background: c }}
            />
          ))}
        </div>
      </div>
    </button>
  );
}
