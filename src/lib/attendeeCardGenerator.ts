import { getCoverCropRect, loadImage, type FocalPoint } from "./faceCrop";
import cardBgUrl from "../assets/2026/attendee-card-bg.webp";

/*
  Exports at the background artwork's own resolution. Every pixel of the
  baked-in logo, headline and side patterns is then drawn 1:1, which is the
  only way they stay genuinely sharp -- rendering larger would mean upscaling
  the artwork, and a soft headline is exactly what that produces.

  If a 2160px background is ever supplied, raise this to 2160 and nothing
  else needs to change: every placement below is a fraction of the card.
*/
const SIZE = 1080;

/*
  Placement measured off the approved reference card (Card PNG(New).png),
  expressed as fractions so they hold at any output size. The background art
  already carries the logo, headline, side patterns and Superteam bar --
  only the photo, name and role are composited on top.

  Measured at 1080: photo 450x450 with its top edge at y=373.5, centred
  horizontally, 55.5px corner radius; name baseline y=903; role baseline
  y=952.

  The type sizes are 53.5 and 34.5, not the 56 and 36 the design reports.
  Both are 95.7% of the stated figure -- the same ratio for each -- which is
  what a text layer resized by dragging in Figma looks like: the layer keeps
  its nominal size and draws scaled. These were fitted by rendering
  candidates and scoring them against the reference export pixel by pixel,
  so they match what the card is supposed to look like. Setting the nominal
  56/36 here draws visibly larger than the approved artwork.
*/
const PHOTO_TOP = 373.5 / 1080;
const PHOTO_SIZE = 450 / 1080;
const PHOTO_RADIUS = 55.5 / 450; // of the photo, not the card
const NAME_BASELINE = 903 / 1080;
const ROLE_BASELINE = 952 / 1080;
const NAME_FONT = 53.5 / 1080;
const ROLE_FONT = 34.5 / 1080;

/*
  The artwork's corners are square, but its outermost 1px ring is partly
  transparent from the export's antialiasing (alpha 191, dropping to 112 at
  the corner pixels). The card must export fully opaque, so an oversized copy
  is drawn underneath first, pushed out far enough that its own translucent
  ring falls outside the canvas entirely. 1px is not enough -- the ring
  lands back on the corner once resampled and leaves alpha at 253.

  Everything inside still comes from the 1:1 draw on top, so the artwork is
  never resampled where it can be seen.
*/
const EDGE_BLEED = 3;

function roundRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

export interface AttendeeCardOptions {
  photo: HTMLImageElement;
  focal: FocalPoint;
  name: string;
  role: string;
}

export async function generateAttendeeCard({
  photo,
  focal,
  name,
  role,
}: AttendeeCardOptions): Promise<string> {
  const canvas = document.createElement("canvas");
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext("2d")!;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  /* Deliberately not rounded -- the fitted sizes land on half pixels, and
     canvas renders fractional sizes exactly. */
  const nameFontPx = SIZE * NAME_FONT;
  const roleFontPx = SIZE * ROLE_FONT;
  const nameFont = `400 ${nameFontPx}px 'Calendas Plus', serif`;
  const roleFont = `400 ${roleFontPx}px 'Calendas Plus', serif`;

  /*
    Ask for the font explicitly, by the exact size it will be drawn at.

    `document.fonts.ready` alone is not enough and silently gives the wrong
    result: it resolves once *pending* loads finish, and a face nothing has
    requested yet is not pending. Canvas never triggers a webfont load on its
    own -- assigning ctx.font for an unloaded family just falls back, with no
    error. The cards were rendering in Times because of this.
  */
  await Promise.all([
    document.fonts.load(nameFont),
    document.fonts.load(roleFont),
  ]);
  await document.fonts.ready;

  const background = await loadImage(cardBgUrl);

  const bleed = EDGE_BLEED;
  ctx.drawImage(background, -bleed, -bleed, SIZE + bleed * 2, SIZE + bleed * 2);
  ctx.drawImage(background, 0, 0, SIZE, SIZE);

  // Photo: rounded square, centred, cropped around the detected face.
  const photoSize = SIZE * PHOTO_SIZE;
  const photoX = (SIZE - photoSize) / 2;
  const photoY = SIZE * PHOTO_TOP;
  const photoRadius = photoSize * PHOTO_RADIUS;

  ctx.save();
  ctx.shadowColor = "rgba(0, 20, 30, 0.35)";
  ctx.shadowBlur = SIZE * 0.018;
  ctx.shadowOffsetY = SIZE * 0.006;
  roundRectPath(ctx, photoX, photoY, photoSize, photoSize, photoRadius);
  ctx.fillStyle = "#0b2b3a";
  ctx.fill();
  ctx.restore();

  ctx.save();
  roundRectPath(ctx, photoX, photoY, photoSize, photoSize, photoRadius);
  ctx.clip();
  const { sx, sy, size } = getCoverCropRect(photo.naturalWidth, photo.naturalHeight, focal);
  ctx.drawImage(photo, sx, sy, size, size, photoX, photoY, photoSize, photoSize);
  ctx.restore();

  // Name + role
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";

  /* Name and role are the same colour on the reference -- the role is not
     dimmed, it is simply set smaller. */
  ctx.fillStyle = "#cbfff6";

  ctx.font = nameFont;
  ctx.fillText(name.trim() || "Guest", SIZE / 2, SIZE * NAME_BASELINE);

  if (role.trim()) {
    ctx.font = roleFont;
    ctx.fillText(role.trim(), SIZE / 2, SIZE * ROLE_BASELINE);
  }

  /* No outline baked in -- the border is a presentation detail applied on
     screen, so the downloaded asset stays clean and reusable. */
  return canvas.toDataURL("image/png", 1);
}
