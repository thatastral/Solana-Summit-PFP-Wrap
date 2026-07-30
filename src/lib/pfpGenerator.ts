import { getCoverCropRect, loadImage, type FocalPoint } from "./faceCrop";
import ringTextUrl from "../assets/2026/pfp-ring-text.svg";

// Same technique as the 2025 PFPFrameGenerator: fill the circle, cover-fit
// the photo into it, then stamp a pre-rendered ring+text overlay on top and
// finish with a multiply-blend inner shadow. Only the colors changed.
const SIZE = 400;
const RING_PNG_SIZE = 433; // overlay is authored slightly larger than the circle, like the original asset

export async function generatePfp(
  photo: HTMLImageElement,
  focal: FocalPoint,
): Promise<string> {
  const canvas = document.createElement("canvas");
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext("2d")!;

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

  // Ring + circular text overlay
  const ringImage = await loadImage(ringTextUrl);
  ctx.save();
  ctx.beginPath();
  ctx.arc(SIZE / 2, SIZE / 2, SIZE / 2, 0, Math.PI * 2);
  ctx.clip();
  const offset = (SIZE - RING_PNG_SIZE) / 2;
  ctx.drawImage(ringImage, offset, offset, RING_PNG_SIZE, RING_PNG_SIZE);
  ctx.restore();

  // Inner shadow (was rgba(76,168,207,*))
  ctx.save();
  ctx.globalCompositeOperation = "multiply";
  const shadowGradient = ctx.createRadialGradient(
    SIZE / 2,
    SIZE / 2,
    SIZE / 2 - 30,
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

  return canvas.toDataURL("image/png", 1.0);
}
