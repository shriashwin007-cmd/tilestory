"use client";

import { createElement, useRef, type ReactNode, type ElementType } from "react";

export default function MagneticButton({
  children,
  as,
  strength = 0.35,
  ...props
}: {
  children: ReactNode;
  as?: ElementType;
  strength?: number;
  [key: string]: unknown;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const rectRef = useRef<DOMRect | null>(null);
  const Tag: ElementType = as ?? "button";

  // Cached on enter rather than read on every mousemove -- see ArrowButton
  // for why (getBoundingClientRect forces a layout).
  const onEnter = () => {
    rectRef.current = ref.current?.getBoundingClientRect() ?? null;
  };
  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    const rect = rectRef.current;
    if (!el || !rect) return;
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
  };

  const onLeave = () => {
    const el = ref.current;
    if (el) el.style.transform = "translate(0, 0)";
    rectRef.current = null;
  };

  return createElement(
    Tag,
    {
      ref,
      onMouseEnter: onEnter,
      onMouseMove: onMove,
      onMouseLeave: onLeave,
      style: { transition: "transform 0.25s var(--ease-spring)" },
      ...props,
    },
    children
  );
}
