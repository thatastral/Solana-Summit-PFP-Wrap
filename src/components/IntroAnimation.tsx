import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import summitLogo from "../assets/2026/summit-logo.svg";
import "./IntroAnimation.css";

interface IntroAnimationProps {
  onComplete: () => void;
}

/**
 * Pre-load moment before the landing page reveals itself: the diamond
 * pattern sweeps diagonally across the screen, the Summit logo lands in the
 * center, then the whole thing dissolves into the real page. Skippable by
 * click/keypress, and collapses to a plain fade under reduced motion.
 */
export function IntroAnimation({ onComplete }: IntroAnimationProps) {
  const [visible, setVisible] = useState(true);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const totalMs = reduceMotion ? 500 : 2200;
    const timer = setTimeout(() => setVisible(false), totalMs);
    return () => clearTimeout(timer);
  }, [reduceMotion]);

  const skip = () => setVisible(false);

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {visible && (
        <motion.div
          className="intro"
          role="presentation"
          onClick={skip}
          onKeyDown={skip}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.77, 0, 0.175, 1] }}
        >
          {!reduceMotion && (
            <motion.div
              className="intro__pattern"
              initial={{ x: "35%", y: "-35%", opacity: 0 }}
              animate={{ x: "-35%", y: "35%", opacity: [0, 0.6, 0.6, 0] }}
              transition={{ duration: 1.9, ease: [0.23, 1, 0.32, 1], times: [0, 0.25, 0.75, 1] }}
            />
          )}
          <motion.img
            src={summitLogo}
            alt="Solana Summit"
            className="intro__logo"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: reduceMotion ? 0 : 0.5,
              duration: reduceMotion ? 0.3 : 0.6,
              ease: [0.23, 1, 0.32, 1],
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
