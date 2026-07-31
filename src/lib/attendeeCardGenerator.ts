import { getCoverCropRect, loadImage, type FocalPoint } from "./faceCrop";
import cardBgUrl from "../assets/2026/attendee-card-bg.webp";

/* Exports at the background artwork's own resolution, so the download is as
   crisp as the source allows with no upscaling anywhere in the pipeline. */
const SIZE = 2160;

/*
  Placement measured off the approved reference card, expressed as
  fractions of the card so they hold at any output size. The background art
  already carries the logo, headline, side patterns and Superteam bar --
  only the photo, name and role are composited on top.
*/
const PHOTO_TOP = 0.431;
const PHOTO_SIZE = 0.2514;
const NAME_BASELINE = 0.7677;
const ROLE_BASELINE = 0.8238;
const NAME_FONT = 0.056;
const ROLE_FONT = 0.04;

/* Matches the rounded corners already cut into the background artwork, so the
   clip follows its silhouette instead of squaring it off or leaving a fringe. */
const CARD_RADIUS = 0.033;

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

  await document.fonts.ready;
  const background = await loadImage(cardBgUrl);

  const radius = SIZE * CARD_RADIUS;

  ctx.save();
  roundRectPath(ctx, 0, 0, SIZE, SIZE, radius);
  ctx.clip();
  ctx.drawImage(background, 0, 0, SIZE, SIZE);

  // Photo: rounded square, centred, cropped around the detected face.
  const photoSize = SIZE * PHOTO_SIZE;
  const photoX = (SIZE - photoSize) / 2;
  const photoY = SIZE * PHOTO_TOP;
  const photoRadius = photoSize * 0.11;

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

  ctx.fillStyle = "#cbfff6";
  ctx.font = `400 ${Math.round(SIZE * NAME_FONT)}px 'Calendas Plus', serif`;
  ctx.fillText(name.trim() || "Guest", SIZE / 2, SIZE * NAME_BASELINE);

  if (role.trim()) {
    ctx.font = `400 ${Math.round(SIZE * ROLE_FONT)}px 'Calendas Plus', serif`;
    ctx.fillStyle = "rgba(203, 255, 246, 0.88)";
    ctx.fillText(role.trim(), SIZE / 2, SIZE * ROLE_BASELINE);
  }

  ctx.restore(); // end card clip

  /* No outline baked in -- the border is a presentation detail applied on
     screen, so the downloaded asset stays clean and reusable. */
  return canvas.toDataURL("image/png", 1);
}
