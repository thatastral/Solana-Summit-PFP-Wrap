import { REGISTER_URL } from "../config";

/**
 * Saving and sharing the generated assets.
 *
 * Both actions do exactly what their label says on every device: Download
 * saves the files, Share on X opens X. Neither ever raises the operating
 * system's share sheet.
 *
 * An earlier version routed mobile through `navigator.share`, because on iOS
 * that is the only route that lands a picture in Photos rather than Files.
 * It was the wrong trade: tapping "Download" and getting a sheet asking where
 * to send things is a different action from the one the button offered, and
 * dismissing it left the user with nothing. Predictable beats convenient.
 */

const SITE_URL =
  typeof window !== "undefined" ? window.location.origin : "https://solana-summit26-pfp-wrap.vercel.app";

export const SHARE_TEXT = `Just reserved my spot at Solana Summit Nigeria.

Create your official Summit identity 👇`;

/**
 * Triggers a save via a blob URL rather than the raw data URL.
 *
 * A 2160px PNG is several megabytes of base64; handing that string to an
 * anchor makes the browser re-parse it on click, and Safari in particular
 * treats a large `data:` navigation as something it can quietly drop. A blob
 * is already decoded bytes, so the click is cheap and both files can be
 * fired in the same tick.
 */
function anchorDownload(blobUrl: string, filename: string) {
  const link = document.createElement("a");
  link.href = blobUrl;
  link.download = filename;
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  link.remove();
}

function dataUrlToBlobUrl(dataUrl: string): string {
  const [header, encoded] = dataUrl.split(",");
  const mime = /:(.*?);/.exec(header)?.[1] ?? "image/png";
  const binary = atob(encoded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return URL.createObjectURL(new Blob([bytes], { type: mime }));
}

/** Frees the object URLs once the browser has had time to start the saves. */
function releaseLater(urls: string[]) {
  setTimeout(() => urls.forEach((u) => URL.revokeObjectURL(u)), 60_000);
}

export interface SummitAssets {
  pfpDataUrl: string;
  cardDataUrl: string;
}

/**
 * Saves both assets straight to the device.
 *
 * Both saves fire in the same tick, inside the click that asked for them, so
 * the two files arrive together and neither falls outside the gesture the
 * browser is willing to honour.
 */
export function saveAssets({ pfpDataUrl, cardDataUrl }: SummitAssets): void {
  const pfpUrl = dataUrlToBlobUrl(pfpDataUrl);
  const cardUrl = dataUrlToBlobUrl(cardDataUrl);
  anchorDownload(pfpUrl, "solana-summit-nigeria-pfp.png");
  anchorDownload(cardUrl, "solana-summit-nigeria-attending-card.png");
  releaseLater([pfpUrl, cardUrl]);
}

/**
 * Opens X with the copy pre-filled, and saves the card alongside it.
 *
 * X's web intent carries text and a URL only -- it cannot take an image, and
 * nothing in the browser can attach one to it. So the card is saved at the
 * same time, ready to attach in one tap once the composer is open.
 */
export function shareToX({ cardDataUrl }: SummitAssets): void {
  /*
    Opened first and synchronously. Popup blockers judge a window by how
    directly it follows the click, so anything slower in front of it -- like
    decoding a multi-megabyte PNG -- gets the tab blocked.
  */
  const intent = new URL("https://x.com/intent/tweet");
  intent.searchParams.set("text", SHARE_TEXT);
  intent.searchParams.set("url", SITE_URL);
  window.open(intent.toString(), "_blank", "noopener,noreferrer");

  // Then save the card, so it is waiting in downloads ready to attach.
  const cardUrl = dataUrlToBlobUrl(cardDataUrl);
  anchorDownload(cardUrl, "solana-summit-nigeria-attending-card.png");
  releaseLater([cardUrl]);
}

export { REGISTER_URL };
