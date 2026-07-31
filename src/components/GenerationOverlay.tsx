import { AnimatePresence, motion } from "motion/react";
import "./GenerationOverlay.css";

const STEPS = ["Preparing image...", "Creating PFP...", "Creating attendee card..."];

interface GenerationOverlayProps {
  currentStep: number; // 0-based index into STEPS
}

/**
 * One line of copy at a time over the frosted backdrop -- no logo, marks or
 * list. Each line enters from the right and leaves through the left, so the
 * sequence reads as a single strip of text passing through.
 */
export function GenerationOverlay({ currentStep }: GenerationOverlayProps) {
  const label = STEPS[Math.min(currentStep, STEPS.length - 1)];

  return (
    <motion.div
      className="gen-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
    >
      {/* `wait` so the outgoing line clears before the next arrives -- two
          overlapping lines would read as a flicker. */}
      <AnimatePresence mode="wait">
        <motion.p
          key={label}
          className="gen-overlay__step"
          /* Full transform strings rather than the `x` shorthand: canvas
             generation is occupying the main thread while this plays, and
             these stay on the compositor. */
          initial={{ opacity: 0, transform: "translateX(44px)" }}
          animate={{ opacity: 0.8, transform: "translateX(0px)" }}
          exit={{ opacity: 0, transform: "translateX(-44px)" }}
          transition={{ duration: 0.38, ease: [0.23, 1, 0.32, 1] }}
        >
          {label}
        </motion.p>
      </AnimatePresence>
    </motion.div>
  );
}
