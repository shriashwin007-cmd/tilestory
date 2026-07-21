"use client";

import { createElement, type ElementType } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";

export type KineticSegment = { text: string; em?: boolean };

type Token = { word: string; em: boolean; newLine: boolean; last: boolean };

function tokenize(segments: KineticSegment[]): Token[] {
  const tokens: Token[] = [];
  segments.forEach((seg) => {
    seg.text.split("\n").forEach((line, li) => {
      line
        .split(" ")
        .filter(Boolean)
        .forEach((word, wi) => {
          tokens.push({ word, em: !!seg.em, newLine: li > 0 && wi === 0, last: false });
        });
    });
  });
  if (tokens.length) tokens[tokens.length - 1].last = true;
  return tokens;
}

const wordVariants: Variants = {
  hidden: { opacity: 0, y: "0.6em", filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: "0em",
    filter: "blur(0px)",
    transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] },
  },
};

// Word-by-word kinetic reveal: each word slides up out of a clipping mask
// while fading/unblurring in, staggered across the whole heading. Used for
// the hero headline (animates on mount) and every other section heading
// (animates once scrolled into view), so the same kinetic language reads
// consistently across the site.
export default function KineticText({
  segments,
  as = "h2",
  className,
  stagger = 0.05,
  delay = 0,
  inView = true,
}: {
  segments: KineticSegment[];
  as?: ElementType;
  className?: string;
  stagger?: number;
  delay?: number;
  inView?: boolean;
}) {
  const prefersReducedMotion = useReducedMotion();
  const tokens = tokenize(segments);
  const fullText = tokens.map((t) => t.word).join(" ");

  if (prefersReducedMotion) {
    return createElement(
      as,
      { className },
      segments.map((seg, i) =>
        seg.em ? <em key={i}>{seg.text}</em> : <span key={i}>{seg.text}</span>
      )
    );
  }

  const MotionTag = (motion as unknown as Record<string, ElementType>)[as as string] ?? motion.h2;

  const containerProps = inView
    ? { initial: "hidden", whileInView: "visible", viewport: { once: true, amount: 0.6 } }
    : { initial: "hidden", animate: "visible" };

  return createElement(
    MotionTag as ElementType,
    {
      className,
      "aria-label": fullText,
      variants: { hidden: {}, visible: { transition: { staggerChildren: stagger, delayChildren: delay } } },
      ...containerProps,
    },
    tokens.map((t, i) => (
      // The <br/> is a sibling of the word-mask span, not nested inside it —
      // a <br/> inside an inline-block only breaks within that box's own
      // content, it can't push the box itself onto a new line.
      <span key={i}>
        {t.newLine && <br />}
        <span aria-hidden="true" style={{ display: "inline-block", overflow: "hidden" }}>
          {t.em ? (
            <em style={{ fontStyle: "italic" }}>
              <motion.span variants={wordVariants} style={{ display: "inline-block" }}>
                {t.word}
                {!t.last ? " " : ""}
              </motion.span>
            </em>
          ) : (
            <motion.span variants={wordVariants} style={{ display: "inline-block" }}>
              {t.word}
              {!t.last ? " " : ""}
            </motion.span>
          )}
        </span>
      </span>
    ))
  );
}
