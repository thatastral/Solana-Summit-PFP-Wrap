import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

/**
 * Ordered stages of the reveal. Every animated layer reads the current stage
 * and picks the matching variant, so the whole composition stays in sync from
 * one piece of state.
 */
export const STAGES = [
  'idle', // envelope not yet present
  'entrance', // stage 1 — envelope arrives and settles
  'opening', // stage 2 — flap rotates up on its hinge
  'card', // stage 3 — card slides out of the pocket
  'focus', // stage 4 — card moves forward and scales
  'pfp', // stage 5 — wrapped PFP swings in from the side
  'complete', // settled; onComplete has fired
];

/** Default beat lengths in ms. Each value is how long that stage runs for. */
export const DEFAULT_TIMINGS = {
  entrance: 1900,
  opening: 1250,
  card: 1500,
  focus: 800,
  pfp: 1050,
};

const stageIndex = (stage) => STAGES.indexOf(stage);

/**
 * Drives the reveal timeline.
 *
 * Returns the current stage plus `atLeast`, a helper that answers "have we
 * reached this stage yet?" — which is how layers decide between their
 * before/after variants without a chain of comparisons at every call site.
 */
export function useRevealSequence({
  autoPlay = true,
  reducedMotion = false,
  speed = 1,
  timings,
  onStageChange,
  onComplete,
} = {}) {
  const [stage, setStage] = useState('idle');
  const timers = useRef([]);
  const raf = useRef(0);
  const runId = useRef(0);

  // Keep callbacks in refs so restarting the timeline never depends on the
  // identity of a parent's inline arrow function.
  const onStageChangeRef = useRef(onStageChange);
  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onStageChangeRef.current = onStageChange;
    onCompleteRef.current = onComplete;
  });

  const beats = useMemo(() => ({ ...DEFAULT_TIMINGS, ...timings }), [timings]);

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    if (raf.current) {
      cancelAnimationFrame(raf.current);
      raf.current = 0;
    }
  }, []);

  const goTo = useCallback((next) => {
    setStage(next);
    onStageChangeRef.current?.(next);
    if (next === 'complete') onCompleteRef.current?.();
  }, []);

  const play = useCallback(() => {
    clearTimers();
    const id = ++runId.current;

    // Reduced motion: honour the user's preference by presenting the finished
    // composition immediately rather than animating through it.
    if (reducedMotion) {
      goTo('complete');
      return;
    }

    goTo('idle');

    // Build the schedule as cumulative offsets so retimings stay local.
    let at = 0;
    const schedule = [];
    for (const name of ['entrance', 'opening', 'card', 'focus', 'pfp']) {
      schedule.push({ stage: name, at });
      at += beats[name] / (speed || 1);
    }
    schedule.push({ stage: 'complete', at });

    schedule.forEach(({ stage: s, at: delay }) => {
      timers.current.push(
        setTimeout(() => {
          if (runId.current !== id) return; // a newer run superseded this one
          goTo(s);
        }, delay),
      );
    });
  }, [beats, clearTimers, goTo, reducedMotion, speed]);

  const replay = useCallback(() => {
    // Snap back to idle for a frame so springs restart from their initial
    // values instead of easing out of wherever they currently sit.
    clearTimers();
    runId.current++;
    setStage('idle');
    raf.current = requestAnimationFrame(() => {
      raf.current = requestAnimationFrame(play);
    });
  }, [clearTimers, play]);

  useEffect(() => {
    if (autoPlay) play();
    return clearTimers;
  }, [autoPlay, play, clearTimers]);

  const atLeast = useCallback(
    (target) => stageIndex(stage) >= stageIndex(target),
    [stage],
  );

  return { stage, atLeast, play, replay, isComplete: stage === 'complete' };
}

/** Tracks the `prefers-reduced-motion` media query. */
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = (e) => setReduced(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return reduced;
}
