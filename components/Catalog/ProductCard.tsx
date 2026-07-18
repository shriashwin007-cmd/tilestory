import type { Product } from "@/lib/products";
import styles from "./ProductCard.module.css";

export default function ProductCard({
  product,
  onOpen,
}: {
  product: Product;
  onOpen: (id: string) => void;
}) {
  return (
    <button className={styles.card} onClick={() => onOpen(product.id)}>
      <div className={styles.imgWrap}>
        <div className={styles.imgPlaceholder}>{product.name}</div>
        <div className={styles.badge}>{product.category}</div>
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
