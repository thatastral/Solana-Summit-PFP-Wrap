export interface FocalPoint {
  x: number; // 0..1, normalized horizontal center of the face
  y: number; // 0..1, normalized vertical center of the face
}

const DEFAULT_FOCAL_POINT: FocalPoint = { x: 0.5, y: 0.38 };

/**
 * Best-effort face location so uploaded portraits crop sensibly into the
 * circular PFP and square card frame without any manual editing UI. Uses the
 * browser FaceDetector API where available (a handful of Chromium builds);
 * everywhere else it falls back to a fixed focal point tuned for typical
 * headshot/selfie framing (face sits slightly above center).
 */
export async function detectFocalPoint(image: HTMLImageElement): Promise<FocalPoint> {
  const FaceDetectorCtor = (window as any).FaceDetector;
  if (!FaceDetectorCtor) return DEFAULT_FOCAL_POINT;

  try {
    const detector = new FaceDetectorCtor({ fastMode: true, maxDetectedFaces: 1 });
    const faces = await detector.detect(image);
    if (!faces?.length) return DEFAULT_FOCAL_POINT;

    const { boundingBox } = faces[0];
    const cx = (boundingBox.x + boundingBox.width / 2) / image.naturalWidth;
    const cy = (boundingBox.y + boundingBox.height / 2) / image.naturalHeight;
    return {
      x: Math.min(0.9, Math.max(0.1, cx)),
      y: Math.min(0.85, Math.max(0.1, cy)),
    };
  } catch {
    return DEFAULT_FOCAL_POINT;
  }
}

/**
 * Computes the source rectangle (in source-image pixel space) to draw for a
 * square, face-aware "object-fit: cover" crop, given a focal point.
 */
export function getCoverCropRect(
  imgWidth: number,
  imgHeight: number,
  focal: FocalPoint,
) {
  const size = Math.min(imgWidth, imgHeight);
  const maxX = imgWidth - size;
  const maxY = imgHeight - size;

  const idealX = focal.x * imgWidth - size / 2;
  const idealY = focal.y * imgHeight - size / 2;

  return {
    sx: Math.min(Math.max(idealX, 0), maxX),
    sy: Math.min(Math.max(idealY, 0), maxY),
    size,
  };
}

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
