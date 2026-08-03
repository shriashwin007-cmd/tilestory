"use client";

import { useState } from "react";
import Image from "next/image";
import { STORE, waLink } from "@/lib/store";
import styles from "./MobileNav.module.css";

const LINKS = [
  { href: "#about", label: "Our Story" },
  { href: "#collections", label: "Collections" },
  { href: "#rewards", label: "Tile Points" },
  { href: "#reviews", label: "Reviews" },
  { href: "#contact", label: "Visit Us" },
];

export default function MobileNav() {
  const [open, setOpen] = useState(false);

  const go = (href: string) => {
    setOpen(false);
    document.getElementById(href.slice(1))?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <nav className={styles.nav}>
        <a href="/" className={styles.logo}>
          <Image src="/images/logo.jpg" alt="Tile Story" width={32} height={32} className={styles.logoMark} priority />
          <span className={styles.logoName}>Tile Story</span>
        </a>
        <button
          type="button"
          className={styles.burger}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className={`${styles.burgerLine} ${open ? styles.burgerOpen1 : ""}`} />
          <span className={`${styles.burgerLine} ${open ? styles.burgerOpen2 : ""}`} />
          <span className={`${styles.burgerLine} ${open ? styles.burgerOpen3 : ""}`} />
        </button>
      </nav>

      <div className={`${styles.sheet} ${open ? styles.sheetOpen : ""}`}>
        <div className={styles.sheetLinks}>
          {LINKS.map((l) => (
            <button key={l.href} type="button" className={styles.sheetLink} onClick={() => go(l.href)}>
              {l.label}
            </button>
          ))}
        </div>
        <div className={styles.sheetActions}>
          <a href={`tel:${STORE.phoneTel}`} className={styles.sheetCall}>
            Call {STORE.phoneDisplay}
          </a>
          <a
            href={waLink("Hi Tile Story! I'd like to know more about your tiles.")}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.sheetWa}
          >
            Chat on WhatsApp
          </a>
        </div>
      </div>
      {open && <div className={styles.backdrop} onClick={() => setOpen(false)} aria-hidden="true" />}
    </>
  );
}
