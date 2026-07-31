import { getCoverCropRect, loadImage, type FocalPoint } from "./faceCrop";
import wrapPngUrl from "../assets/2026/pfp-wrap.png";

// Same technique as the 2025 PFPFrameGenerator: fill the circle, cover-fit
// the photo into it, then stamp the wrap overlay on top and finish with a
// multiply-blend inner shadow. The wrap element itself is swapped for the new
// "Attending Solana Summit Nigeria" artwork.
//
// 1080 is the standard avatar export size; the wrap art is 486 native, so it
// is the limiting factor on ring sharpness while the user's photo benefits
// from the full resolution.
const SIZE = 1080;

export async function generatePfp(
  photo: HTMLImageElement,
  focal: FocalPoint,
): Promise<string> {
  const canvas = document.createElement("canvas");
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext("2d")!;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  await document.fonts.ready;

  // Background fill (was #c7eafd)
  ctx.fillStyle = "#89de66";
  ctx.beginPath();
  ctx.arc(SIZE / 2, SIZE / 2, SIZE / 2, 0, Math.PI * 2);
  ctx.fill();

  // Cover-fit photo across the full circle
  ctx.save();
  ctx.beginPath();
  ctx.arc(SIZE / 2, SIZE / 2, SIZE / 2, 0, Math.PI * 2);
  ctx.clip();

  const { sx, sy, size } = getCoverCropRect(photo.naturalWidth, photo.naturalHeight, focal);
  ctx.drawImage(photo, sx, sy, size, size, 0, 0, SIZE, SIZE);
  ctx.restore();

  /*
    Wrap overlay. The source art sits inset within its canvas (its ring
    only spans ~75% of the radius), so it is scaled up until the ring meets
    the circle's circumference -- the LinkedIn "#Hiring" treatment, where
    the band hugs the very edge of the avatar.
  */
  const wrapImage = await loadImage(wrapPngUrl);
  const WRAP_SCALE = 1.335;
  const wrapSize = SIZE * WRAP_SCALE;
  const wrapOffset = (SIZE - wrapSize) / 2;

  ctx.save();
  ctx.beginPath();
  ctx.arc(SIZE / 2, SIZE / 2, SIZE / 2, 0, Math.PI * 2);
  ctx.clip();
  ctx.drawImage(wrapImage, wrapOffset, wrapOffset, wrapSize, wrapSize);
  ctx.restore();

  // Inner shadow (was rgba(76,168,207,*))
  ctx.save();
  ctx.globalCompositeOperation = "multiply";
  const shadowGradient = ctx.createRadialGradient(
    SIZE / 2,
    SIZE / 2,
    SIZE / 2 - SIZE * 0.062,
    SIZE / 2,
    SIZE / 2,
    SIZE / 2,
  );
  shadowGradient.addColorStop(0, "rgba(2, 58, 80, 0)");
  shadowGradient.addColorStop(0.7, "rgba(2, 58, 80, 0.1)");
  shadowGradient.addColorStop(1, "rgba(2, 58, 80, 0.3)");
  ctx.fillStyle = shadowGradient;
  ctx.beginPath();
  ctx.arc(SIZE / 2, SIZE / 2, SIZE / 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  /* No border baked in -- the white ring is a presentation detail applied on
     screen, so the exported avatar stays clean against any backdrop. */

  return canvas.toDataURL("image/png", 1.0);
}
