/**
 * Envelope geometry — measured directly from the source artwork.
 *
 * Every number here was derived by decoding the PNGs and analysing them, not
 * eyeballed. Keeping them in one place means the whole composition scales as a
 * single unit: the component renders a fixed-size pixel scene and applies one
 * `scale()` to fit its container, so these coordinates stay exact at any size.
 *
 * Source artwork
 * --------------
 *   envelope-open.png    788 x 932   flap raised
 *   envelope-closed.png  788 x 558   flap folded down
 *
 * Measurements (in the 788 x 932 "open" frame)
 * --------------------------------------------
 *   y = 15    first opaque row              -> flap apex
 *   y = 345   first full-width row          -> flap hinge (shoulders reach the sides)
 *   y = 414   strongest horizontal edge     -> top of the front pocket
 *
 * The flap is therefore 345 - 15 = 330px long. `envelope-closed.png` puts its
 * flap apex at y = 330 as well, which confirms the two PNGs are the same flap
 * in two positions — so they can be used as the two *faces* of one element that
 * rotates on the hinge, instead of being cross-faded into each other.
 */

// ---------------------------------------------------------------------------
// Source images
// ---------------------------------------------------------------------------

export const OPEN_W = 788;
export const OPEN_H = 932;
export const CLOSED_W = 788;
export const CLOSED_H = 558;

// ---------------------------------------------------------------------------
// Envelope frame landmarks
// ---------------------------------------------------------------------------

/** First opaque row of the open artwork — the tip of the raised flap. */
export const FLAP_APEX_Y = 15;
/** The fold line. The flap rotates about this edge. */
export const FLAP_HINGE_Y = 345;
/** Flap length, apex to hinge, in its raised pose. */
export const FLAP_H = FLAP_HINGE_Y - FLAP_APEX_Y; // 330

/**
 * Top edge of the front pocket. Anything drawn below this line occludes the
 * card, which is what sells "the card was physically inside the envelope".
 */
export const POCKET_TOP_Y = 414;

/** Where the pocket's X diagonals meet — the V notch. */
export const POCKET_CROSS_Y = 597;

/**
 * The back panel starts a few pixels *above* the hinge so it tucks under the
 * flap's base rather than butting against it. Two antialiased edges meeting
 * exactly on the fold leave a thin dark line along the join; overlapping them
 * puts continuous artwork behind the flap's edge instead. The overlap is hidden
 * by the flap in both poses.
 */
export const BACK_OVERLAP = 4;
export const BACK_TOP_Y = FLAP_HINGE_Y - BACK_OVERLAP; // 341

/**
 * Flap length when folded shut.
 *
 * Sized to cover the flap that is *painted into* the sealed artwork, so while
 * the envelope is closed the rotating flap sits directly on top of its own
 * pixels. That is what makes the closed state seamless: any antialiasing along
 * the flap's edge lands on identical artwork underneath, so there is no dark
 * line and no gap where the flap meets the body.
 *
 * It reads 347px shut and 330px open — a 5% difference that registers as the
 * foreshortening you would expect from a flap rotating toward the viewer.
 */
export const FLAP_CLOSED_H = 347;
export const FLAP_SQUASH = FLAP_CLOSED_H / FLAP_H; // ~1.05

/**
 * Corner radius of the closed envelope's top edge. Carried by the flap's base
 * (baked into the face as a CSS radius) and matched on the back panel while the
 * flap is down, so the two agree corner for corner.
 */
export const TOP_RADIUS = 42;

// ---------------------------------------------------------------------------
// Card — resting position, measured from the reference composite
// ---------------------------------------------------------------------------

/** Card width. 700 / 788 = ~89% of the envelope width. */
export const CARD_W = 700;
/** Card left edge; horizontally centred in the envelope frame. */
export const CARD_X = Math.round((OPEN_W - CARD_W) / 2); // 44
/**
 * Resting top edge of the card once it has been drawn out.
 *
 * Set so that roughly 85% of the card clears the envelope's front: the front's
 * V dips to y=597, and the card's lower ~110px stay tucked behind it. The
 * envelope itself does not move — the card travels.
 */
export const CARD_TOP_Y = 10;

/**
 * Where the card sits before it rises — seated in the envelope rather than
 * fully buried in it.
 *
 * 144 + 216 = 360, which is above the pocket seam (414) but below the hinge
 * (345)... deliberately between the two. While the flap is shut it covers
 * everything from the hinge down to the V notch, so the card is hidden; the
 * moment the flap lifts, the card is already sitting there in view. It then
 * rises on its own beat to reveal the rest of the design, rather than shooting
 * out of a hiding place.
 */
export const CARD_SEATED_OFFSET = 350;

// ---------------------------------------------------------------------------
// Wrapped PFP badge — position taken from the reference composite
// ---------------------------------------------------------------------------

export const PFP_SIZE = 305;
/** Centre of the badge in envelope-frame coordinates. */
export const PFP_CX = 727;
export const PFP_CY = 825;

// ---------------------------------------------------------------------------
// Scene box
// ---------------------------------------------------------------------------

/**
 * The envelope sits inset inside a slightly larger scene so the badge, the
 * ambient glow and the ground shadow have room to overflow without clipping.
 */
export const ENV_X = 70;
/** Headroom above the envelope for the card once it is drawn out. */
export const ENV_Y = 70;
export const SCENE_W = 980;
export const SCENE_H = 1100;

/** Convert envelope-frame coordinates to scene coordinates. */
export const sceneX = (x) => ENV_X + x;
export const sceneY = (y) => ENV_Y + y;

// Derived scene-space rectangles, precomputed so the component stays readable.

export const BACK_RECT = {
  left: sceneX(0),
  top: sceneY(BACK_TOP_Y),
  width: OPEN_W,
  height: OPEN_H - BACK_TOP_Y,
  /** Negative offset that slides the full PNG into place behind the clip. */
  imgTop: -BACK_TOP_Y,
};

/**
 * The sealed envelope, occupying the same rect as the back panel. Drawn over
 * the whole open construction while the flap is down, then faded out early in
 * the swing once the flap covers enough of it for the change to go unnoticed.
 * Its natural 788x557 is stretched to the body's 587 so the two agree.
 */
export const SEALED_RECT = {
  left: sceneX(0),
  // Matches the back panel, so the back's overlap never peeks above it.
  top: sceneY(BACK_TOP_Y),
  width: OPEN_W,
  height: OPEN_H - BACK_TOP_Y,
};

/**
 * The envelope front. Uses the derived `envelope-front.png`, whose upper
 * triangle is transparent, so the card shows through the envelope's opening
 * instead of being cut off along a straight line.
 */
export const POCKET_RECT = {
  left: sceneX(0),
  top: sceneY(POCKET_TOP_Y),
  width: OPEN_W,
  height: OPEN_H - POCKET_TOP_Y,
};

export const FLAP_RECT = {
  left: sceneX(0),
  top: sceneY(FLAP_APEX_Y),
  width: OPEN_W,
  height: FLAP_H,
  /**
   * Inside face: the open PNG shifted up so its apex (y=15) lands on the top
   * edge of the flap box.
   */
  insideImgTop: -FLAP_APEX_Y,
  /**
   * Outside face: `envelope-flap-outside.png`, which is already exactly the
   * size of the flap box, so it needs no offset. The face is rotated 180deg
   * about its own centre, which maps the asset's row 0 (the flap's base) onto
   * the hinge and its apex onto the top of the box — mirroring the inside face.
   *
   * That asset is derived, not hand-cut: cropping the closed artwork directly
   * would give a rectangle, because the closed envelope is a solid rounded
   * rect. `scripts/build-flap-asset.mjs` takes the colour from the closed PNG
   * and the alpha from the open PNG's flap (mirrored vertically), producing the
   * true flap silhouette with its correct outward shading. Without it, the
   * closed envelope shows a hard horizontal seam where the crop ends.
   */
  outsideImgTop: 0,
};

/**
 * Card clip window. Open at the top so a fully drawn-out card is never cut off.
 *
 * The bottom stops just inside the envelope and carries the artwork's corner
 * radius. A square clip at the envelope's full height lets the card's corners
 * poke past the envelope's *rounded* bottom corners — a sliver of card visible
 * outside the envelope. The card is hidden behind the front flaps down here
 * regardless, so clipping a little high costs nothing.
 */
export const CARD_CLIP_BOTTOM_Y = 918;
export const CARD_CLIP_RADIUS = 44;
export const CARD_CLIP_RECT = {
  left: sceneX(0),
  top: 0,
  width: OPEN_W,
  height: ENV_Y + CARD_CLIP_BOTTOM_Y,
};

export const CARD_RECT = {
  // Left is relative to the clip, which starts at the envelope's left edge.
  left: CARD_X,
  // Top is scene-relative, because the clip is open at the top of the scene.
  top: sceneY(CARD_TOP_Y),
  width: CARD_W,
};

export const PFP_RECT = {
  left: sceneX(PFP_CX) - PFP_SIZE / 2,
  top: sceneY(PFP_CY) - PFP_SIZE / 2,
  size: PFP_SIZE,
};
