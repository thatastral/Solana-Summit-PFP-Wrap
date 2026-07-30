import { motion } from "motion/react";
import "./PatternBackground.css";

interface PatternBackgroundProps {
  variant?: "hero" | "result";
}

/**
 * Ambient backdrop shared by every screen: the diamond pattern bleeding in
 * from the left/right edges, plus (on the result screen) the slow-rotating
 * sunburst glow behind the reveal card. Kept purely decorative/pointer-events
 * none so it never competes with the real content for interaction.
 */
export function PatternBackground({ variant = "hero" }: PatternBackgroundProps) {
  return (
    <div className="pattern-bg" aria-hidden="true">
      <div className="pattern-bg__wash" />
      <div className="pattern-band pattern-band--left" />
      <div className="pattern-band pattern-band--right" />
      {variant === "result" && (
        <motion.div
          className="pattern-bg__sunburst"
          animate={{ rotate: 360 }}
          transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
        />
      )}
      <div className="pattern-bg__vignette" />
    </div>
  );
}
