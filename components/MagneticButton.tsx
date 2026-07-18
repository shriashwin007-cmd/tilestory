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
  const Tag: ElementType = as ?? "button";

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
  };

  const onLeave = () => {
    const el = ref.current;
    if (el) el.style.transform = "translate(0, 0)";
  };

  return createElement(
    Tag,
    {
      ref,
      onMouseMove: onMove,
      onMouseLeave: onLeave,
      style: { transition: "transform 0.25s var(--ease-spring)" },
      ...props,
    },
    children
  );
}
