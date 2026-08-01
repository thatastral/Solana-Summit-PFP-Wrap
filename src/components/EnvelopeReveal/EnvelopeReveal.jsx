import {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
// This project already ships `motion` (the current release of framer-motion);
// `motion/react` exposes the identical API, so this is the same library rather
// than a second copy of it.
import {
  animate,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from 'motion/react';

import flapOutside from './assets/envelope-flap-outside.png';
import envelopeFront from './assets/envelope-front.png';
import openEnvelope from './assets/envelope-open.png';
import sealedEnvelope from './assets/envelope-sealed.png';
import {
  BACK_RECT,
  CARD_CLIP_RECT,
  CARD_RECT,
  CARD_SEATED_OFFSET,
  FLAP_RECT,
  FLAP_SQUASH,
  OPEN_W,
  PFP_RECT,
  POCKET_RECT,
  SCENE_H,
  SCENE_W,
  SEALED_RECT,
  TOP_RADIUS,
} from './envelopeGeometry';
import { createRevealSounds } from './revealSounds';
import { usePrefersReducedMotion, useRevealSequence } from './useRevealSequence';
import './EnvelopeReveal.css';

// ---------------------------------------------------------------------------
// Motion vocabulary
// ---------------------------------------------------------------------------

/** Heavy, settled arrival. Low bounce so the envelope reads as having weight. */
const ARRIVAL_SPRING = { type: 'spring', stiffness: 105, damping: 16, mass: 1.2 };

/** Paper: light, quick to settle, almost no overshoot. */
const PAPER_SPRING = { type: 'spring', stiffness: 150, damping: 20, mass: 0.9 };

/** The badge gets a touch more life than the card. */
const BADGE_SPRING = { type: 'spring', stiffness: 190, damping: 16, mass: 0.8 };

/** Decelerating ease used where a spring would feel too loose. */
const GLIDE = { duration: 0.8, ease: [0.16, 1, 0.3, 1] };

// ---------------------------------------------------------------------------
// Layer variants — every layer keys off the same stage name
// ---------------------------------------------------------------------------

// `transformPerspective` is set per-element rather than via a `perspective`
// property on an ancestor: several of these layers need `overflow: hidden` to
// clip the artwork, and that would flatten an inherited 3D context.
/**
 * The arrival.
 *
 * The envelope is thrown in from far behind the viewer and low, spinning as
 * it comes: it flips a full turn on Z, tumbles forward through 200deg on X,
 * and swings past its mark on both axes before rocking back to square. It
 * overshoots its size too, blowing up slightly larger than final before
 * settling — the whole thing reads as something hurled into frame and caught,
 * rather than placed.
 *
 * Each axis runs on its own keyframe track with its own timing, so no two
 * settle on the same frame; that stagger is what stops a multi-axis move from
 * looking mechanical.
 */
const envelopeVariants = {
  idle: {
    opacity: 0,
    scale: 0.18,
    y: 360,
    x: -180,
    rotateX: 78,
    rotateY: -38,
    rotateZ: -190,
    transformPerspective: 1200,
  },
  entrance: {
    opacity: [0, 1, 1, 1],
    scale: [0.18, 0.92, 1.09, 1],
    y: [360, -34, 14, 0],
    x: [-180, 18, -6, 0],
    rotateX: [78, -14, 6, 0],
    rotateY: [-38, 10, -4, 0],
    rotateZ: [-190, 12, -5, 0],
    transformPerspective: 1200,
    transition: {
      opacity: { duration: 0.5, times: [0, 0.35, 0.6, 1], ease: 'easeOut' },
      // The travel arrives first and hardest.
      y: { duration: 1.35, times: [0, 0.52, 0.78, 1], ease: [0.16, 1, 0.3, 1] },
      x: { duration: 1.4, times: [0, 0.52, 0.8, 1], ease: [0.16, 1, 0.3, 1] },
      scale: { duration: 1.45, times: [0, 0.5, 0.76, 1], ease: [0.16, 1, 0.3, 1] },
      // The spin runs longer than the travel, so it is still resolving as the
      // envelope reaches its mark -- that overlap is the whole effect.
      rotateZ: { duration: 1.75, times: [0, 0.58, 0.82, 1], ease: [0.16, 1, 0.3, 1] },
      rotateX: { duration: 1.65, times: [0, 0.56, 0.82, 1], ease: [0.16, 1, 0.3, 1] },
      rotateY: { duration: 1.85, times: [0, 0.56, 0.82, 1], ease: [0.16, 1, 0.3, 1] },
    },
  },
};

/**
 * The card's seated pose, held through every stage before it rises. It is
 * already sitting in the envelope at this point — the shut flap is what hides
 * it, not a hiding place below the pocket — so when the flap lifts, the card is
 * revealed in place rather than appearing from nowhere.
 */
const cardSeated = {
  y: CARD_SEATED_OFFSET,
  scale: 1,
  rotate: 0,
  rotateX: 0,
  transformPerspective: 1200,
};

/*
  Held at zero opacity until the flap starts to lift. Geometrically the card
  is already covered while the envelope is sealed, but the entrance spins the
  whole group in 3D and a sub-pixel edge can catch the light at some angles.
  The switch happens on the first frame of `opening`, when the flap is still
  fully shut, so it is never seen turning on.
*/
const cardVariants = {
  idle: { ...cardSeated, opacity: 0 },
  entrance: { ...cardSeated, opacity: 0 },
  opening: { ...cardSeated, opacity: 1, transition: { opacity: { duration: 0 } } },
  card: {
    y: 0,
    opacity: 1,
    scale: 1,
    transformPerspective: 1200,
    rotate: 0,
    rotateX: 0,
    // A single unhurried glide, no spring overshoot and no wobble. The card is
    // being drawn out of the envelope, and the eye should be reading the design
    // as it clears the pocket.
    transition: {
      y: { duration: 1.5, ease: [0.22, 0.61, 0.24, 1] },
    },
  },
  focus: {
    y: -18,
    opacity: 1,
    scale: 1.06,
    rotate: 0,
    rotateX: 6,
    transformPerspective: 1200,
    transition: PAPER_SPRING,
  },
};

const pfpVariants = {
  idle: { opacity: 0, scale: 0.55, x: -120, y: 20, rotate: -18 },
  pfp: {
    opacity: 1,
    scale: 1,
    x: 0,
    y: 0,
    rotate: 0,
    transition: { ...BADGE_SPRING, opacity: { duration: 0.35, ease: 'easeOut' } },
  },
};

const captionVariants = {
  idle: { opacity: 0, y: 18 },
  pfp: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

// ---------------------------------------------------------------------------

/**
 * EnvelopeReveal
 *
 * A self-contained reveal animation. It owns only the envelope artwork, the
 * layering and the motion — the attendee card and wrapped PFP are supplied by
 * the host application and are never hardcoded.
 *
 * The composition is laid out as a fixed SCENE_W x SCENE_H pixel scene and then
 * scaled with a single transform to fit whatever box it is dropped into. That
 * keeps the measured artwork coordinates exact at every screen size and means
 * responsiveness costs one composited transform rather than a reflow.
 */
const EnvelopeReveal = forwardRef(function EnvelopeReveal(
  {
    attendeeCard,
    wrappedPFP,
    userName,
    userRole,
    autoPlay = true,
    onComplete,
    onStageChange,
    background,
    speed = 1,
    timings,
    // Off by default: the composition reads as a finished object, and a name
    // and role floating over it turns it back into a UI screen.
    showCaption = false,
    showReplayButton = false,
    parallax = true,
    cardRestOffset = 0,
    // Audio is built and working but off for now. Pass `sound` to switch it
    // back on; nothing else needs changing.
    sound = false,
    volume = 0.5,
    className = '',
    style,
    cardAlt = 'Your Solana Summit attendee card',
    pfpAlt = 'Your wrapped Solana Summit profile picture',
    ...rest
  },
  ref,
) {
  const reducedMotion = usePrefersReducedMotion();

  // -- Sound ----------------------------------------------------------------
  // Synthesised, so there is nothing to load. Created lazily and torn down with
  // the component; every call is a no-op until the browser's autoplay policy
  // lets audio start, which `unlock` handles on the first interaction.
  const soundsRef = useRef(null);
  if (sound && !soundsRef.current && typeof window !== 'undefined') {
    soundsRef.current = createRevealSounds({ volume });
  }
  useEffect(() => {
    soundsRef.current?.setMuted(!sound);
  }, [sound]);
  useEffect(() => {
    soundsRef.current?.setVolume(volume);
  }, [volume]);
  useEffect(() => () => soundsRef.current?.dispose(), []);

  useEffect(() => {
    if (!sound) return undefined;
    const unlock = () => soundsRef.current?.unlock();
    // Capture phase so it fires even if something inside stops propagation.
    window.addEventListener('pointerdown', unlock, { capture: true });
    window.addEventListener('keydown', unlock, { capture: true });
    unlock();
    return () => {
      window.removeEventListener('pointerdown', unlock, { capture: true });
      window.removeEventListener('keydown', unlock, { capture: true });
    };
  }, [sound]);

  const handleStageChange = useCallback(
    (next) => {
      soundsRef.current?.play(next);
      onStageChange?.(next);
    },
    [onStageChange],
  );

  const { stage, atLeast, replay, isComplete } = useRevealSequence({
    autoPlay,
    reducedMotion,
    speed,
    timings,
    onStageChange: handleStageChange,
    onComplete,
  });

  const wrapRef = useRef(null);
  const sceneRef = useRef(null);

  useImperativeHandle(ref, () => ({ replay, stage, isComplete }), [
    replay,
    stage,
    isComplete,
  ]);

  // -- Responsive scale ------------------------------------------------------
  // One transform on the scene root, recomputed only when the box resizes.

  const [scale, setScale] = useState(1);
  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return undefined;
    const fit = () => {
      const { width, height } = el.getBoundingClientRect();
      if (!width || !height) return;
      setScale(Math.min(width / SCENE_W, height / SCENE_H));
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // -- Flap rotation ---------------------------------------------------------
  // Driven by a motion value rather than a variant, because two other things
  // are derived from the live angle: the shading of the inner face, and the
  // flap's stacking order. Past 90deg the flap is physically in front of the
  // pocket; below it, it has fallen behind the card.

  /**
   * The flap swings from -180deg (shut) to 0deg (open).
   *
   * The sign matters. CSS rotateX drives the top edge *away* from the viewer,
   * so sweeping 180 -> 0 would carry the flap through the space behind the
   * envelope — it reads as something flipping up from around the back. Going
   * -180 -> 0 arrives at the same shut and open poses but takes the flap
   * through the space in front, which is how a real flap is lifted.
   */
  const flapAngle = useMotionValue(-180);
  /** 180 when shut, 0 when open. Every derived value keys off this. */
  const flapTilt = useTransform(flapAngle, (deg) => Math.abs(deg));

  const flapZ = useTransform(flapTilt, (t) => (t > 90 ? 6 : 1));
  // Shading is a scrim over the lining, not opacity on the flap itself —
  // a translucent flap would let the pocket show straight through it.
  const flapShade = useTransform(flapTilt, [0, 90, 180], [0, 0.24, 0.06]);
  /**
   * The sealed artwork, cross-faded out early in the swing. By 150deg the flap
   * still covers most of it, so the handover from the sealed illustration to
   * the layered open construction happens behind the flap.
   */
  const sealedOpacity = useTransform(flapTilt, [150, 180], [0, 1]);
  /**
   * Foreshortening. Shut, the flap is compressed so its apex lands exactly on
   * the pocket's V notch, which hides the pocket's upper diagonals behind the
   * flap's own edges — one clean chevron rather than two crossing sets. Open,
   * it returns to the artwork's true length.
   */
  const flapSquash = useTransform(flapTilt, [90, 180], [1, FLAP_SQUASH]);
  /**
   * While the flap is down its rounded base is the envelope's top edge, so the
   * back panel has to round off by the same amount or its square corners show
   * through. Once the flap lifts, the join is a straight full-width edge again.
   */
  const bodyRadius = useTransform(flapTilt, [90, 180], [0, TOP_RADIUS]);
  // The envelope never translates. It holds its position through the whole
  // sequence; only the flap turns and the card travels.

  const flapOpen = atLeast('opening');
  useEffect(() => {
    if (reducedMotion) {
      flapAngle.set(flapOpen ? 0 : -180);
      return undefined;
    }
    if (!flapOpen) {
      flapAngle.set(-180);
      return undefined;
    }
    // Overshoot a few degrees past open, then settle back — a real flap
    // swings past the fold before gravity catches it.
    const controls = animate(flapAngle, [-180, 9, 0], {
      // Scaled by `speed` like every other beat — the flap is driven by its own
      // motion value rather than a variant, so it doesn't inherit it.
      duration: 1.15 / (speed || 1),
      // Per-segment easing. The lift eases in and out — a flap has mass, so it
      // neither starts nor stops abruptly — then the small overshoot settles
      // back on a gentle decelerating curve.
      ease: [
        [0.45, 0.05, 0.25, 1],
        [0.33, 1, 0.68, 1],
      ],
      times: [0, 0.74, 1],
    });
    return () => controls.stop();
  }, [flapOpen, flapAngle, reducedMotion, speed]);

  // -- Pointer parallax ------------------------------------------------------
  // Motion values only — the pointer never triggers a React render.

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const tiltX = useSpring(pointerY, { stiffness: 90, damping: 20, mass: 0.6 });
  const tiltY = useSpring(pointerX, { stiffness: 90, damping: 20, mass: 0.6 });
  const sceneRotateX = useTransform(tiltX, [-0.5, 0.5], [5, -5]);
  const sceneRotateY = useTransform(tiltY, [-0.5, 0.5], [-7, 7]);
  // Foreground layers shift a little more than the envelope body.
  const cardDrift = useTransform(tiltY, [-0.5, 0.5], [-14, 14]);
  const pfpDrift = useTransform(tiltY, [-0.5, 0.5], [-22, 22]);

  const parallaxActive = parallax && !reducedMotion;

  const handlePointerMove = useCallback(
    (e) => {
      if (!parallaxActive) return;
      const el = wrapRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      pointerX.set((e.clientX - r.left) / r.width - 0.5);
      pointerY.set((e.clientY - r.top) / r.height - 0.5);
    },
    [parallaxActive, pointerX, pointerY],
  );

  const handlePointerLeave = useCallback(() => {
    pointerX.set(0);
    pointerY.set(0);
  }, [pointerX, pointerY]);

  // -- Derived flags ---------------------------------------------------------

  const envelopeStage = atLeast('entrance') ? 'entrance' : 'idle';
  // Falls back to `entrance` rather than `opening` before the flap moves, so
  // the card's hidden pose actually applies while the envelope is sealed.
  const cardStage = atLeast('focus')
    ? 'focus'
    : atLeast('card')
      ? 'card'
      : atLeast('opening')
        ? 'opening'
        : 'entrance';
  const pfpStage = atLeast('pfp') ? 'pfp' : 'idle';
  const settled = atLeast('focus');

  /**
   * `background` accepts either an image URL or any CSS background shorthand
   * (a gradient, a colour), so a host app can pass the campaign's background
   * PNG straight through without wrapping it in `url()`.
   */
  const backgroundStyle = useMemo(() => {
    if (!background) return undefined;
    const isCss = /^(url\(|linear-gradient|radial-gradient|conic-gradient|#|rgb|hsl|var\()/i.test(
      background.trim(),
    );
    return { background: isCss ? background : `url("${background}") center / cover no-repeat` };
  }, [background]);

  const hasCaption = showCaption && (userName || userRole);

  return (
    <div
      ref={wrapRef}
      className={`envr-root ${className}`.trim()}
      style={{ ...backgroundStyle, ...style }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      data-stage={stage}
      {...rest}
    >
      {/* Fixed-size scene, scaled as one unit to fit the container. */}
      <div
        className="envr-fit"
        style={{ width: SCENE_W, height: SCENE_H, transform: `scale(${scale})` }}
      >
        <motion.div
          ref={sceneRef}
          className="envr-scene"
          style={
            parallaxActive
              ? { rotateX: sceneRotateX, rotateY: sceneRotateY }
              : undefined
          }
        >
          {/* Ambient green glow sitting behind the whole composition. */}
          <motion.div
            className="envr-ambient"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: atLeast('entrance') ? (settled ? 0.85 : 0.6) : 0,
              scale: atLeast('entrance') ? 1 : 0.8,
            }}
            transition={GLIDE}
          />

          {/* Envelope group: entrance, idle float and everything anchored to it. */}
          <motion.div
            className="envr-envelope"
            variants={envelopeVariants}
            initial="idle"
            animate={envelopeStage}
          >
            <div className="envr-settle">
            {/* The envelope holds still. No idle drift — any vertical movement
                here reads as the envelope sinking while the card is drawn out. */}
            <div className="envr-float">
              {/* 1. Back panel — the backdrop the card emerges against. */}
              <motion.div
                className="envr-layer envr-back"
                style={{
                  left: BACK_RECT.left,
                  top: BACK_RECT.top,
                  width: BACK_RECT.width,
                  height: BACK_RECT.height,
                  borderTopLeftRadius: bodyRadius,
                  borderTopRightRadius: bodyRadius,
                }}
              >
                <img
                  src={openEnvelope}
                  alt=""
                  aria-hidden="true"
                  draggable="false"
                  decoding="async"
                  style={{ width: OPEN_W, marginTop: BACK_RECT.imgTop }}
                />
              </motion.div>

              {/* 2. The card, clipped to the envelope frame so it can never
                  spill out of the bottom no matter what aspect ratio the host
                  application hands us. */}
              <div
                className="envr-layer envr-card-clip"
                style={{
                  left: CARD_CLIP_RECT.left,
                  top: CARD_CLIP_RECT.top,
                  width: CARD_CLIP_RECT.width,
                  height: CARD_CLIP_RECT.height,
                }}
              >
                <motion.div
                  className="envr-card"
                  style={{
                    left: CARD_RECT.left,
                    // How much of the card clears the pocket depends on the
                    // aspect ratio of whatever the host generated, so the
                    // resting height is tunable.
                    top: CARD_RECT.top + cardRestOffset,
                    width: CARD_RECT.width,
                    x: parallaxActive ? cardDrift : 0,
                  }}
                  variants={cardVariants}
                  initial="idle"
                  animate={cardStage}
                >
                  {attendeeCard ? (
                    <img
                      className="envr-card-img"
                      src={attendeeCard}
                      alt={cardAlt}
                      draggable="false"
                      decoding="async"
                    />
                  ) : (
                    <div className="envr-card-placeholder" role="presentation" />
                  )}
                  {/* Sheen that sweeps the card as it comes to rest. */}
                  <motion.div
                    className="envr-card-sheen"
                    initial={{ opacity: 0, x: '-120%' }}
                    animate={
                      settled && !reducedMotion
                        ? { opacity: [0, 0.5, 0], x: ['-120%', '120%'] }
                        : { opacity: 0 }
                    }
                    transition={{ duration: 1.1, ease: 'easeInOut', delay: 0.15 }}
                  />
                </motion.div>
              </div>

              {/* 3. Envelope front — drawn over the card. Its upper triangle is
                  transparent, so the card shows through the envelope's opening
                  and is occluded by the real V of the folded flaps rather than
                  by a straight rectangular edge. */}
              <div
                className="envr-layer envr-pocket"
                style={{
                  left: POCKET_RECT.left,
                  top: POCKET_RECT.top,
                  width: POCKET_RECT.width,
                  height: POCKET_RECT.height,
                }}
              >
                <img
                  src={envelopeFront}
                  alt=""
                  aria-hidden="true"
                  draggable="false"
                  decoding="async"
                  style={{ width: POCKET_RECT.width }}
                />
              </div>

              {/* 3b. The sealed envelope, exactly as drawn. While the flap is
                  down this covers the whole open construction, so the closed
                  state is the artwork itself — no seam and no gap, because the
                  rotating flap above is resting on its own pixels. */}
              <motion.div
                className="envr-layer envr-sealed"
                style={{
                  left: SEALED_RECT.left,
                  top: SEALED_RECT.top,
                  width: SEALED_RECT.width,
                  height: SEALED_RECT.height,
                  opacity: sealedOpacity,
                }}
              >
                <img
                  src={sealedEnvelope}
                  alt=""
                  aria-hidden="true"
                  draggable="false"
                  decoding="async"
                  style={{ width: SEALED_RECT.width, height: SEALED_RECT.height }}
                />
              </motion.div>

              {/* 4. The flap: one element with two faces, rotating on the fold.
                  Not a cross-fade between the two PNGs — the closed artwork is
                  the outside of the flap and the open artwork is its lining. */}
              <motion.div
                className="envr-layer envr-flap"
                style={{
                  left: FLAP_RECT.left,
                  top: FLAP_RECT.top,
                  width: FLAP_RECT.width,
                  height: FLAP_RECT.height,
                  rotateX: flapAngle,
                  scaleY: flapSquash,
                  transformPerspective: 1400,
                  zIndex: flapZ,
                }}
              >
                <div className="envr-flap-face envr-flap-inside">
                  <img
                    src={openEnvelope}
                    alt=""
                    aria-hidden="true"
                    draggable="false"
                    decoding="async"
                    style={{ width: OPEN_W, marginTop: FLAP_RECT.insideImgTop }}
                  />
                  <motion.div
                    className="envr-flap-shade"
                    style={{ opacity: flapShade }}
                  />
                </div>
                <div className="envr-flap-face envr-flap-outside">
                  <img
                    src={flapOutside}
                    alt=""
                    aria-hidden="true"
                    draggable="false"
                    decoding="async"
                    style={{
                      width: FLAP_RECT.width,
                      marginTop: FLAP_RECT.outsideImgTop,
                    }}
                  />
                </div>
              </motion.div>
            </div>
            </div>
          </motion.div>

          {/* 5. Wrapped PFP badge. Anchored to the scene rather than the
              envelope so the envelope's idle float doesn't drag it around. */}
          <motion.div
            className="envr-pfp-anchor"
            style={{
              left: PFP_RECT.left,
              top: PFP_RECT.top,
              width: PFP_RECT.size,
              height: PFP_RECT.size,
              x: parallaxActive ? pfpDrift : 0,
            }}
            variants={pfpVariants}
            initial="idle"
            animate={pfpStage}
          >
            <motion.div
              className="envr-pfp-float"
              animate={
                reducedMotion || !atLeast('pfp')
                  ? { y: 0 }
                  : { y: [0, -12, 0], rotate: [0, -1.6, 0] }
              }
              transition={{
                duration: 5.5,
                ease: 'easeInOut',
                repeat: Infinity,
                delay: 0.4,
              }}
            >
              <motion.div
                className="envr-pfp-glow"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={
                  atLeast('pfp')
                    ? { opacity: [0, 1, 0.6], scale: [0.6, 1.18, 1] }
                    : { opacity: 0, scale: 0.6 }
                }
                transition={{ duration: 1.2, ease: 'easeOut', times: [0, 0.45, 1] }}
              />
              {wrappedPFP ? (
                <img
                  className="envr-pfp-img"
                  src={wrappedPFP}
                  alt={pfpAlt}
                  draggable="false"
                  decoding="async"
                />
              ) : (
                <div className="envr-pfp-placeholder" role="presentation" />
              )}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {hasCaption && (
        <motion.div
          className="envr-caption"
          variants={captionVariants}
          initial="idle"
          animate={pfpStage}
        >
          {userName && <span className="envr-caption-name">{userName}</span>}
          {userRole && <span className="envr-caption-role">{userRole}</span>}
        </motion.div>
      )}

      {showReplayButton && (
        <button type="button" className="envr-replay" onClick={replay}>
          Replay
        </button>
      )}

      {/* Announce the outcome once, rather than narrating each stage. */}
      <span className="envr-sr-only" role="status" aria-live="polite">
        {isComplete
          ? `Reveal complete. ${userName ? `${userName}'s ` : 'Your '}Solana Summit Nigeria card and profile picture are ready.`
          : ''}
      </span>
    </div>
  );
});

export default memo(EnvelopeReveal);
