/**
 * Draws text evenly spaced around a circle, clockwise, starting at
 * `startAngle` (radians, 0 = 3 o'clock). Each character is rotated so its
 * baseline is tangent to the circle -- the standard "stamp/coin" text
 * technique built from primitives (no font-on-path plugin needed).
 */
export function drawCircularText(
  ctx: CanvasRenderingContext2D,
  text: string,
  centerX: number,
  centerY: number,
  radius: number,
  startAngle: number,
  options: { font: string; color: string; letterSpacing?: number } = {
    font: "16px sans-serif",
    color: "#000",
  },
) {
  ctx.save();
  ctx.font = options.font;
  ctx.fillStyle = options.color;
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";

  ctx.translate(centerX, centerY);
  ctx.rotate(startAngle);

  const spacing = options.letterSpacing ?? 1;
  for (const char of text) {
    const charWidth = ctx.measureText(char).width + spacing;
    const theta = charWidth / radius;
    ctx.rotate(theta / 2);
    ctx.save();
    ctx.translate(0, -radius);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(char, 0, 0);
    ctx.restore();
    ctx.rotate(theta / 2);
  }

  ctx.restore();
}
