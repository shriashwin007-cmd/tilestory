"use client";

import { useEffect, useState } from "react";
import { STORE, waLink } from "@/lib/store";
import styles from "./Nav.module.css";

const LINKS = [
  { href: "#about", label: "About" },
  { href: "#collections", label: "Collections" },
  { href: "#reviews", label: "Reviews" },
  { href: "#contact", label: "Contact" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
  }, [mobileOpen]);

  return (
    <>
      <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ""}`}>
        <a href="#hero" className={styles.logo}>
          <div>
            <span className={styles.logoName}>Tile Story</span>
            <span className={styles.logoSub}>Chennai</span>
          </div>
        </a>

        <div className={styles.links}>
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className={styles.navItem}>
              {l.label}
            </a>
          ))}
        </div>

        <div className={styles.actions}>
          <a href={`tel:${STORE.phoneTel}`} className={styles.btnGhost}>
            Call Now
          </a>
          <a
            href={waLink("Hi Tile Story! I'd like to know more about your tiles.")}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.btnCta}
          >
            WhatsApp
          </a>
        </div>

        <button
          className={styles.burger}
          aria-label="Menu"
          onClick={() => setMobileOpen(true)}
        >
          ☰
        </button>
      </nav>

      <div
        className={`${styles.overlay} ${mobileOpen ? styles.open : ""}`}
        onClick={() => setMobileOpen(false)}
      />
      <div className={`${styles.mobileMenu} ${mobileOpen ? styles.open : ""}`}>
        {LINKS.map((l) => (
          <a key={l.href} href={l.href} onClick={() => setMobileOpen(false)}>
            {l.label}
          </a>
        ))}
        <a href={`tel:${STORE.phoneTel}`}>Call Now</a>
        <a
          href={waLink("Hi Tile Story! I'd like to know more about your tiles.")}
          target="_blank"
          rel="noopener noreferrer"
        >
          WhatsApp
        </a>
      </div>
    </>
  );
}
