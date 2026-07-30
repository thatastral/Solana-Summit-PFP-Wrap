import { motion } from "motion/react";
import summitLogo from "../assets/2026/summit-logo.svg";
import "./GenerationOverlay.css";

const STEPS = ["Preparing image", "Creating PFP", "Creating attendee card"];

interface GenerationOverlayProps {
  currentStep: number; // 0-based index into STEPS
}

export function GenerationOverlay({ currentStep }: GenerationOverlayProps) {
  return (
    <motion.div
      className="gen-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
    >
      <motion.div
        className="gen-overlay__mark"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: [0.77, 0, 0.175, 1] }}
      >
        <img src={summitLogo} alt="" />
        <span className="gen-overlay__ring" />
      </motion.div>

      <ul className="gen-overlay__steps">
        {STEPS.map((label, i) => {
          const state = i < currentStep ? "done" : i === currentStep ? "active" : "pending";
          return (
            <li key={label} className={`gen-overlay__step gen-overlay__step--${state}`}>
              <span className="gen-overlay__dot">{state === "done" ? "✓" : ""}</span>
              {label}
            </li>
          );
        })}
      </ul>
    </motion.div>
  );
}
