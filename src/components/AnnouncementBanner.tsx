import { motion } from "motion/react";
import { REGISTER_URL } from "../config";
import "./AnnouncementBanner.css";

export function AnnouncementBanner() {
  return (
    <motion.header
      className="announcement"
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1], delay: 0.1 }}
    >
      <span className="announcement__cap" aria-hidden="true" />
      <div className="announcement__pill">
        <p>Join Africa's biggest Solana gathering</p>
        <a
          className="announcement__register"
          href={REGISTER_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          Register
        </a>
      </div>
      <span className="announcement__cap" aria-hidden="true" />
    </motion.header>
  );
}
