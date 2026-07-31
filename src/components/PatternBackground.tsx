import { motion, useReducedMotion } from "motion/react";
import raysUrl from "../assets/2026/rays.png";
import "./PatternBackground.css";

interface PatternBackgroundProps {
  variant?: "hero" | "result";
}

/**
 * Ambient backdrop shared by every screen: the diamond pattern wash and the
 * ornamental side bands.
 *
 * On the result screen the pattern is pushed back behind the same frosted
 * blur the upload modal uses, and the ray burst is layered *on top* of that
 * blur -- so the rays stay crisp while everything behind them softens.
 * DOM order below is the paint order; all of it is pointer-events none.
 */
export function PatternBackground({ variant = "hero" }: PatternBackgroundProps) {
  const reduceMotion = useReducedMotion();
  const isResult = variant === "result";

  return (
    <div className="pattern-bg" aria-hidden="true">
      <div className="pattern-bg__wash" />

      {/* Static: the artwork is a one-off composition with no repeating
          period, so it is shown complete and still rather than animated. */}
      <div className="pattern-band pattern-band--left" />
      <div className="pattern-band pattern-band--right" />

      {/* Phones get their own artwork, which carries both columns already
          positioned for a narrow screen. CSS decides which is shown. */}
      <div className="pattern-bg__mobile" />

      {isResult && <div className="pattern-bg__frost" />}

      {isResult && (
        /* The wrapper owns the centring translate so Motion is free to own
           `transform` on the child without fighting it. */
        <div className="pattern-bg__rays-wrap">
          <motion.div
            className="pattern-bg__rays"
            style={{ backgroundImage: `url(${raysUrl})` }}
            initial={{ opacity: 0, scale: 0.94 }}
            animate={
              reduceMotion
                ? { opacity: 1, scale: 1 }
                : { opacity: 1, scale: [1, 1.07, 1], rotate: [0, 360] }
            }
            transition={{
              opacity: { duration: 1.2, ease: [0.23, 1, 0.32, 1] },
              scale: { duration: 22, repeat: Infinity, ease: "easeInOut" },
              rotate: { duration: 300, repeat: Infinity, ease: "linear" },
            }}
          />
        </div>
      )}

      <div className="pattern-bg__vignette" />
    </div>
  );
}
