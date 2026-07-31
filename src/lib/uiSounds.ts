/**
 * Interface sound design.
 *
 * Synthesised with the Web Audio API rather than loaded as files: every cue is
 * a few oscillators and an envelope, so there is nothing to download, nothing
 * to cache, and the timbres can be tuned in code.
 *
 * Deliberately independent of the background music. Muting the music silences
 * the track only -- the interface keeps its clicks, because they are feedback
 * rather than ambience.
 */

type Cue = "tap" | "select" | "open" | "celebrate" | "success" | "back";

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let enabled = true;

function audio(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const Ctor = window.AudioContext ?? (window as any).webkitAudioContext;
    if (!Ctor) return null;
    ctx = new Ctor();
    master = ctx.createGain();
    // Sits just above the music bed so clicks read clearly without snapping.
    master.gain.value = 0.32;
    master.connect(ctx.destination);
  }
  return ctx;
}

/** Browsers start the context suspended until a real gesture occurs. */
export function unlockUiSounds() {
  const ac = audio();
  if (ac && ac.state === "suspended") void ac.resume();
}

export function setUiSoundsEnabled(next: boolean) {
  enabled = next;
}

interface ToneSpec {
  freq: number;
  /** Frequency at the end of the glide, if it should bend. */
  toFreq?: number;
  type?: OscillatorType;
  duration: number;
  gain: number;
  delay?: number;
}

function tone({ freq, toFreq, type = "sine", duration, gain, delay = 0 }: ToneSpec) {
  const ac = audio();
  if (!ac || !master) return;

  const t0 = ac.currentTime + delay;
  const osc = ac.createOscillator();
  const env = ac.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (toFreq) osc.frequency.exponentialRampToValueAtTime(toFreq, t0 + duration);

  // Very short attack, exponential decay -- a click with no audible click.
  env.gain.setValueAtTime(0.0001, t0);
  env.gain.exponentialRampToValueAtTime(gain, t0 + 0.008);
  env.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);

  osc.connect(env);
  env.connect(master);
  osc.start(t0);
  osc.stop(t0 + duration + 0.02);
}

/** Plays one of the interface cues. Safe to call before any gesture. */
export function playUiSound(cue: Cue) {
  if (!enabled) return;
  const ac = audio();
  if (!ac || ac.state === "suspended") return;

  switch (cue) {
    // Soft muted tap for ordinary presses.
    case "tap":
      tone({ freq: 520, toFreq: 380, type: "sine", duration: 0.075, gain: 0.16 });
      break;

    // Slightly brighter, for a committing action.
    case "select":
      tone({ freq: 620, toFreq: 480, type: "triangle", duration: 0.085, gain: 0.16 });
      tone({ freq: 930, type: "sine", duration: 0.06, gain: 0.05, delay: 0.02 });
      break;

    // Airy rise as the envelope lifts.
    case "open":
      tone({ freq: 300, toFreq: 720, type: "sine", duration: 0.42, gain: 0.11 });
      tone({ freq: 600, toFreq: 1180, type: "sine", duration: 0.36, gain: 0.05, delay: 0.05 });
      break;

    /*
      The card clearing the envelope -- the high point of the flow, so this
      is the one properly musical cue. A major-triad arpeggio (C-E-G-C)
      rolled out over the slide, with a soft shimmer an octave up trailing
      it, so the sound rises alongside the card rather than landing as a
      single hit.
    */
    case "celebrate": {
      const roll = [523.25, 659.25, 783.99, 1046.5];
      roll.forEach((freq, i) => {
        tone({ freq, type: "triangle", duration: 0.55, gain: 0.1, delay: i * 0.1 });
        tone({ freq: freq * 2, type: "sine", duration: 0.4, gain: 0.028, delay: i * 0.1 + 0.02 });
      });
      // Low swell underneath, giving the roll some body.
      tone({ freq: 130.81, toFreq: 261.63, type: "sine", duration: 0.9, gain: 0.06, delay: 0.04 });
      break;
    }

    // Two-note lift on completion.
    case "success":
      tone({ freq: 660, type: "sine", duration: 0.22, gain: 0.13 });
      tone({ freq: 880, type: "sine", duration: 0.3, gain: 0.12, delay: 0.11 });
      tone({ freq: 1320, type: "sine", duration: 0.26, gain: 0.05, delay: 0.13 });
      break;

    // Lower, downward -- the inverse of `tap`.
    case "back":
      tone({ freq: 400, toFreq: 280, type: "sine", duration: 0.09, gain: 0.13 });
      break;
  }
}
