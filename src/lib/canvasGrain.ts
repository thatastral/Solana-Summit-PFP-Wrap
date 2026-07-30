let grainTile: HTMLCanvasElement | null = null;

function getGrainTile(): HTMLCanvasElement {
  if (grainTile) return grainTile;
  const size = 128;
  const tile = document.createElement("canvas");
  tile.width = size;
  tile.height = size;
  const ctx = tile.getContext("2d")!;
  const imageData = ctx.createImageData(size, size);
  for (let i = 0; i < imageData.data.length; i += 4) {
    const v = Math.floor(Math.random() * 255);
    imageData.data[i] = v;
    imageData.data[i + 1] = v;
    imageData.data[i + 2] = v;
    imageData.data[i + 3] = 255;
  }
  ctx.putImageData(imageData, 0, 0);
  grainTile = tile;
  return tile;
}

/** Subtle film-grain texture, matching the noise treatment on the reference card art. */
export function applyGrain(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  opacity = 0.045,
) {
  const pattern = ctx.createPattern(getGrainTile(), "repeat");
  if (!pattern) return;
  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.globalCompositeOperation = "overlay";
  ctx.fillStyle = pattern;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();
}
