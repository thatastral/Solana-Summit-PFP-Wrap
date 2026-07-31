import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import summitLogo from "../assets/2026/summit-logo.svg";
import "./IntroAnimation.css";

interface IntroAnimationProps {
  onComplete: () => void;
}

/**
 * Pre-load moment before the landing page reveals itself. The diamond
 * pattern drifts slowly and continuously from top-right to bottom-left --
 * it is still in motion when the Summit logo settles in, and keeps moving
 * behind it until the whole overlay opens up into the page.
 * Skippable by click/keypress, and reduced to a plain fade for users who
 * prefer reduced motion.
 */
export function IntroAnimation({ onComplete }: IntroAnimationProps) {
  const [visible, setVisible] = useState(true);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const totalMs = reduceMotion ? 500 : 2600;
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
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
        >
          {!reduceMotion && (
            <motion.div
              className="intro__pattern"
              initial={{ x: "18%", y: "-18%", opacity: 0 }}
              animate={{
                x: "-18%",
                y: "18%",
                opacity: [0, 0.55, 0.55, 0.4],
              }}
              transition={{
                x: { duration: 6, ease: "linear" },
                y: { duration: 6, ease: "linear" },
                opacity: { duration: 2.6, times: [0, 0.24, 0.72, 1], ease: "easeOut" },
              }}
            />
          )}
          <motion.img
            src={summitLogo}
            alt="Solana Summit Nigeria"
            className="intro__logo"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: reduceMotion ? 0 : 0.6,
              duration: reduceMotion ? 0.3 : 0.8,
              ease: [0.23, 1, 0.32, 1],
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
