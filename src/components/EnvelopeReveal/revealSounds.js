/**
 * Sound for the reveal, synthesised with the Web Audio API.
 *
 * Nothing is loaded from disk. Paper has no pitch — it is filtered noise with a
 * fast, slightly irregular envelope — so it synthesises convincingly and costs
 * nothing to ship. It also means the component stays a single drop-in folder
 * with no asset pipeline and no CSP problems when embedded.
 *
 * Browsers refuse to start audio before the user has interacted with the page.
 * Every method here is a no-op until that happens; `unlock()` is wired to the
 * first pointer or key event and resumes the context.
 */

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);

export function createRevealSounds({ volume = 0.5 } = {}) {
  let ctx = null;
  let master = null;
  let noise = null;
  let muted = false;
  let disposed = false;

  const AudioCtx =
    typeof window !== 'undefined' &&
    (window.AudioContext || window.webkitAudioContext);

  function ensure() {
    if (disposed || !AudioCtx) return null;
    if (!ctx) {
      ctx = new AudioCtx();
      master = ctx.createGain();
      master.gain.value = clamp01(volume);
      master.connect(ctx.destination);

      // One second of white noise, reused for every paper sound.
      const len = Math.floor(ctx.sampleRate);
      noise = ctx.createBuffer(1, len, ctx.sampleRate);
      const data = noise.getChannelData(0);
      for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    }
    return ctx;
  }

  /**
   * A sheet of paper moving. Noise through a bandpass whose centre frequency
   * sweeps, which is what gives the sense of something travelling rather than
   * a static hiss.
   */
  function paper({ duration, from, to, gain, q = 1.1, rasp = 0 }) {
    const c = ensure();
    if (!c) return;
    const t = c.currentTime;

    const src = c.createBufferSource();
    src.buffer = noise;
    src.loop = true;
    src.playbackRate.value = 0.85 + Math.random() * 0.3;

    const band = c.createBiquadFilter();
    band.type = 'bandpass';
    band.Q.value = q;
    band.frequency.setValueAtTime(from, t);
    band.frequency.exponentialRampToValueAtTime(to, t + duration);

    // Rolls off the fizzy top so it reads as paper, not static.
    const tame = c.createBiquadFilter();
    tame.type = 'lowpass';
    tame.frequency.value = 6200;

    const amp = c.createGain();
    amp.gain.setValueAtTime(0.0001, t);
    amp.gain.exponentialRampToValueAtTime(gain, t + duration * 0.18);
    // Slight mid-way dip: real paper catches and releases rather than sliding
    // at one constant volume.
    if (rasp > 0) {
      amp.gain.exponentialRampToValueAtTime(
        Math.max(gain * (1 - rasp), 0.0001),
        t + duration * 0.55,
      );
      amp.gain.exponentialRampToValueAtTime(gain * 0.85, t + duration * 0.72);
    }
    amp.gain.exponentialRampToValueAtTime(0.0001, t + duration);

    src.connect(band).connect(tame).connect(amp).connect(master);
    src.start(t);
    src.stop(t + duration + 0.05);
  }

  /** Low, soft landing for the envelope arriving. */
  function thud() {
    const c = ensure();
    if (!c) return;
    const t = c.currentTime;

    const osc = c.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, t);
    osc.frequency.exponentialRampToValueAtTime(58, t + 0.22);

    const amp = c.createGain();
    amp.gain.setValueAtTime(0.0001, t);
    amp.gain.exponentialRampToValueAtTime(0.5, t + 0.012);
    amp.gain.exponentialRampToValueAtTime(0.0001, t + 0.34);

    osc.connect(amp).connect(master);
    osc.start(t);
    osc.stop(t + 0.36);

    // A little body so it lands on a surface rather than in a vacuum.
    paper({ duration: 0.16, from: 900, to: 260, gain: 0.10 });
  }

  /** Soft two-note chime as the badge settles in. */
  function chime() {
    const c = ensure();
    if (!c) return;
    const t = c.currentTime;
    [
      { f: 784, d: 0, g: 0.16 },
      { f: 1175, d: 0.075, g: 0.11 },
      { f: 1568, d: 0.15, g: 0.06 },
    ].forEach(({ f, d, g }) => {
      const osc = c.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = f;
      const amp = c.createGain();
      amp.gain.setValueAtTime(0.0001, t + d);
      amp.gain.exponentialRampToValueAtTime(g, t + d + 0.03);
      amp.gain.exponentialRampToValueAtTime(0.0001, t + d + 1.1);
      osc.connect(amp).connect(master);
      osc.start(t + d);
      osc.stop(t + d + 1.15);
    });
  }

  const cues = {
    // Envelope arrives and settles.
    entrance: () => thud(),
    // Flap unpeeling and swinging up — rises in pitch as it opens out.
    opening: () => paper({ duration: 0.72, from: 480, to: 2400, gain: 0.30, q: 0.9, rasp: 0.45 }),
    // Card drawn out of the envelope: a long, even slide against paper.
    card: () => paper({ duration: 1.35, from: 2600, to: 700, gain: 0.24, q: 1.4, rasp: 0.3 }),
    // Card settling forward.
    focus: () => paper({ duration: 0.28, from: 1400, to: 420, gain: 0.12, q: 1.2 }),
    pfp: () => chime(),
  };

  return {
    /** Resume the context. Safe to call repeatedly. */
    unlock() {
      const c = ensure();
      if (c && c.state === 'suspended') c.resume().catch(() => {});
    },
    play(cue) {
      if (muted || disposed) return;
      const fn = cues[cue];
      if (!fn) return;
      const c = ensure();
      // Still locked by the autoplay policy — skip rather than queue, so cues
      // never fire late and out of sync with the animation.
      if (!c || c.state !== 'running') return;
      try {
        fn();
      } catch {
        /* audio is a nicety; never let it break the reveal */
      }
    },
    setMuted(v) {
      muted = !!v;
    },
    setVolume(v) {
      if (master) master.gain.value = clamp01(v);
    },
    dispose() {
      disposed = true;
      if (ctx) ctx.close().catch(() => {});
      ctx = null;
      master = null;
      noise = null;
    },
  };
}
