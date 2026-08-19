import Link from "next/link";
import Image from "next/image";
import styles from "./CollectionsPageHeader.module.css";

// A purpose-built header for the dedicated /collections page rather than
// reusing Nav/MobileNav as-is -- those nav links assume being on the
// homepage (href="#collections" etc.), which would silently do nothing
// here. This page needs exactly two things: a way back to the brand, and
// a clear, explicit exit.
export default function CollectionsPageHeader() {
  return (
    <header className={styles.header}>
      <Link href="/" className={styles.logo}>
        <Image
          src="/images/logo.jpg"
          alt="Tile Story"
          width={34}
          height={34}
          className={styles.logoMark}
          priority
        />
        <span className={styles.logoName}>Tile Story</span>
      </Link>
      <Link href="/" className={styles.exit} aria-label="Exit collections">
        <span className={styles.exitIcon}>✕</span>
        <span className={styles.exitLabel}>Exit</span>
      </Link>
    </header>
  );
}
