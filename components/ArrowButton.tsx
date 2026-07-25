"use client";

import { createElement, useRef, type ReactNode, type ElementType } from "react";
import styles from "./ArrowButton.module.css";

export default function ArrowButton({
  children,
  as,
  variant = "solid",
  className = "",
  ...props
}: {
  children: ReactNode;
  as?: ElementType;
  variant?: "solid" | "ghost";
  className?: string;
  [key: string]: unknown;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const rectRef = useRef<DOMRect | null>(null);
  const Tag: ElementType = as ?? "button";

  // getBoundingClientRect() forces a layout — reading it on every mousemove
  // (instead of once per hover) was a real source of scroll/interaction
  // jank sitewide, since ArrowButton is used all over. Cached on enter.
  const onEnter = () => {
    rectRef.current = ref.current?.getBoundingClientRect() ?? null;
  };
  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    const rect = rectRef.current;
    if (!el || !rect) return;
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    el.style.transform = `translate(${x * 0.2}px, ${y * 0.3}px)`;
  };
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = "translate(0, 0)";
    rectRef.current = null;
  };

  return createElement(
    Tag,
    {
      ref,
      onMouseEnter: onEnter,
      onMouseMove: onMove,
      onMouseLeave: onLeave,
      className: `${styles.btn} ${variant === "ghost" ? styles.ghost : styles.solid} ${className}`,
      ...props,
    },
    <>
      <span className={styles.label}>{children}</span>
      <span className={styles.circle}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
          <path
            d="M7 17L17 7M17 7H8M17 7V16"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </>
  );
}
