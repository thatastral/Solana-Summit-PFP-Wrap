import { motion } from "motion/react";
import { useCountdown } from "../hooks/useCountdown";
import { EVENT_DATE } from "../config";
import iconClock from "../assets/2026/icon-clock.svg";
import iconUsers from "../assets/2026/icon-user.svg";
import "./Hero.css";

interface HeroProps {
  attendeeCount: number;
  recentAvatars: string[];
  onUploadClick: () => void;
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export function Hero({ attendeeCount, recentAvatars, onUploadClick }: HeroProps) {
  const { days, hours, minutes, seconds } = useCountdown(EVENT_DATE);

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
          {days > 0 && <span>{pad(days)}d :</span>}
          <span>{pad(hours)}h : {pad(minutes)}m : {pad(seconds)}s</span>
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
        Create Your Official
        <br />
        Summit Identity
      </motion.h1>

      <motion.p
        className="hero__subtitle"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1], delay: 0.4 }}
      >
        Upload your photo to create your official Summit PFP and "I'm
        Attending" card.
      </motion.p>

      <motion.button
        type="button"
        className="btn btn-primary hero__cta"
        onClick={onUploadClick}
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
          {(recentAvatars.length > 0
            ? recentAvatars.slice(0, 5)
            : Array.from({ length: 5 })
          ).map((src, i) => (
            <span key={i} className="hero__avatar" style={{ zIndex: 5 - i }}>
              {typeof src === "string" ? <img src={src} alt="" /> : null}
            </span>
          ))}
        </div>
        <p>
          Builders Joining
          <br />
          the Summit
        </p>
      </motion.div>
    </section>
  );
}
