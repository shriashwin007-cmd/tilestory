"use client";

import { useRef, useState } from "react";
import type { Product } from "@/lib/products";
import { useRewards } from "../Rewards/RewardsContext";
import styles from "./ProductCard.module.css";

export default function ProductCard({
  product,
  onOpen,
}: {
  product: Product;
  onOpen: (id: string) => void;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const cycleRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [activeImg, setActiveImg] = useState(0);
  const images = product.images.filter(Boolean);
  const { addPoints, hasEarned } = useRewards();
  const favoriteKey = `favorite_${product.id}`;
  const favorited = hasEarned(favoriteKey);

  const onFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    addPoints(favoriteKey, 8, `Favorited ${product.name}`);
  };

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
    <div
      ref={ref}
      role="button"
      tabIndex={0}
      className={styles.card}
      onClick={() => onOpen(product.id)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen(product.id);
        }
      }}
      onMouseMove={onMove}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <div className={styles.imgWrap}>
        {images.length > 0 ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={images[activeImg]}
            alt={product.name}
            className={styles.img}
            loading="lazy"
            decoding="async"
          />
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
        <button
          type="button"
          className={`${styles.favBtn} ${favorited ? styles.favBtnActive : ""}`}
          onClick={onFavorite}
          aria-label={favorited ? "Favorited" : "Favorite this tile"}
          aria-pressed={favorited}
        >
          {favorited ? "♥" : "♡"}
        </button>
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
    </div>
  );
}
