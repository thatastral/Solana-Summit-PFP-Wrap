import { getCoverCropRect, loadImage, type FocalPoint } from "./faceCrop";
import wrapPngUrl from "../assets/2026/pfp-wrap.png";

// Same technique as the 2025 PFPFrameGenerator: fill the circle, cover-fit
// the photo into it, then stamp the wrap overlay on top and finish with a
// multiply-blend inner shadow + white border. The wrap element itself is
// swapped for the new "Attending Solana Summit Nigeria" artwork.
const SIZE = 486; // matches the wrap artwork's native resolution 1:1, no upscaling
const BORDER_WIDTH = 5;

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

  // Wrap overlay (the "Attending Solana Summit Nigeria" ring artwork)
  const wrapImage = await loadImage(wrapPngUrl);
  ctx.save();
  ctx.beginPath();
  ctx.arc(SIZE / 2, SIZE / 2, SIZE / 2, 0, Math.PI * 2);
  ctx.clip();
  ctx.drawImage(wrapImage, 0, 0, SIZE, SIZE);
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

  // White border ring, matching the target reference
  ctx.save();
  ctx.lineWidth = BORDER_WIDTH;
  ctx.strokeStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(SIZE / 2, SIZE / 2, SIZE / 2 - BORDER_WIDTH / 2, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  return canvas.toDataURL("image/png", 1.0);
}
