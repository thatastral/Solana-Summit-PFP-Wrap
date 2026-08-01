import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import EnvelopeReveal from "./EnvelopeReveal/EnvelopeReveal.jsx";
import type { RevealStage } from "./EnvelopeReveal/EnvelopeReveal";
import { playUiSound } from "../lib/uiSounds";
import "./ResultReveal.css";

interface ResultRevealProps {
  pfpDataUrl: string;
  cardDataUrl: string;
  userName: string;
  userRole: string;
  onDownloadBoth: () => void;
  onShareToX: () => void;
  onReset: () => void;
}

const ENTER = { duration: 0.55, ease: [0.23, 1, 0.32, 1] } as const;

export function ResultReveal({
  pfpDataUrl,
  cardDataUrl,
  userName,
  userRole,
  onDownloadBoth,
  onShareToX,
  onReset,
}: ResultRevealProps) {
  // The actions hold back until the envelope has finished playing, so the
  // reveal lands before anything asks the user to act on it.
  const [revealed, setRevealed] = useState(false);
  // The flanking copy waits for the flap to lift -- it should feel like the
  // envelope opening is what brings the message with it.
  const [opened, setOpened] = useState(false);

  const handleComplete = useCallback(() => setRevealed(true), []);

  /*
    The flanking copy sits on the "Create Another" baseline, and that same
    distance is used as its inset from the left and right edges -- so the
    gap under the text and the gap beside it are the one measurement.
    The button's position depends on how tall the envelope stage resolves
    to, so it is measured rather than hard-coded.
  */
  const rootRef = useRef<HTMLElement | null>(null);
  const resetRef = useRef<HTMLButtonElement | null>(null);

  const syncInset = useCallback(() => {
    const btn = resetRef.current;
    const root = rootRef.current;
    if (!btn || !root) return;
    const gap = window.innerHeight - btn.getBoundingClientRect().bottom;
    root.style.setProperty("--result-inset", `${Math.max(Math.round(gap), 20)}px`);
  }, []);

  useLayoutEffect(() => {
    syncInset();
    const ro = new ResizeObserver(syncInset);
    if (rootRef.current) ro.observe(rootRef.current);
    window.addEventListener("resize", syncInset);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", syncInset);
    };
  }, [syncInset]);

  // The stage settles as the envelope animates, so re-measure once it lands.
  useEffect(() => {
    if (revealed) syncInset();
  }, [revealed, syncInset]);

  const handleStageChange = useCallback((next: RevealStage) => {
    // The flap lifting is silent -- the moment worth scoring is the card
    // itself clearing the envelope, so the celebration rides that beat.
    if (next === "opening") setOpened(true);
    if (next === "card") playUiSound("celebrate");
  }, []);

  return (
    <motion.section
      ref={rootRef}
      className="result"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
    >
      <div className="result__row">
        <motion.div
          className="result__aside result__aside--left"
          initial={{ opacity: 0, x: -28 }}
          animate={opened ? { opacity: 1, x: 0 } : { opacity: 0, x: -28 }}
          transition={ENTER}
        >
          <p className="result__aside-lead">
            You're all set!
            <br />
            See you in Uyo.
          </p>
          <p className="result__aside-sub">Ibom Hotel &amp; Golf Resort</p>
        </motion.div>

        <div className="result__stage">
          <EnvelopeReveal
            attendeeCard={cardDataUrl}
            wrappedPFP={pfpDataUrl}
            userName={userName}
            userRole={userRole}
            autoPlay
            onComplete={handleComplete}
            onStageChange={handleStageChange}
            /* The component ships a dark default backdrop; the page already
               has its own, so it sits on that instead of a panel. */
            style={{ background: "transparent" }}
            cardAlt="Your Solana Summit Nigeria attendee card"
            pfpAlt="Your Solana Summit Nigeria profile picture"
          />
        </div>

        <motion.div
          className="result__aside result__aside--right"
          initial={{ opacity: 0, x: 28 }}
          animate={opened ? { opacity: 1, x: 0 } : { opacity: 0, x: 28 }}
          transition={ENTER}
        >
          <p className="result__aside-lead">
            Sat, Aug. 8
            <br />
            9AM - 5:PM
          </p>
        </motion.div>
      </div>

      <motion.div
        className="result__actions"
        initial={{ opacity: 0, y: 16 }}
        animate={revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
        transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
        // Not just invisible -- unreachable, so the buttons cannot be tabbed
        // to or clicked before the reveal has finished.
        style={{ pointerEvents: revealed ? "auto" : "none" }}
        aria-hidden={!revealed}
      >
        <div className="result__buttons">
          <button
            type="button"
            className="btn btn-primary"
            onClick={onDownloadBoth}
            data-sound="success"
          >
            Download
          </button>
          <button
            type="button"
            className="btn result__share"
            onClick={onShareToX}
            data-sound="select"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path
                fill="currentColor"
                d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
              />
            </svg>
            Share on X
          </button>
        </div>
        <button type="button" className="result__reset" onClick={onReset} ref={resetRef}>
          Create Another
        </button>
      </motion.div>
    </motion.section>
  );
}
