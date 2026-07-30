import { motion } from "motion/react";
import { TiltCard } from "./TiltCard";
import "./ResultReveal.css";

interface ResultRevealProps {
  pfpDataUrl: string;
  cardDataUrl: string;
  onDownloadPfp: () => void;
  onDownloadCard: () => void;
  onDownloadBoth: () => void;
  onReset: () => void;
}

export function ResultReveal({
  pfpDataUrl,
  cardDataUrl,
  onDownloadPfp,
  onDownloadCard,
  onDownloadBoth,
  onReset,
}: ResultRevealProps) {
  return (
    <motion.section
      className="result"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
    >
      <motion.p
        className="result__eyebrow"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      >
        You're all set
      </motion.p>

      <motion.div
        className="result__stage"
        initial={{ opacity: 0, scale: 0.94, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.55, ease: [0.23, 1, 0.32, 1] }}
      >
        <TiltCard className="result__card" maxTilt={6}>
          <img src={cardDataUrl} alt="Your Solana Summit Nigeria attendee card" />
        </TiltCard>

        <motion.div
          className="result__pfp"
          initial={{ opacity: 0, scale: 0.85, rotate: -6 }}
          animate={{ opacity: 1, scale: 1, rotate: -14.18 }}
          transition={{ delay: 0.45, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
        >
          <TiltCard className="result__pfp-tilt" maxTilt={14}>
            <img src={pfpDataUrl} alt="Your Solana Summit Nigeria PFP" />
          </TiltCard>
        </motion.div>
      </motion.div>

      <motion.div
        className="result__actions"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      >
        <button type="button" className="btn btn-primary" onClick={onDownloadBoth}>
          Download Both
        </button>
        <div className="result__secondary">
          <button type="button" className="result__link" onClick={onDownloadPfp}>
            Download PFP
          </button>
          <span aria-hidden="true">·</span>
          <button type="button" className="result__link" onClick={onDownloadCard}>
            Download Card
          </button>
        </div>
        <button type="button" className="result__reset" onClick={onReset}>
          Create another
        </button>
      </motion.div>
    </motion.section>
  );
}
