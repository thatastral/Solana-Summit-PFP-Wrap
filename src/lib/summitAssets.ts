/**
 * Public entry point for the two generated Summit assets.
 *
 * Both are pure functions that take a photo plus the attendee's details and
 * resolve to a PNG data URL, with no dependency on the surrounding screens.
 * Anything that needs them -- the result reveal, or the envelope component
 * being built alongside it -- should import from here rather than reaching
 * into the individual generator modules.
 */
export { generatePfp } from "./pfpGenerator";
export { generateAttendeeCard, type AttendeeCardOptions } from "./attendeeCardGenerator";
export { detectFocalPoint, loadImage, type FocalPoint } from "./faceCrop";

import { generatePfp } from "./pfpGenerator";
import { generateAttendeeCard } from "./attendeeCardGenerator";
import { detectFocalPoint, loadImage, type FocalPoint } from "./faceCrop";

export interface SummitIdentityInput {
  /** Data URL or same-origin URL of the attendee's photo. */
  photoSrc: string;
  name: string;
  role?: string;
  /** Skips face detection when the crop centre is already known. */
  focal?: FocalPoint;
}

export interface SummitIdentity {
  pfpDataUrl: string;
  cardDataUrl: string;
  focal: FocalPoint;
}

/**
 * Builds both assets from a single photo in one call -- the convenience
 * wrapper most consumers want.
 */
export async function generateSummitIdentity({
  photoSrc,
  name,
  role = "",
  focal,
}: SummitIdentityInput): Promise<SummitIdentity> {
  const photo = await loadImage(photoSrc);
  const focalPoint = focal ?? (await detectFocalPoint(photo));

  const pfpDataUrl = await generatePfp(photo, focalPoint);
  const cardDataUrl = await generateAttendeeCard({
    photo,
    focal: focalPoint,
    name,
    role,
  });

  return { pfpDataUrl, cardDataUrl, focal: focalPoint };
}
