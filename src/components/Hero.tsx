import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useCountdown } from "../hooks/useCountdown";
import { EVENT_DATE } from "../config";
import iconClock from "../assets/2026/icon-clock.svg";
import iconUsers from "../assets/2026/icon-user.svg";
import "./Hero.css";

/** Slots held open until real generated PFPs come back from the feed. */
const SLOT_COUNT = 5;

interface HeroProps {
  attendeeCount: number;
  recentAvatars: string[];
  onUploadClick: () => void;
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

/**
 * Walks a highlight along the faces strip on touch devices, where there is no
 * hover to reveal the colour. Desktop keeps hover and never starts the timer.
 */
function useTravellingHighlight(count: number) {
  const [active, setActive] = useState(-1);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return undefined;
    const touch = window.matchMedia("(hover: none)");
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!touch.matches || still.matches || count < 1) return undefined;

    setActive(0);
    const timer = setInterval(() => {
      setActive((i) => (i + 1) % count);
    }, 1100);
    return () => clearInterval(timer);
  }, [count]);

  return active;
}

export function Hero({ attendeeCount, recentAvatars, onUploadClick }: HeroProps) {
  const { days, hours, minutes, seconds } = useCountdown(EVENT_DATE);
  const faces = recentAvatars.slice(0, SLOT_COUNT);
  // Empty slots fill in left to right as people generate.
  const slots: (string | null)[] = Array.from(
    { length: SLOT_COUNT },
    (_, i) => faces[i] ?? null,
  );
  // Only cycle the highlight across slots that actually hold a face.
  const activeFace = useTravellingHighlight(faces.length);

  return (
    <section className="hero">
      <motion.div
        className="hero__stats"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1], delay: 0.2 }}
      >
        <span className="hero__stat">
          <img src={iconClock} alt="" />
          <span>
            {days > 0 && `${pad(days)}d : `}
            {pad(hours)}h : {pad(minutes)}m : {pad(seconds)}s
          </span>
        </span>
        <span className="hero__divider" />
        <span className="hero__stat">
          <img src={iconUsers} alt="" />
          <span>{attendeeCount}</span>
        </span>
      </motion.div>

      <motion.h1
        className="hero__title"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1], delay: 0.3 }}
      >
        Create Your Official{" "}
        <br />
        Summit Identity
      </motion.h1>

      <motion.p
        className="hero__subtitle"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1], delay: 0.4 }}
      >
        Upload your photo to create your official{" "}
        <br />
        Summit PFP and "I'm Attending" card.
      </motion.p>

      <motion.button
        type="button"
        className="btn btn-primary hero__cta"
        onClick={onUploadClick}
        data-sound="select"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1], delay: 0.5 }}
      >
        Upload Photo
      </motion.button>

      <motion.div
        className="hero__preview"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1], delay: 0.6 }}
      >
        <div className="hero__avatars">
          {slots.map((src, i) => (
            <span
              key={i}
              className={`hero__avatar${src ? "" : " is-empty"}${
                src && i === activeFace ? " is-active" : ""
              }`}
            >
              {src ? <img src={src} alt="" loading="lazy" /> : null}
            </span>
          ))}
        </div>
        <p>
          The Faces of
          <br />
          Solana Summit Nigeria
        </p>
      </motion.div>
    </section>
  );
}
