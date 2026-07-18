import Image from "next/image";
import { STORE } from "@/lib/store";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <Image
            src="/images/logo.jpg"
            alt="Tile Story"
            width={40}
            height={40}
            style={{ borderRadius: "50%" }}
          />
          <div>
            <div className={styles.brandName}>Tile Story</div>
            <div className={styles.copy}>
              © {new Date().getFullYear()} {STORE.name}. All rights reserved.
            </div>
          </div>
        </div>
        <nav className={styles.nav}>
          <a href="#about">About</a>
          <a href="#collections">Collections</a>
          <a href="#reviews">Reviews</a>
          <a href="#contact">Contact</a>
        </nav>
      </div>
    </footer>
  );
}
