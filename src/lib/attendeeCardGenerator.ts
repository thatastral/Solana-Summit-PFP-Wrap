import { getCoverCropRect, loadImage, type FocalPoint } from "./faceCrop";
import { applyGrain } from "./canvasGrain";
import { EVENT_NAME } from "../config";
import summitLogoUrl from "../assets/2026/summit-logo.svg";
import superteamLogoUrl from "../assets/2026/superteam-logo.svg";
import sidePatternUrl from "../assets/2026/side-patterns.svg";

const SIZE = 1080;
const SUMMIT_LOGO_RATIO = 48 / 105; // height / width, from the source asset
const SUPERTEAM_LOGO_RATIO = 17 / 138;
const SIDE_PATTERN_RATIO = 1261 / 307; // height / width

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

function drawSidePattern(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  x: number,
  bandWidth: number,
  cardHeight: number,
  mirror: boolean,
) {
  const tileH = bandWidth * SIDE_PATTERN_RATIO;
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, 0, bandWidth, cardHeight);
  ctx.clip();
  ctx.globalAlpha = 0.9;
  if (mirror) {
    ctx.translate(x * 2 + bandWidth, 0);
    ctx.scale(-1, 1);
  }
  for (let y = 0; y < cardHeight; y += tileH) {
    ctx.drawImage(image, x, y, bandWidth, tileH);
  }
  ctx.restore();
}

interface CardOptions {
  photo: HTMLImageElement;
  focal: FocalPoint;
  name: string;
  role: string;
  pfpDataUrl: string;
}

export async function generateAttendeeCard({
  photo,
  focal,
  name,
  role,
  pfpDataUrl,
}: CardOptions): Promise<string> {
  const canvas = document.createElement("canvas");
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext("2d")!;

  await document.fonts.ready;
  const [summitLogo, superteamLogo, sidePattern, pfpBadge] = await Promise.all([
    loadImage(summitLogoUrl),
    loadImage(superteamLogoUrl),
    loadImage(sidePatternUrl),
    loadImage(pfpDataUrl),
  ]);

  const cornerRadius = SIZE * 0.022;

  // Card background
  roundRectPath(ctx, 0, 0, SIZE, SIZE, cornerRadius);
  ctx.save();
  ctx.clip();
  ctx.fillStyle = "#023a50";
  ctx.fillRect(0, 0, SIZE, SIZE);

  // Ornamental side patterns (real asset, mirrored on the right)
  const bandWidth = SIZE * 0.079;
  drawSidePattern(ctx, sidePattern, 0, bandWidth, SIZE, false);
  drawSidePattern(ctx, sidePattern, SIZE - bandWidth, bandWidth, SIZE, true);

  // Logo lockup (wordmark + "Nigeria" badge is baked into this asset)
  const logoW = SIZE * 0.3;
  const logoH = logoW * SUMMIT_LOGO_RATIO;
  const logoX = (SIZE - logoW) / 2;
  const logoY = SIZE * 0.071;
  ctx.drawImage(summitLogo, logoX, logoY, logoW, logoH);

  // Headline copy
  ctx.fillStyle = "#cbfff6";
  ctx.font = `400 ${Math.round(SIZE * 0.038)}px 'Instrument Serif', serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  const line1Y = SIZE * 0.32;
  const line2Y = line1Y + SIZE * 0.05;
  ctx.fillText("Just reserved my spot at", SIZE / 2, line1Y);
  ctx.fillText(`${EVENT_NAME}.`, SIZE / 2, line2Y);

  // Square user photo
  const photoSize = SIZE * 0.253;
  const photoX = (SIZE - photoSize) / 2;
  const photoY = SIZE * 0.423;
  const photoRadius = SIZE * 0.02;

  ctx.save();
  ctx.shadowColor = "rgba(0, 24, 34, 0.4)";
  ctx.shadowBlur = SIZE * 0.02;
  ctx.shadowOffsetY = SIZE * 0.008;
  roundRectPath(ctx, photoX, photoY, photoSize, photoSize, photoRadius);
  ctx.fillStyle = "#000";
  ctx.fill();
  ctx.restore();

  ctx.save();
  roundRectPath(ctx, photoX, photoY, photoSize, photoSize, photoRadius);
  ctx.clip();
  const { sx, sy, size } = getCoverCropRect(photo.naturalWidth, photo.naturalHeight, focal);
  ctx.drawImage(photo, sx, sy, size, size, photoX, photoY, photoSize, photoSize);
  ctx.restore();

  // Name + role
  const nameY = photoY + photoSize + SIZE * 0.078;
  ctx.fillStyle = "#cbfff6";
  ctx.font = `400 ${Math.round(SIZE * 0.042)}px 'Instrument Serif', serif`;
  ctx.fillText(name || "Guest", SIZE / 2, nameY);

  if (role.trim()) {
    ctx.font = `400 ${Math.round(SIZE * 0.026)}px 'Instrument Serif', serif`;
    ctx.fillStyle = "rgba(203, 255, 246, 0.85)";
    ctx.fillText(role, SIZE / 2, nameY + SIZE * 0.056);
  }

  // Bottom "Powered by Superteam" bar
  const barH = SIZE * 0.0533;
  ctx.fillStyle = "#89de66";
  ctx.fillRect(0, SIZE - barH, SIZE, barH);

  const superteamW = SIZE * 0.13;
  const superteamH = superteamW * SUPERTEAM_LOGO_RATIO;
  ctx.font = `italic 700 ${Math.round(SIZE * 0.019)}px 'General Sans', sans-serif`;
  ctx.fillStyle = "#023a50";
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";
  const barCenterY = SIZE - barH / 2;
  ctx.fillText("Powered by", SIZE / 2 - superteamW / 2 - SIZE * 0.012, barCenterY + SIZE * 0.001);
  ctx.drawImage(superteamLogo, SIZE / 2 - superteamW / 2, barCenterY - superteamH / 2, superteamW, superteamH);

  applyGrain(ctx, SIZE, SIZE);

  ctx.restore(); // end outer clip

  // Overlapping circular PFP badge, bottom-right, matching the Figma tilt
  const badgeSize = SIZE * 0.22;
  const badgeCx = SIZE * 0.87;
  const badgeCy = SIZE * 0.855;

  ctx.save();
  ctx.translate(badgeCx, badgeCy);
  ctx.rotate((-14.18 * Math.PI) / 180);

  // Drop shadow only -- the PFP image already has its own baked-in white
  // border, so this backing circle stays the same size as the badge itself
  // rather than adding a second visible ring.
  ctx.save();
  ctx.shadowColor = "rgba(0, 24, 34, 0.45)";
  ctx.shadowBlur = SIZE * 0.025;
  ctx.beginPath();
  ctx.arc(0, 0, badgeSize / 2, 0, Math.PI * 2);
  ctx.fillStyle = "#fff";
  ctx.fill();
  ctx.restore();

  ctx.beginPath();
  ctx.arc(0, 0, badgeSize / 2, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();
  ctx.drawImage(pfpBadge, -badgeSize / 2, -badgeSize / 2, badgeSize, badgeSize);
  ctx.restore();

  return canvas.toDataURL("image/png", 1);
}
