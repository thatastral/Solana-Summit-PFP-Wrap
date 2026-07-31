import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import "./MusicToggle.css";

// Relative bar heights of the waveform glyph, mirrored around the centre.
const BARS = [0.42, 0.68, 1, 0.78, 0.5];

/**
 * Ambient background music with a waveform toggle. The bars animate while
 * audio is playing and settle flat, with a strike-through, when muted.
 *
 * Browsers block autoplay until the user interacts with the page, so the
 * first click/keypress anywhere starts playback; the control reflects
 * whatever actually happened rather than assuming success.
 */
interface MusicToggleProps {
  /** Keeps audio playing but takes the control off screen. */
  hidden?: boolean;
}

export function MusicToggle({ hidden = false }: MusicToggleProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const audio = new Audio("/summit-ambience.mp3");
    audio.loop = true;
    // Sits right down in the background: present, never competing with the
    // interface sounds, which are the feedback the user actually needs.
    audio.volume = 0.045;
    audio.preload = "auto";
    audioRef.current = audio;

    let cancelled = false;

    /*
      Getting audio going as early as the browser allows, in two steps.

      Autoplay *with sound* is gated on prior engagement with the site, so
      the unmuted attempt only succeeds for returning visitors. Muted
      autoplay is always permitted, so on refusal the track is started
      muted anyway -- it is already decoding and playing in the background.
      The first gesture then only has to flip `muted`, which is instant and
      cannot be refused, rather than kicking off playback from cold.
    */
    const GESTURES = ["pointerdown", "keydown", "touchend", "click"] as const;

    const removeListeners = () => {
      GESTURES.forEach((g) => document.removeEventListener(g, onFirstGesture));
    };

    function onFirstGesture() {
      if (cancelled) return removeListeners();
      audio.muted = false;
      if (audio.paused) void audio.play().catch(() => {});
      setPlaying(!audio.paused);
      removeListeners();
    }

    const start = async () => {
      try {
        audio.muted = false;
        await audio.play();
        if (!cancelled) setPlaying(true);
        return;
      } catch {
        /* falls through to the muted path */
      }

      try {
        audio.muted = true;
        await audio.play();
      } catch {
        /* nothing more to try until a gesture arrives */
      }

      if (cancelled) return;
      // Muted playback is silence as far as the user is concerned, so the
      // control reports muted rather than claiming to be playing.
      setPlaying(false);
      GESTURES.forEach((g) =>
        document.addEventListener(g, onFirstGesture, { passive: true }),
      );
    };

    void start();

    return () => {
      cancelled = true;
      removeListeners();
      audio.pause();
      audio.src = "";
    };
  }, []);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
      return;
    }
    // May be mid-muted-autoplay, so unmute as well as resume.
    audio.muted = false;
    if (audio.paused) {
      audio.play().then(
        () => setPlaying(true),
        () => setPlaying(false),
      );
    } else {
      setPlaying(true);
    }
  };

  if (hidden) return null;

  return (
    <motion.button
      type="button"
      className={`music-toggle${playing ? " is-playing" : " is-muted"}`}
      onClick={toggle}
      aria-pressed={playing}
      aria-label={playing ? "Mute background music" : "Play background music"}
      /* Arrives with the rest of the page rather than snapping in ahead of
         it -- same curve and roughly the same beat as the banner. */
      initial={{ opacity: 0, scale: 0.86, y: -8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1], delay: 0.35 }}
    >
      <span className="music-toggle__bars" aria-hidden="true">
        {BARS.map((scale, i) => (
          <motion.span
            key={i}
            className="music-toggle__bar"
            animate={
              playing && !reduceMotion
                ? { scaleY: [scale * 0.45, scale, scale * 0.55, scale * 0.9, scale * 0.45] }
                : { scaleY: scale * 0.5 }
            }
            transition={
              playing && !reduceMotion
                ? {
                    duration: 1.1 + i * 0.17,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.08,
                  }
                : { duration: 0.28, ease: [0.23, 1, 0.32, 1] }
            }
          />
        ))}
        <span className="music-toggle__slash" aria-hidden="true" />
      </span>
    </motion.button>
  );
}
