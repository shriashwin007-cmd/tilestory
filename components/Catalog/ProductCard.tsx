"use client";

import { useRef, useState } from "react";
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
  const cycleRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [activeImg, setActiveImg] = useState(0);
  const images = product.images.filter(Boolean);

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(900px) rotateY(${px * 7}deg) rotateX(${-py * 7}deg) translateY(-6px)`;
  };

  const onEnter = () => {
    if (images.length < 2) return;
    cycleRef.current = setInterval(() => {
      setActiveImg((i) => (i + 1) % images.length);
    }, 700);
  };

  const onLeave = () => {
    const el = ref.current;
    if (el) el.style.transform = "";
    if (cycleRef.current) clearInterval(cycleRef.current);
    setActiveImg(0);
  };

  return (
    <button
      ref={ref}
      className={styles.card}
      onClick={() => onOpen(product.id)}
      onMouseMove={onMove}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <div className={styles.imgWrap}>
        {images.length > 0 ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={images[activeImg]} alt={product.name} className={styles.img} />
        ) : (
          <div className={styles.imgPlaceholder}>{product.name}</div>
        )}
        {images.length > 1 && (
          <div className={styles.dots}>
            {images.map((_, i) => (
              <span key={i} className={`${styles.imgDot} ${i === activeImg ? styles.imgDotActive : ""}`} />
            ))}
          </div>
        )}
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
